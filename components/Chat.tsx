"use client";
import { useUser } from "@clerk/nextjs";
import { useCollection } from "react-firebase-hooks/firestore";
import { useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import { askQuestion } from "@/actions/askQuestion";

export interface Message {
  id?: string;
  message: string;
  role: "human" | "ai" | "placeholder";
  createdAt: Date;
}
// id refers to the file id
function Chat({ id }: { id: string }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const { user } = useUser();
  const [snapshot, loading, error] = useCollection(
    user &&
      query(
        collection(db, "users", user.id, "files", id, "chat"),
        orderBy("createdAt", "asc")
      )
  );

  useEffect(() => {
    if (!snapshot) return;

    console.log(snapshot, "This is snapshot...");

    const lastMessage=messages.pop();
    

  }, [snapshot]);

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
const q=input;


// Optimistic Updates
setMessages((prev)=>[...prev,
 {message:q, role:"human", createdAt:new Date()},
 {message:"Thinking...", role:"ai", createdAt:new Date()}
])


startTransition(async()=>{
    const {success, message}=await askQuestion(id, q)

    if(!success){
        setMessages((prev)=>prev.slice(0,prev.length-1).concat([{message:`Whoops! ${message}`, role:"ai", createdAt:new Date()}]))
    }
})

setInput("")

};

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="w-full flex-1 h-full">{/* Chat messages */}</div>

      <form
        className="flex sticky bottom-0 p-5 bg-indigo-500/60 space-x-2"
        onSubmit={handleSubmit}
      >
        <Input
          placeholder="Ask a question"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="submit" disabled={isPending || !input}>
          {isPending ? "Asking..." : "Ask"}
        </Button>
      </form>
    </div>
  );
}
export default Chat;
