"use client";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="min-h-svh bg-[#EDEAE0]">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b border-[#4E5D5A]/20 bg-[#EDEAE0]/95 px-6 backdrop-blur-sm">
          <SidebarTrigger className="text-[#EDEAE0] bg-[#2F4A34] hover:bg-[#2F4A34]/90 hover:text-[#EDEAE0] rounded-none size-9" />
        </header>
        <div className="flex-1 w-full px-6 py-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
