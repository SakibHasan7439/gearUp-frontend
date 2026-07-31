"use client";

import { useGearList } from "@/lib/queries/gear";
import GearCard from "@/components/shared/GearCard";
import Link from "next/link";

export default function HomePage() {
  const { data: gear, isLoading } = useGearList();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="mb-10 text-center">
        <h1 className="mb-2 text-4xl font-bold">Rent the gear you need</h1>
        <p className="mb-6 text-gray-500">
          From cameras to camping — find equipment from local providers.
        </p>
        <Link
          href="/gear"
          className="inline-block rounded bg-black px-6 py-2 text-white transition-opacity hover:opacity-80"
        >
          Browse all gear
        </Link>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Latest gear</h2>
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-lg bg-gray-200" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gear?.map((item) => <GearCard key={item.id} gear={item} />)}
          </div>
        )}
      </section>
    </div>
  );
}
