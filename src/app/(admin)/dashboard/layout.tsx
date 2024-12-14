"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ExhibitionManagerSidebar } from "~/components/dashboard-sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDetailPage = /^\/dashboard(\/\d+|\/archive\/\d+)$/.test(pathname);
  return (
    <div className="flex">
      {!isDetailPage && (
        <div className="hidden md:block">
          <ExhibitionManagerSidebar />
        </div>
      )}
      <main className="flex-grow">{children}</main>
    </div>
  );
}
