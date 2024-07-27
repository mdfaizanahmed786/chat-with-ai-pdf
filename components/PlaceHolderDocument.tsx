"use client";
import { PlusCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

function PlaceHolderDocument() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/dashboard/upload");
  };
  return (
    <Button onClick={handleClick} asChild className="border-indigo-600 ">
      <p className="space-x-2">
        <PlusCircle size={24} className="text-white" />
        <p>Add a document</p>
      </p>
    </Button>
  );
}
export default PlaceHolderDocument;
