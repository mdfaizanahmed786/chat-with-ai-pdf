"use client";
import { CircleArrowDown, RocketIcon } from "lucide-react";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

function FileUploader() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles,"This is the accepted files....")
  }, []);
  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } = useDropzone({ onDrop });
  return (
    <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">
    <div {...getRootProps()} className={`p-10 border-2 w-[90%] text-indigo-500 border-dashed border-indigo-600 mt-10 rounded-lg h-96 flex items-center ${isFocused || isDragAccept ? "bg-indigo-300" : "bg-indigo-50"}`}>
        <div className="flex justify-center items-center gap-4 flex-col w-full">
      <input {...getInputProps()} />
      {isDragActive ? (
        <>
        <RocketIcon className="h-20 w-20 animate-ping"/>
        <p className="text-center">Drop the files here ...</p>
        </>
      ) : (
        <>
        <CircleArrowDown className="h-20 w-20 animate-bounce"/>
        <p className="text-center">Drag 'n' drop some files here, or click to select files</p>
        </>
      )}

        </div>
    </div>

    </div>
  );
}
export default FileUploader;
