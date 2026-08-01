"use client";

import { useMyGear, useProviderOrders } from "@/lib/queries/provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProviderDashboardPage() {
  const { data: gear, isLoading: isLoadingGear } = useMyGear();
  const { data: orders, isLoading: isLoadingOrders } = useProviderOrders();

  const totalGear = gear?.length ?? 0;
  const pendingOrders =
    orders?.filter((o) => o.status === "PENDING").length ?? 0;
  const activeRentals =
    orders?.filter((o) =>
      ["CONFIRMED", "PICKED_UP"].includes(o.status),
    ).length ?? 0;

  const isLoading = isLoadingGear || isLoadingOrders;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#20291F]">
            PROVIDER DASHBOARD
          </h1>
          <p className="text-sm text-[#4E5D5A]">
            Manage your equipment inventory and order operations
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/provider/gear/new">
            <Button size="sm">Add Gear</Button>
          </Link>
          <Link href="/dashboard/provider/orders">
            <Button size="sm" variant="outline">View Orders</Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-3 py-8 border-y border-[#4E5D5A]/20">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse bg-[#4E5D5A]/10" />
          ))}
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-3 py-8 border-y border-[#4E5D5A]/20">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#4E5D5A] block">
              Total Gear Listed
            </span>
            <p className="font-display text-4xl font-bold text-[#20291F] mt-1 font-mono">
              {totalGear}
            </p>
          </div>

          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#4E5D5A] block">
              Pending Orders
            </span>
            <p className="font-display text-4xl font-bold text-[#B8823A] mt-1 font-mono">
              {pendingOrders}
            </p>
          </div>

          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#4E5D5A] block">
              Active Rentals
            </span>
            <p className="font-display text-4xl font-bold text-[#2F4A34] mt-1 font-mono">
              {activeRentals}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
