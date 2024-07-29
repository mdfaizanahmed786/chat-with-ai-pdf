"use client";
import { useUpload } from "@/hooks/useUpload";
import { CircleArrowDown, RocketIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

function FileUploader() {
  const { progress, handleFileUpload, status, fileId } = useUpload();
  const router = useRouter();

  useEffect(() => {
    if (fileId) {
      router.push(`/dashboard/files/${fileId}`);
    }
  }, [fileId]);
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      await handleFileUpload(file);
    } else {
      console.log("No file");
    }
  }, [handleFileUpload]);
  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
      },
    });

  const uploadInProgress =
    progress !== null && progress >= 0 && progress <= 100;
  return (
    <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">
      {uploadInProgress && (
        <div
          className={`w-full bg-indigo-100 p-4 rounded-lg ${
            progress == 100 && "hidden"
          }`}
        >
          <div className="w-full h-2 bg-indigo-500 rounded-lg">
            <div
              className="h-2 bg-indigo-700 rounded-lg"
              style={{ width: `${progress}%` }}
            ></div>
            {/* @ts-ignore */}
            <p>{status}</p>
          </div>
        </div>
      )}



      <div
        {...getRootProps()}
        className={`p-10 border-2 w-[90%] text-indigo-500 border-dashed border-indigo-600 mt-10 rounded-lg h-96 flex items-center ${
          isFocused || isDragAccept ? "bg-indigo-300" : "bg-indigo-50"
        }  ${uploadInProgress && progress < 100 && "hidden"}`}
      >
        <div className="flex justify-center items-center gap-4 flex-col w-full">
          <input {...getInputProps()} />
          {isDragActive ? (
            <>
              <RocketIcon className="h-20 w-20 animate-ping" />
              <p className="text-center">Drop the files here ...</p>
            </>
          ) : (
            <>
              <CircleArrowDown className="h-20 w-20 animate-bounce" />
              <p className="text-center">
                Drag 'n' drop some files here, or click to select files
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default FileUploader;
