import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
export enum StatusText {
  UPLOADING = "UPLOADING File..",
  UPLOADED = "File Uploaded Successfully",
  SAVING = "Saving File TO Database...",
  GENERATING = "Generating AI Embeddings. This nay take a while",
  ERROR = "ERROR",
}

export type Status = StatusText[keyof StatusText];

export function useUpload() {
  const [progress, setProgress] = useState<number | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const { user } = useUser();
  const router = useRouter();
  const fileIdUploadTo = uuidv4();

  const storageRef = ref(storage, `users/${user?.id}/files/${fileIdUploadTo}`);

  const handleFileUpload = async (file: File) => {
    if (!file || !user) return;

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        switch (snapshot.state) {
          case "paused":
            setStatus(StatusText.ERROR);
            setProgress(null);
            break;
          case "running":
            setProgress(progress);
            setStatus(StatusText.UPLOADING);

            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        setStatus(StatusText.ERROR);
        setProgress(null);
      },
      async () => {
        try{
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setStatus(StatusText.UPLOADED);
      
            await setDoc(doc(db, "users", user.id, "files", fileIdUploadTo), {
              downloadURL,
              name: file.name,
              size:file.size,
              type:file.type,
              ref:uploadTask.snapshot.ref.fullPath,
              createdAt: new Date(),
            });

            setStatus(StatusText.GENERATING)
            // AI Embeddings Generation

            setFileId(fileIdUploadTo);
      
        }
        catch(e){
            setStatus(StatusText.ERROR);
        }
      }
    );
  };

    return { progress, status, fileId, handleFileUpload };
}
