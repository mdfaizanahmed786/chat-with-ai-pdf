"use server";

import { adminDb, adminStorage } from "@/firebaseAdmin";
import { indexName } from "@/lib/langchain";
import pineconeClient from "@/lib/pinecone";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteDocument(id: string) {
  // delete the document with the id
  auth().protect();
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }
  if (!id) {
    throw new Error("Document not found");
  }
  try {
    await adminDb.collection("users").doc(userId).collection("files").doc(id).delete();
      // Delete from firebase storage
  await adminStorage
  .bucket(process.env.FIREBASE_STORAGE_BUCKET)
  .file(`users/${userId}/files/${id}`)
  .delete();

    // Delete from pinecone
// Delete all embeddings associated with the document
  const index = await pineconeClient.index(indexName);
  await index.namespace(id).deleteAll();

  } catch (error) {
    console.error("Error deleting document", error);
    throw new Error("Error deleting document");
  }

  revalidatePath("/dashboard");

}
