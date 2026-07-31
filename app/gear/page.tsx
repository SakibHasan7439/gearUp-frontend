"use client";

import { useState, useMemo } from "react";
import { useGearList, useCategories } from "@/lib/queries/gear";
import GearCard from "@/components/shared/GearCard";

export default function GearBrowsePage() {
  const { data: gear, isLoading } = useGearList();
  const { data: categories } = useCategories();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filtered = useMemo(() => {
    if (!gear) return [];
    return gear.filter((item) => {
      if (
        search &&
        !item.name.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (selectedCategory && item.categoryId !== selectedCategory)
        return false;
      if (minPrice && item.price < Number(minPrice)) return false;
      if (maxPrice && item.price > Number(maxPrice)) return false;
      return true;
    });
  }, [gear, search, selectedCategory, minPrice, maxPrice]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Browse gear</h1>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="shrink-0 space-y-4 lg:w-60">
          <div>
            <label className="mb-1 block text-sm font-medium">Search</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name…"
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded border px-3 py-2"
            >
              <option value="">All categories</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Price range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                className="w-full rounded border px-3 py-2"
              />
              <input
                type="number"
                min={0}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
                className="w-full rounded border px-3 py-2"
              />
            </div>
          </div>
        </aside>

        <main className="flex-1">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-lg bg-gray-200"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-gray-500">No gear matches your filters.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <GearCard key={item.id} gear={item} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
