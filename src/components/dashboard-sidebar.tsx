"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Image,
  FileText,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Archive,
  List,
} from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";

const mainNavItems = [
  { name: "All Exhibitions", icon: List, href: "/" },
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Archive", icon: Archive, href: "/archive" },
  { name: "Trash", icon: Trash2, href: "/dashboard/trash" },
];

const subNavItems = [
  { name: "Published Exhibitions", icon: Image, href: "/dashboard/published" },
  { name: "Drafts", icon: FileText, href: "/dashboard/drafts" },
];

export function ExhibitionManagerSidebar() {
  const [open, setOpen] = React.useState(true);

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar
        collapsible="icon"
        className="sticky w-64 border-r bg-white shadow"
      >
        <SidebarHeader className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <h2 className="mr-2 text-lg font-semibold group-data-[collapsible=icon]:hidden">
              Exhibition Manager
            </h2>
            <SidebarTrigger onClick={() => setOpen(!open)} className="p-2">
              {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </SidebarTrigger>
          </div>
        </SidebarHeader>
        <SidebarContent className="ml-6 group-data-[collapsible=icon]:hidden">
          <SidebarMenu>
            {mainNavItems.map((item) => (
              <SidebarMenuItem key={item.name} className="mb-2">
                <SidebarMenuButton asChild className="flex items-center gap-2">
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
                {item.name === "Dashboard" && (
                  <div className="ml-6">
                    {subNavItems.map((subItem) => (
                      <SidebarMenuItem key={subItem.name} className="mb-2">
                        <SidebarMenuButton
                          asChild
                          className="flex items-center gap-2"
                        >
                          <Link href={subItem.href}>
                            <subItem.icon className="h-5 w-5" />
                            <span>{subItem.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </div>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
