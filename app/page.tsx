import Features from "@/components/Features";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex-1 bg-gradient-to-l p-4 from-white/85 to-indigo-500">
      <div className="bg-white py-24 sm:py-36 lg:py-24 p-44 rounded-md flex flex-col gap-7">
        <div className="flex flex-col items-center justify-center text-center gap-4 mx-auto max-w-4xl">
          <div className="text-sm text-indigo-500 font-bold">
            Your Interactive Document Companion
          </div>
          <div className="tracking-tight font-bold text-lg text-center md:text-4xl lg:text-5xl">
            Transform Your PDFs into Interactive Conversations
          </div>

          <div>
            Introducing{" "}
            <span className="text-indigo-500 font-semibold">Chat With PDF</span>
          </div>
          <div>
            Upload your document and start a conversation with it. You can use
            <br />
            Chat with PDF to get started in just few clicks. Turn your boring
            PDFs into interactive conversations.
          </div>

          <Button asChild className="mt-5">
            <Link href={"/dashboard"}>Dashboard</Link>
          </Button>
        </div>
        <div className="mx-auto max-w-7xl">
          <div className=" mt-3 relative">
            <Image
              height={1442}
              width={2432}
              src={"https://i.imgur.com/VciRSTI.jpeg"}
              alt="chat-image"
              className="rounded-xl shadow-2xl"
            />
            <div className="relative bottom-0">
              <div className="absolute bg-gradient-to-t from-white/80  bottom-0 -inset-14"></div>
            </div>
          </div>
        </div>

        <Features/>
      </div>
    </main>
  );
}
