"use client";

import { useState, useMemo } from "react";
import { useGearList } from "@/lib/queries/gear";
import GearCard from "@/components/shared/GearCard";
import { useCategories } from "@/lib/queries/categories";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function GearBrowsePage() {
  const { data: gear, isLoading } = useGearList();
  const { data: categories } = useCategories();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
  };

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
      <div className="mb-8 border-b border-[#4E5D5A]/20 pb-4">
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#20291F]">
          BROWSE EQUIPMENT
        </h1>
        <p className="text-sm text-[#4E5D5A]">Explore available outdoor gear for rent</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="shrink-0 space-y-5 lg:w-64">
          <div className="space-y-1.5">
            <Label className="font-sans text-xs uppercase tracking-wider text-[#4E5D5A]">
              Search Equipment
            </Label>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name…"
              className="rounded-none border-[#4E5D5A]/40 bg-transparent text-sm text-[#20291F] focus-visible:ring-0 focus-visible:border-[#B8823A]"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="font-sans text-xs uppercase tracking-wider text-[#4E5D5A]">
              Category
            </Label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-none border border-[#4E5D5A]/40 bg-transparent px-3 py-2 text-sm text-[#20291F] focus:outline-none focus:border-[#B8823A]"
            >
              <option value="" className="bg-[#EDEAE0]">All Categories</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#EDEAE0]">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="font-sans text-xs uppercase tracking-wider text-[#4E5D5A]">
              Daily Rate Range ($)
            </Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min={0}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                className="rounded-none border-[#4E5D5A]/40 bg-transparent font-mono text-sm text-[#20291F] focus-visible:ring-0 focus-visible:border-[#B8823A]"
              />
              <Input
                type="number"
                min={0}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
                className="rounded-none border-[#4E5D5A]/40 bg-transparent font-mono text-sm text-[#20291F] focus-visible:ring-0 focus-visible:border-[#B8823A]"
              />
            </div>
          </div>

          {(search || selectedCategory || minPrice || maxPrice) && (
            <Button variant="outline" size="sm" onClick={resetFilters} className="w-full">
              Reset Filters
            </Button>
          )}
        </aside>

        <main className="flex-1">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-44 animate-pulse bg-[#4E5D5A]/10"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 border-y border-[#4E5D5A]/20 text-center">
              <p className="text-[#4E5D5A] mb-4">No equipment matches your current filters — try clearing or adjusting your search.</p>
              <Button variant="outline" onClick={resetFilters}>Clear Filters</Button>
            </div>
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
