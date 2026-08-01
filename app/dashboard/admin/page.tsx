"use client";

import { useAdminCategories, useAdminGear, useAdminRentals } from "@/lib/queries/admin";
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
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#20291F]">
            ADMIN OVERVIEW
          </h1>
          <p className="text-sm text-[#4E5D5A]">
            Platform metrics and system administration
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/admin/categories">
            <Button size="sm" variant="outline">Categories</Button>
          </Link>
          <Link href="/dashboard/admin/gear">
            <Button size="sm" variant="outline">All Gear</Button>
          </Link>
          <Link href="/dashboard/admin/rentals">
            <Button size="sm" variant="outline">All Rentals</Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-3 py-6 border-y border-[#4E5D5A]/20">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse bg-[#4E5D5A]/10" />
          ))}
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-3 py-8 border-y border-[#4E5D5A]/20">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#4E5D5A] block">
              Total Categories
            </span>
            <p className="font-display text-4xl font-bold text-[#20291F] mt-1 font-mono">
              {totalCategories}
            </p>
          </div>

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
              Total Rentals
            </span>
            <p className="font-display text-4xl font-bold text-[#20291F] mt-1 font-mono">
              {totalRentals}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
