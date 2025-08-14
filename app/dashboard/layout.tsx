import { ReactNode } from "react";
import Sidebar from "@/components/ui/dashboard/primitives/sidebar";
import DashboardTopbar from "@/components/ui/dashboard/primitives/dashboard-topbar";
import { Toaster } from "sonner";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/server/get-current-user";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser(); // ✅ await karena async
  if (!user) redirect("/login");

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardTopbar />
        <main className="flex-1 p-6 overflow-y-auto bg-gray-100 dark:bg-gray-900">
          {children}
          <Toaster richColors position="top-right" />
        </main>
      </div>
    </div>
  );
}
