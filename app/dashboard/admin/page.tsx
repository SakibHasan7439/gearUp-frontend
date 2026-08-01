"use client";

import { useAdminCategories, useAdminGear, useAdminRentals } from "@/lib/queries/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminOverviewPage() {
  const { data: categories } = useAdminCategories();
  const { data: gear } = useAdminGear();
  const { data: rentals } = useAdminRentals();

  const pendingRevenue =
    rentals?.filter((r) => r.status !== "CANCELLED").reduce(
      (sum, r) => sum + r.totalAmount,
      0,
    ) ?? 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Admin overview</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{categories?.length ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gear items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{gear?.length ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rentals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{rentals?.length ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Open rentals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {rentals?.filter((r) =>
                ["PENDING", "CONFIRMED", "PICKED_UP"].includes(r.status),
              ).length ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gross volume</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${pendingRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
