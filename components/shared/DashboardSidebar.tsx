"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  PackageIcon,
  ShoppingCartIcon,
  TagsIcon,
  PlusIcon,
  LogOutIcon,
} from "lucide-react";
import { Role } from "@/types";

const navByRole: Record<
  Role,
  { href: string; label: string; icon: typeof LayoutDashboardIcon }[]
> = {
  ADMIN: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboardIcon },
    { href: "/dashboard/admin/categories", label: "Categories", icon: TagsIcon },
    { href: "/dashboard/admin/gear", label: "Gear", icon: PackageIcon },
    { href: "/dashboard/admin/rentals", label: "Rentals", icon: ShoppingCartIcon },
  ],
  PROVIDER: [
    { href: "/dashboard/provider", label: "Overview", icon: LayoutDashboardIcon },
    { href: "/dashboard/provider/gear", label: "My Gear", icon: PackageIcon },
    { href: "/dashboard/provider/gear/new", label: "Add Gear", icon: PlusIcon },
    { href: "/dashboard/provider/orders", label: "Orders", icon: ShoppingCartIcon },
  ],
  CUSTOMER: [
    { href: "/dashboard/customer", label: "My Rentals", icon: ShoppingCartIcon },
  ],
};

const homeByRole: Record<Role, string> = {
  ADMIN: "/dashboard/admin",
  PROVIDER: "/dashboard/provider",
  CUSTOMER: "/dashboard/customer",
};

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const role = user?.role ?? "CUSTOMER";
  const nav = navByRole[role] ?? navByRole.CUSTOMER;
  const home = homeByRole[role] ?? homeByRole.CUSTOMER;

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <Sidebar className="bg-[#2F4A34] text-[#EDEAE0] border-r border-[#4E5D5A]/20">
      <SidebarHeader className="border-b border-[#4E5D5A]/20 p-4 bg-[#2F4A34]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="hover:bg-transparent">
              <Link href={home} className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-none bg-[#B8823A] text-[#20291F]">
                  <PackageIcon className="size-5" />
                </span>
                <span className="font-display text-xl tracking-tight text-[#EDEAE0]">
                  GEARUP
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-[#2F4A34] px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-xs font-semibold uppercase tracking-wider text-[#EDEAE0]/60 px-3 mb-2">
            {role} MENU
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard/customer" &&
                    pathname.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "flex items-center gap-3 rounded-none px-3 py-2 text-sm text-[#EDEAE0] transition-colors hover:bg-[#EDEAE0]/10 hover:text-[#EDEAE0]",
                        active &&
                          "border-l-4 border-[#B8823A] bg-[#EDEAE0]/10 font-semibold text-[#EDEAE0]"
                      )}
                    >
                      <Link href={item.href}>
                        <Icon className="size-4 text-[#B8823A]" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-[#4E5D5A]/20 p-4 bg-[#2F4A34]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="text-[#EDEAE0]/80 hover:bg-[#EDEAE0]/10 hover:text-[#EDEAE0]"
            >
              <Link href="/gear">Browse Gear</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-[#8C3B2E] hover:bg-[#8C3B2E]/15 hover:text-[#8C3B2E]"
            >
              <LogOutIcon className="size-4" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
