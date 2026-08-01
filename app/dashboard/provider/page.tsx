"use client";

import { useMyGear, useProviderOrders } from "@/lib/queries/provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Provider Overview</h1>
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
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Gear Listed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalGear}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">
                {pendingOrders}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Rentals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{activeRentals}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
