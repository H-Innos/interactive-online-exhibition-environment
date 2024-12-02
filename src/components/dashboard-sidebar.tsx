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
import { useTranslation } from "react-i18next";

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

export function ExhibitionManagerSidebar() {
  const { t } = useTranslation();

  const mainNavItems = [
    { name: t("allExhibitions"), icon: List, href: "/" },
    { name: t("dashboard2"), icon: LayoutDashboard, href: "/dashboard" },
    { name: t("trash2"), icon: Trash2, href: "/dashboard/trash" },
  ];

  const subNavItems = [
    {
      name: t("publishedExhibitions"),
      icon: Image,
      href: "/dashboard/published",
    },
    { name: t("drafts"), icon: FileText, href: "/dashboard/drafts" },
    { name: t("archive2"), icon: Archive, href: "/dashboard/archive" },
  ];

  const [open, setOpen] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    setOpen(true);
  }, []);

  if (open === null) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar
        collapsible="icon"
        className="sticky w-64 border-r bg-white shadow"
      >
        <SidebarHeader className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <h2 className="mr-2 text-lg font-semibold group-data-[collapsible=icon]:hidden">
              {t("exhibitionManager")}
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
                {item.name === t("dashboard2") && (
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
