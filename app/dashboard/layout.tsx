import Header from "@/components/Header";
import { ClerkLoaded } from "@clerk/nextjs";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header />
      <ClerkLoaded>{children}</ClerkLoaded>
    </div>
  );
}
export default DashboardLayout;
