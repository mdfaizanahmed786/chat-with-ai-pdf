"use client";

import { useRouter } from "next/navigation";
import byteSize from "byte-size";
import { Button } from "./ui/button";
import {  Trash2Icon } from "lucide-react";
import { useTransition } from "react";
import { deleteDocument } from "@/actions/deleteDocument";
import useSubscription from "@/hooks/useSubscription";

function Document({
  name,
  id,
  size,
  downloadUrl,
}: {
  name: string;
  size: number;
  id: string;
  downloadUrl: string;
}) {
  const router = useRouter();
  const [isDeleting, startTransition] = useTransition();
  const { hasActiveMembership } = useSubscription();

  return (
    <div className="flex flex-col w-64 h-80 rounded-xl bg-white drop-shadow-md justify-between p-4 transition-all transform hover:scale-105 hover:bg-indigo-600 hover:text-white cursor-pointer group">
      <div onClick={() => router.push(`/dashboard/files/${id}`)}>
        <p className="font-semibold line-clamp-2">{name}</p>
        <p className="text-sm text-gray-400">{byteSize(size).value} KB</p>
      </div>
      <div className="flex items-center gap-2">
        <a
          href={downloadUrl}
          download={name}
          className="text-indigo-600 group-hover:text-white"
        >
          Download
        </a>

        <Button
          variant="outline"
          disabled={isDeleting || !hasActiveMembership}
          onClick={() => {
            const prompt = window.confirm(
              "Are you sure you want to delete this document?"
            );

            if (prompt) {
              // delete document
              startTransition(async () => {
                await deleteDocument(id);
              });
            }
          }}
        >
          <Trash2Icon className="h-6 w-6 text-red-500" />
          {!hasActiveMembership && (
            <span className="text-red-500 ml-2">PRO Feature</span>
          )}
        </Button>
      </div>
    </div>
  );
}
export default Document;
