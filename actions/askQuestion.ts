"use server";

import { Message } from "@/components/Chat";
import { adminDb } from "@/firebaseAdmin";
import { generateLangChainCompletion } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";


export async function askQuestion(id: string, question: string) {
  auth().protect();
  const { userId } = await auth();
  // getting the references for the chat that we are storing
  const chatRef = adminDb
    .collection("users")
    .doc(userId!)
    .collection("files")
    .doc(id)
    .collection("chat");
  const chatSnapShot = await chatRef.get();

  const userMessages = chatSnapShot.docs.filter(
    (doc) => doc.data().role === "human"
  );

  const userMessage: Message = {
    message: question,
    role: "human",
    createdAt: new Date(),
  };

//   When to use add and setDoc
// 1. setDoc is used to set a document with a specific id and to update the document if it already exists.
// 2. add is used to add a document with a random id to a collection.
  await chatRef.add(userMessage);


//   Generate ai response

const reply=await generateLangChainCompletion(id, question)

const aiMessage:Message={
    message:reply,
    role:"ai",
    createdAt:new Date()
}

await chatRef.add(aiMessage)


  return {
    message: null,
    success: true,
  };
}
