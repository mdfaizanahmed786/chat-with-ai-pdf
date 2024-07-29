import { ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineconeClient from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { adminDb } from "../firebaseAdmin";
import { auth } from "@clerk/nextjs/server";

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-3.5-turbo",
});

export const indexName = "chataipdf";

async function fetchMessages(docId: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const chatRef = adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .collection("chat")
    .orderBy("createdAt", "asc");
  const chats = await chatRef.get();

  // We are passing this to langchain now

  const chatHistory = chats.docs.map((doc) => {
    const data = doc.data();
    if (data.role === "human") {
      return new HumanMessage(data.message);
    } else {
      return new AIMessage(data.message);
    }
  });

  console.log(`Chat history length: ${chatHistory.length}`);
  console.log(
    `Chat history: ${chatHistory.map((msg) => msg.text).join(" ").length}`
  );

  return chatHistory;
}

async function namespacesExists(
  index: Index<RecordMetadata>,
  namespace: string
) {
  if (!namespace) return;
  // This function checks if a namespace exists in the pinecone index
  const { namespaces } = await index.describeIndexStats();

  return namespaces?.[namespace] !== undefined;
}

async function generateDocs(docId: string) {
  const { userId } = auth();
  if (!userId) throw new Error("User not authenticated");

  // GET download url from firebase admin now
  console.log("----Downloading pdf from firebase----");
  const pdfDoc = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .get();
  const downloadURL = pdfDoc.data()?.downloadURL;
  if (!downloadURL) {
    throw new Error("Download URL not found");
  }

  console.log(`Download URL: ${downloadURL}`);
  const response = await fetch(downloadURL);

  // Load the pdf document and this is one big document
  const data = await response.blob();
  console.log(`This is some data after blob: ${data}`);
  // Load the pdf document
  const loader = new PDFLoader(data);
  const docs = await loader.load();

  // Splitting the document into smaller chunks

  const splitter = new RecursiveCharacterTextSplitter();
  // the below might give 2 page file into 9 chunks..
  const splitDocs = await splitter.splitDocuments(docs);
  // Not pdf image, but pdf document with text..
  console.log(`-----Split docs: ${splitDocs.length}-----`);

  return splitDocs;
}

export async function getPineConeEmbeddingsVectorStore(docId: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  let pineConeVectorStore;

  // Generating embeddings for pdf document

  console.log("----Generating embeddings---");

  const embeddings = new OpenAIEmbeddings();

  // connect to pinecone
  const index = await pineconeClient.index(indexName);
  const namespacesExist = await namespacesExists(index, docId);
  if (namespacesExist) {
    console.log("Namespace already exists" + docId);
    pineConeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: docId,
    });
    return pineConeVectorStore;
  }

  //if the namespace doesn't exits, we have to download the pdf from the firebase storage and generate embeddings and store it in the pinecore index

  const splitDocs = await generateDocs(docId);
  console.log(
    `Storing the embeddings in the namespace, ${docId} in the index ${indexName}`
  );
  pineConeVectorStore = await PineconeStore.fromDocuments(
    splitDocs,
    embeddings,
    {
      pineconeIndex: index,
      namespace: docId,
    }
  );

  return pineConeVectorStore;
}

export async function generateLangChainCompletion(
  docId: string,
  question: string
) {
  let pineConeVectorStore;

  pineConeVectorStore = await getPineConeEmbeddingsVectorStore(docId);
  if (!pineConeVectorStore) {
    throw new Error("Pinecone vector store not found");
  }

  console.log(
    "-----Creating a retriever to search through the vector store (includes: vectors and their relations that get fed into the model-----"
  );

  const retriever = await pineConeVectorStore.asRetriever();

  //    find previous messages from the db
  const chatHistory = await fetchMessages(docId);

  // Define the prompt template
  console.log("----Creating a prompt template----");

  const historyAwareTemplate = ChatPromptTemplate.fromMessages([
    ...chatHistory,
    ["user", "{input}"],
    [
      "user",
      "Given above the conversation, generate a search query to look up in order to information relevant to the conversation ",
    ],
  ]);

  console.log("----Creating a history aware retriever chain----");
  //   Constructs a retriever chain that utilizes the prompt template to generate relevant search queries based on the conversation context. This ensures that the queries are contextually aware and tailored to the ongoing conversation.

  // Example Workflow
  // User Sends a Message: The user inputs a message, which is added to the conversation history.
  // Prompt Generation: The prompt template combines the conversation history with the instruction to generate a search query.
  // Query Generation: The language model processes the prompt to generate a relevant search query.
  // Retrieval: The history-aware retriever uses the generated query to fetch relevant information from the data source (e.g., Pinecone index).

  const historyAwareRetrieverChain = await createHistoryAwareRetriever({
    llm: model,
    retriever,
    rephrasePrompt: historyAwareTemplate,
  });

  //   Define the prompt template for answering the questions
  const historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Answer the user's question based on the below context {context}",
    ],
    ...chatHistory,
    ["user", "{input}"],
  ]);

  // Creating a document combining chain
  console.log("----Creating a document combining chain----");
  const historyAwareDocCombiningChain = await createStuffDocumentsChain({
    llm: model,
    prompt: historyAwareRetrievalPrompt,
  });

  // Combining the retriever and the document combining chain
  console.log(
    "----Combining the retriever and the document combining chain forming a main chain----"
  );
  const conversationRetrieverChain = await createRetrievalChain({
    retriever: historyAwareRetrieverChain,
    combineDocsChain: historyAwareDocCombiningChain,
  });

    // Generate the completion with

    console.log("----Running the chain with a sample conversation-----")
    const reply=await conversationRetrieverChain.invoke({
        chat_history:chatHistory,
        input:question
    })

    console.log(`Reply: ${reply.answer}`)

    return reply.answer
}
