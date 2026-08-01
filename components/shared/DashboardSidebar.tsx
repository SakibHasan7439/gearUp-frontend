"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

const navByRole: Record<Role, { href: string; label: string; icon: typeof LayoutDashboardIcon }[]> = {
  ADMIN: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboardIcon },
    { href: "/dashboard/admin/categories", label: "Categories", icon: TagsIcon },
    { href: "/dashboard/admin/gear", label: "Gear", icon: PackageIcon },
    { href: "/dashboard/admin/rentals", label: "Rentals", icon: ShoppingCartIcon },
  ],
  PROVIDER: [
    { href: "/dashboard/provider", label: "Overview", icon: LayoutDashboardIcon },
    { href: "/dashboard/provider/gear", label: "My gear", icon: PackageIcon },
    { href: "/dashboard/provider/gear/new", label: "Add gear", icon: PlusIcon },
    { href: "/dashboard/provider/orders", label: "Orders", icon: ShoppingCartIcon },
  ],
  CUSTOMER: [
    { href: "/dashboard/customer", label: "My rentals", icon: ShoppingCartIcon },
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
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href={home}>
                <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <PackageIcon className="size-4" />
                </span>
                <span className="font-semibold">GearUp</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {role.charAt(0) + role.slice(1).toLowerCase()}
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
                      isActive={active}
                      className={cn(active && "bg-sidebar-accent")}
                    >
                      <Link href={item.href}>
                        <Icon />
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

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/gear">Browse gear</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-red-500 hover:bg-red-50"
            >
              <LogOutIcon />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
