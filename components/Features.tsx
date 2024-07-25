import { features } from "../lib/constants";

function Features() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-10">
    {features.map((feature)=>(
        <div className="flex gap-3 items-start">
            <feature.icon  className="text-indigo-500 text-lg"/>
             <p className="font-semibold">{feature.name}</p>
        </div>
    ))}
    </div>
  )
}
export default Features