import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import {FileUp} from "lucide-react"
import UpgradeButton from "./UpgradeButton";

function Header() {
  return (
    <nav className="flex justify-between items-center shadow-sm border-b sticky top-0 p-2">
      <Link href="/dashboard">
        Chat With <span className="text-indigo-600 font-semibold">PDF</span>
      </Link>
      <div className="flex gap-3">
      <SignedIn>
        <div className="flex gap-2">
        <Button asChild variant="outline">
        <Link href="/dashboard/" className="border-indigo-500 text-indigo-600">My Documents</Link>
         </Button>
       <UpgradeButton/>
         <Button asChild variant="outline">
        <Link href="/dashboard/upgrade">Pricing</Link>
         </Button>
         <Button asChild variant="outline" className="border-indigo-600">
        <Link href="/dashboard/upload">
         <FileUp size={24}className="text-indigo-600" />
        </Link>
          </Button>
        </div>
        <UserButton />
      </SignedIn>

      </div>
    </nav>
  );
}
export default Header;
