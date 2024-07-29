"use client";
import { useUser } from "@clerk/nextjs";
import { Message } from "./Chat";
import Image from "next/image";
import Markdown from "react-markdown";  

function ChatMessage({ message }: { message: Message }) {
  const isHuman = message.role === "human";
  const { user } = useUser();
  return (
    <div className={`flex ${isHuman ? "justify-end" : "justify-start"}`}>
      {isHuman ? (
        <div className="bg-blue-500 text-white p-2 m-2 rounded-lg">
          {user?.imageUrl && (
            <Image
              src={user?.imageUrl}
              alt="profile"
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <p>{user?.fullName}</p>
        </div>
      ) : (
        <div className="bg-gray-300 text-black p-2 m-2 rounded-lg">AI</div>
      )}

      <Markdown>{message.message}</Markdown>
    </div>
  );
}
export default ChatMessage;
