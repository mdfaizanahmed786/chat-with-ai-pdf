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


const model=new ChatOpenAI({
    apiKey:process.env.OPENAI_API_KEY,
    model:"gpt-3.5-turbo"
})

export const indexName="chataipdf"

async function namespacesExists(index:Index<RecordMetadata>, namespace:string){
    if(!namespace) return;
    // This function checks if a namespace exists in the pinecone index
    const {namespaces}=await index.describeIndexStats();

    return namespaces?.[namespace]!==undefined

}

async function generateDocs(docId:string){
    const {userId}=auth();
    if(!userId) throw new Error("User not authenticated")

    // GET download url from firebase admin now
console.log("----Downloading pdf from firebase----")
    const pdfDoc=await adminDb.collection("users").doc(userId).collection("files").doc(docId).get()
    const downloadURL=pdfDoc.data()?.downloadURL
    if(!downloadURL){
        throw new Error("Download URL not found")
    }

    console.log(`Download URL: ${downloadURL}`) 
    const response=await fetch(downloadURL) 

    // Load the pdf document and this is one big document
    const data=await response.blob();
    console.log(`This is some data after blob: ${data}`)
    // Load the pdf document
    const loader=new PDFLoader(data)
    const docs=await loader.load()

    // Splitting the document into smaller chunks

    const splitter=new RecursiveCharacterTextSplitter()
    // the below might give 2 page file into 9 chunks..
    const splitDocs=await splitter.splitDocuments(docs)
    // Not pdf image, but pdf document with text..
    console.log(`-----Split docs: ${splitDocs.length}-----`)

    return splitDocs;
}

export async function getPineConeEmbeddingsVectorStore(docId:string){
    const {userId}=auth();
    if(!userId){
        throw new Error("User not authenticated")
    }

    let pineConeVectorStore;

    // Generating embeddings for pdf document

    console.log("----Generating embeddings---")


    const embeddings=new OpenAIEmbeddings()

    // connect to pinecone 
    const index=await pineconeClient.index(indexName)
    const namespacesExist=await namespacesExists(index, docId)
    if(namespacesExist){
        console.log("Namespace already exists"+docId)
        pineConeVectorStore=await PineconeStore.fromExistingIndex(embeddings,{
            pineconeIndex:index,
            namespace:docId
        })
        return pineConeVectorStore;
    }
   
        //if the namespace doesn't exits, we have to download the pdf from the firebase storage and generate embeddings and store it in the pinecore index

        const splitDocs=await generateDocs(docId)
        console.log(`Storing the embeddings in the namespace, ${docId} in the index ${indexName}`)
        pineConeVectorStore=await PineconeStore.fromDocuments(splitDocs, embeddings,{
            pineconeIndex:index,
            namespace:docId
        })
    
       return pineConeVectorStore;

}