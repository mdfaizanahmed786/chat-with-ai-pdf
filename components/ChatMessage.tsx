"use client";
import { useUser } from "@clerk/nextjs";
import { Message } from "./Chat";
import Image from "next/image";
import Markdown from "react-markdown";  

function ChatMessage({ message }: { message: Message }) {
  const isHuman = message.role === "human";
  const { user } = useUser();
  return (
    <div className={`flex ${isHuman ? "justify-end" : "justify-start"} mb-2 p-5`}>
      {isHuman ? (
        <div className="flex items-center space-x-3 bg-indigo-500 text-white p-4 rounded-lg max-w-sm">
          {user?.imageUrl && (
            <Image
              src={user?.imageUrl}
              alt="profile"
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <div>
            <p className="font-semibold">{user?.fullName}</p>
            <Markdown className="mt-1">{message.message}</Markdown>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-3 bg-gray-300 text-black p-4 rounded-lg max-w-sm">
          <div className="bg-gray-400 p-2 rounded-full">
            <span>AI</span>
          </div>
          <Markdown>{message.message}</Markdown>
        </div>
      )}
    </div>
  );
}
export default ChatMessage;
