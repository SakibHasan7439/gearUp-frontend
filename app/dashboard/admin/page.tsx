"use client";

import { useAdminCategories, useAdminGear, useAdminRentals } from "@/lib/queries/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminOverviewPage() {
  const { data: categories, isLoading: loadingCategories } = useAdminCategories();
  const { data: gear, isLoading: loadingGear } = useAdminGear();
  const { data: rentals, isLoading: loadingRentals } = useAdminRentals();

  const totalCategories = categories?.length ?? 0;
  const totalGear = gear?.length ?? 0;
  const totalRentals = rentals?.length ?? 0;

  const isLoading = loadingCategories || loadingGear || loadingRentals;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Overview</h1>
          <p className="text-sm text-gray-500">Platform-wide statistics and management</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/admin/categories">
            <Button size="sm" variant="outline">Manage Categories</Button>
          </Link>
          <Link href="/dashboard/admin/gear">
            <Button size="sm" variant="outline">View All Gear</Button>
          </Link>
          <Link href="/dashboard/admin/rentals">
            <Button size="sm" variant="outline">View All Rentals</Button>
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
              <CardTitle className="text-sm font-medium text-gray-500">Total Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalCategories}</p>
            </CardContent>
          </Card>

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
              <CardTitle className="text-sm font-medium text-gray-500">Total Rentals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalRentals}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
