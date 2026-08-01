import Link from "next/link";
import { GearItem } from "@/types";

export default function GearCard({ gear }: { gear: GearItem }) {
  const inStock = gear.availableQuantity > 0;

  return (
    <Link
      href={`/gear/${gear.id}`}
      className="group flex flex-col border border-[#4E5D5A]/20 p-5 transition-colors hover:border-[#B8823A] bg-transparent"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-display text-lg font-bold text-[#20291F] group-hover:text-[#B8823A] transition-colors">
          {gear.name}
        </h3>
        <span
          className={`shrink-0 font-mono text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 ${
            inStock
              ? "bg-[#2F4A34]/15 text-[#2F4A34]"
              : "bg-[#8C3B2E]/15 text-[#8C3B2E]"
          }`}
        >
          {inStock ? `${gear.availableQuantity} available` : "Out of stock"}
        </span>
      </div>

      <p className="text-xs text-[#4E5D5A] font-medium">{gear.brand}</p>

      <p className="mt-1 font-mono text-[11px] text-[#4E5D5A]/80 uppercase">
        {gear.category?.name ?? "Uncategorized"}
      </p>

      <p className="mt-4 font-mono text-xl font-bold text-[#20291F]">
        ${gear.price.toFixed(2)}
        <span className="font-sans text-xs font-normal text-[#4E5D5A]"> / day</span>
      </p>
    </Link>
  );
}
