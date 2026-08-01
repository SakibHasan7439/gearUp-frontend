"use client";

import { useMyGear, useProviderOrders } from "@/lib/queries/provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";

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
    <div className="w-full">
      <PageHeader
        title="Provider Dashboard"
        description="Manage your equipment inventory and order operations"
        action={
          <>
            <Link href="/dashboard/provider/gear/new">
              <Button size="sm">Add Gear</Button>
            </Link>
            <Link href="/dashboard/provider/orders">
              <Button size="sm" variant="outline">
                View Orders
              </Button>
            </Link>
          </>
        }
      />

      {isLoading ? (
        <div className="grid gap-6 border-y border-[#4E5D5A]/20 py-8 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse bg-[#4E5D5A]/10" />
          ))}
        </div>
      ) : (
        <div className="grid gap-8 border-y border-[#4E5D5A]/20 py-8 sm:grid-cols-3">
          <div>
            <span className="block font-mono text-xs font-semibold uppercase tracking-wider text-[#4E5D5A]">
              Total Gear Listed
            </span>
            <p className="mt-1 font-display text-4xl font-bold font-mono text-[#20291F]">
              {totalGear}
            </p>
          </div>

          <div>
            <span className="block font-mono text-xs font-semibold uppercase tracking-wider text-[#4E5D5A]">
              Pending Orders
            </span>
            <p className="mt-1 font-display text-4xl font-bold font-mono text-[#B8823A]">
              {pendingOrders}
            </p>
          </div>

          <div>
            <span className="block font-mono text-xs font-semibold uppercase tracking-wider text-[#4E5D5A]">
              Active Rentals
            </span>
            <p className="mt-1 font-display text-4xl font-bold font-mono text-[#2F4A34]">
              {activeRentals}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
