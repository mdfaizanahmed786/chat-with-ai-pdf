'use client'

import { useRouter } from "next/navigation";
import byteSize from "byte-size"

function Document({
    name,
    id,
    size,
    downloadUrl
}:{
    name:string,
    size:number,
    id:string,
    downloadUrl:string
}) {
    const router = useRouter();
  return (
    <div className="flex flex-col w-64 h-80 rounded-xl bg-white drop-shadow-md justify-between p-4 transition-all transform hover:scale-105 hover:bg-indigo-600 hover:text-white cursor-pointer group">
        <div onClick={()=>router.push(`/dashboard/files/${id}`)}>
            <p className="font-semibold line-clamp-2">{name}</p>
            <p className="text-sm text-gray-400">{byteSize(size).value} KB</p>  
        </div>
    </div>
  )
}
export default Document