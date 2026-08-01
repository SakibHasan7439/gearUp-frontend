"use client";

import { useAdminCategories, useAdminGear, useAdminRentals } from "@/lib/queries/admin";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";

export default function AdminOverviewPage() {
  const { data: categories, isLoading: loadingCategories } = useAdminCategories();
  const { data: gear, isLoading: loadingGear } = useAdminGear();
  const { data: rentals, isLoading: loadingRentals } = useAdminRentals();

  const totalCategories = categories?.length ?? 0;
  const totalGear = gear?.length ?? 0;
  const totalRentals = rentals?.length ?? 0;

  const isLoading = loadingCategories || loadingGear || loadingRentals;

  return (
    <div className="w-full">
      <PageHeader
        title="Admin Overview"
        description="Platform metrics and system administration"
        action={
          <>
            <Link href="/dashboard/admin/categories">
              <Button size="sm" variant="outline">
                Categories
              </Button>
            </Link>
            <Link href="/dashboard/admin/gear">
              <Button size="sm" variant="outline">
                All Gear
              </Button>
            </Link>
            <Link href="/dashboard/admin/rentals">
              <Button size="sm" variant="outline">
                All Rentals
              </Button>
            </Link>
          </>
        }
      />

      {isLoading ? (
        <div className="grid gap-6 border-y border-[#4E5D5A]/20 py-6 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse bg-[#4E5D5A]/10" />
          ))}
        </div>
      ) : (
        <div className="grid gap-8 border-y border-[#4E5D5A]/20 py-8 sm:grid-cols-3">
          <div>
            <span className="block font-mono text-xs font-semibold uppercase tracking-wider text-[#4E5D5A]">
              Total Categories
            </span>
            <p className="mt-1 font-display text-4xl font-bold font-mono text-[#20291F]">
              {totalCategories}
            </p>
          </div>

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
              Total Rentals
            </span>
            <p className="mt-1 font-display text-4xl font-bold font-mono text-[#20291F]">
              {totalRentals}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
