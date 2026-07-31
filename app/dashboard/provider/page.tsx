"use client";

import { useMyGear, useProviderOrders } from "@/lib/queries/provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProviderDashboardPage() {
  const { data: gear } = useMyGear();
  const { data: orders } = useProviderOrders();

  const totalGear = gear?.length ?? 0;
  const pendingOrders =
    orders?.filter((o) => o.status === "PENDING").length ?? 0;
  const activeOrders =
    orders?.filter((o) =>
      ["CONFIRMED", "PICKED_UP"].includes(o.status),
    ).length ?? 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Provider dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total gear</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalGear}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">
              {pendingOrders}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active rentals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{activeOrders}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
