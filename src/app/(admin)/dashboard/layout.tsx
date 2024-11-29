"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ExhibitionManagerSidebar } from "~/components/dashboard-sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDetailPage = /^\/dashboard\/\d+$/.test(pathname);
  return (
    <div className="flex min-h-screen">
      {!isDetailPage && <ExhibitionManagerSidebar />}
      <main className="m-0 flex p-4">{children}</main>
    </div>
  );
}
