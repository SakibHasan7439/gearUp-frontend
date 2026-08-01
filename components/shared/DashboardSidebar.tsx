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
  CompassIcon,
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

const roleLabels: Record<Role, string> = {
  ADMIN: "Admin",
  PROVIDER: "Provider",
  CUSTOMER: "Customer",
};

const navButtonClass =
  "flex h-10 w-full items-center gap-3 rounded-none px-3 text-sm text-[#EDEAE0] transition-colors hover:bg-[#EDEAE0]/10 hover:text-[#EDEAE0]";

const navButtonActiveClass =
  "border-l-4 border-[#B8823A] bg-[#EDEAE0]/10 font-semibold text-[#EDEAE0] pl-2";

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

  const isActive = (href: string) =>
    pathname === href ||
    (href !== "/dashboard/customer" && pathname.startsWith(href));

  return (
    <Sidebar className="border-r border-[#4E5D5A]/20 bg-[#2F4A34] text-[#EDEAE0]">
      <SidebarHeader className="border-b border-[#4E5D5A]/20 bg-[#2F4A34] p-4">
        <SidebarMenu className="gap-0">
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="h-auto rounded-none p-0 hover:bg-transparent">
              <Link href={home} className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-none bg-[#B8823A] text-[#20291F]">
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

      <SidebarContent className="bg-[#2F4A34] px-3 py-5">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="mb-3 px-3 font-mono text-xs font-semibold uppercase tracking-wider text-[#EDEAE0]/60">
            {roleLabels[role]} Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {nav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={cn(
                        navButtonClass,
                        active && navButtonActiveClass,
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <Icon className="size-4 shrink-0 text-[#B8823A]" />
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

      <SidebarFooter className="border-t border-[#4E5D5A]/20 bg-[#2F4A34] p-4">
        <SidebarMenu className="gap-1.5">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(navButtonClass, "h-10")}
            >
              <Link href="/gear" className="flex items-center gap-3">
                <CompassIcon className="size-4 shrink-0 text-[#B8823A]" />
                <span>Browse Gear</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="flex h-10 w-full items-center gap-3 rounded-none px-3 text-sm text-[#8C3B2E] transition-colors hover:bg-[#8C3B2E]/15 hover:text-[#8C3B2E]"
            >
              <LogOutIcon className="size-4 shrink-0" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
