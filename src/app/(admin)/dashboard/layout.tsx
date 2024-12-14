"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ExhibitionManagerSidebar } from "~/components/dashboard-sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDetailPage = /^\/dashboard(\/\d+|\/archive\/\d+)$/.test(pathname);
  return (
    <div className="flex min-h-screen">
      {!isDetailPage && (
        <div className="hidden md:block">
          <ExhibitionManagerSidebar />
        </div>
      )}
      <main className="m-0 flex-grow p-4">{children}</main>
    </div>
  );
}
