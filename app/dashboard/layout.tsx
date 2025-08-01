// app/dashboard/layout.tsx

import { ReactNode } from "react";
import Sidebar from "../../components/ui/dashboard/sidebar";
import DashboardTopbar from "@/components/ui/dashboard/dashboard-topbar";
import { Toaster } from "sonner";

export default function DashboardLayout({ children }: { children: ReactNode }) {
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
