import { Plus, PlusCircle } from "lucide-react";
import { Button } from "./ui/button";

function PlaceHolderDocument() {
  return (
    <Button asChild className="border-indigo-600 ">
        <p className="space-x-2">
      <PlusCircle size={24} className="text-white" />
      <p>Add a document</p>

        </p>
    </Button>
  );
}
export default PlaceHolderDocument;
