"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Image,
  FileText,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Published exhibitions", icon: Image, href: "/dashboard/published" },
  { name: "Drafts", icon: FileText, href: "/dashboard/drafts" },
  { name: "Trash", icon: Trash2, href: "/dashboard/trash" },
];

export function ExhibitionManagerSidebar() {
  const [open, setOpen] = React.useState(true);
  console.log("Rendering Sidebar");

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar
        collapsible="icon"
        className="mt-28 h-screen w-64 border-r bg-white shadow"
      >
        <SidebarHeader className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
              Exhibition Manager
            </h2>
            <SidebarTrigger onClick={() => setOpen(!open)} className="p-2">
              {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </SidebarTrigger>
          </div>
        </SidebarHeader>
        <SidebarContent className="group-data-[collapsible=icon]:hidden">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild className="flex items-center gap-2">
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
