import PDFView from "@/components/PDFView";
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
async function ChatToFilePage({
  params: { fileId },
}: {
  params: {
    fileId: string;
  };
}) {
  auth().protect();
  const {userId}=await auth();
  const pdfDoc=await adminDb.collection("users").doc(userId!).collection("files").doc(fileId).get()
  const downLoadURL=pdfDoc.data()?.downloadURL  
  return <div className="grid lg:grid-cols-5 overflow-hidden h-full">

<div className="col-span-5 lg:col-span-2 overflow-y-auto">
    {/* Chat */}
</div>

<div className="col-span-5 lg:col-span-3 bg-gray-100 border-r-2 lg:-order-1 lg:border-indigo-600 overflow-auto">
{/* PDFViewer */}
<PDFView url={downLoadURL} />
</div>

  </div>;
}
export default ChatToFilePage;
