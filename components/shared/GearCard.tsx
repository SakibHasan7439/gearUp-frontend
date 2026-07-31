import Link from "next/link";
import { GearItem } from "@/types";

export default function GearCard({ gear }: { gear: GearItem }) {
  const inStock = gear.availableQuantity > 0;

  return (
    <Link
      href={`/gear/${gear.id}`}
      className="group flex flex-col rounded-lg border p-4 transition-shadow hover:shadow-lg"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-semibold group-hover:underline">{gear.name}</h3>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
            inStock
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {inStock ? `${gear.availableQuantity} available` : "Out of stock"}
        </span>
      </div>

      <p className="text-sm text-gray-500">{gear.brand}</p>

      <p className="mt-1 text-xs text-gray-400">
        {gear.category?.name ?? "Uncategorized"}
      </p>

      <p className="mt-2 text-lg font-bold">
        ${gear.price.toFixed(2)}
        <span className="text-sm font-normal text-gray-500"> / day</span>
      </p>
    </Link>
  );
}
