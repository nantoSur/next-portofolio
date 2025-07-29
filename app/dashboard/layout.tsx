// app/dashboard/layout.tsx

import { ReactNode } from "react";
import Sidebar from "./components/sidebar"; // sesuaikan dengan path Sidebar kamu
import DashboardTopbar from "@/components/ui/dashboard/dashboard-topbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardTopbar />
        <main className="flex-1 p-6 overflow-y-auto bg-gray-100 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}
