export const dynamic="force-dynamic"
import { auth } from "@clerk/nextjs/server";
import PlaceHolderDocument from "./PlaceHolderDocument";
import { adminDb } from "@/firebaseAdmin";
import Document from "./Document";
async function Documents() {
  auth().protect();
  const {userId}=await auth();
  if(!userId) throw new Error("User not authenticated")
  const documents=await adminDb.collection("users").doc(userId!).collection("files").get()
  return (
    <div className="flex gap-4 mt-3 w-full flex-wrap">
      {/* Will map through the documents here  */}
 
 {
    documents.docs.map((doc)=>{
      const {name, size, downloadURL}=doc.data();
    
      return (
        <div key={doc.id} className="flex justify-center">
          <Document key={doc.id} id={doc.id} name={name} size={size} downloadUrl={downloadURL}/>
        </div>
      )

 }
  )
}
      <div className="flex justify-center">

      <PlaceHolderDocument />
      </div>
    </div>
  );
}
export default Documents;
