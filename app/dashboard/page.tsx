import Documents from "@/components/Documents";

function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto bg-gray-200 p-4">
      <p className="font-extralight text-indigo-400 text-sm md:text-xl lg:text-2xl">My Documents</p>
      {/* Will map through the documents here... */}
      <Documents/>
     
    </div>
  );
}
export default Dashboard;
