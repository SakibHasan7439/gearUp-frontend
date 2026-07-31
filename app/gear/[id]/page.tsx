"use client";

import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGearItem } from "@/lib/queries/gear";
import { useGearReviews } from "@/lib/queries/reviews";
import { rentalSchema, RentalFormValues } from "@/lib/validators/rental";
import { Review } from "@/types";

function today() {
  return new Date().toISOString().split("T")[0];
}

export default function GearDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: gear, isLoading } = useGearItem(id);
  const { data: reviews } = useGearReviews(id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RentalFormValues>({
    resolver: zodResolver(rentalSchema),
    defaultValues: { quantity: 1 },
  });

  const inStock = gear ? gear.availableQuantity > 0 : false;
  const watchQuantity = watch("quantity");

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="mt-4 h-6 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-6 h-32 animate-pulse rounded bg-gray-200" />
      </div>
    );
  }

  if (!gear) {
    return (
      <div className="py-20 text-center text-gray-500">Gear not found.</div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <div className="mb-1 flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold">{gear.name}</h1>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${
              inStock
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {inStock ? `${gear.availableQuantity} available` : "Out of stock"}
          </span>
        </div>

        <p className="text-lg text-gray-500">{gear.brand}</p>
        <p className="text-xs text-gray-400">
          {gear.category?.name ?? "Uncategorized"}
        </p>

        <p className="mt-3 text-2xl font-bold">
          ${gear.price.toFixed(2)}
          <span className="text-base font-normal text-gray-500"> / day</span>
        </p>

        <p className="mt-4 text-gray-700">{gear.description}</p>

        <p className="mt-2 text-sm text-gray-400">Provider ID: {gear.userId}</p>
      </div>

      {inStock && (
        <section className="mb-10 rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Rent now</h2>
          <form
            onSubmit={handleSubmit(() => {
              // rental submit handled by parent
            })}
            className="flex flex-col gap-4 sm:flex-row sm:items-end"
          >
            <div>
              <label className="mb-1 block text-sm font-medium">
                Start date
              </label>
              <input
                type="date"
                min={today()}
                {...register("startDate")}
                className="w-full rounded border px-3 py-2 sm:w-auto"
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">End date</label>
              <input
                type="date"
                min={today()}
                {...register("endDate")}
                className="w-full rounded border px-3 py-2 sm:w-auto"
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.endDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Quantity</label>
              <input
                type="number"
                min={1}
                max={gear.availableQuantity}
                {...register("quantity", { valueAsNumber: true })}
                className="w-full rounded border px-3 py-2 sm:w-20"
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.quantity.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="rounded bg-black px-6 py-2 text-white transition-opacity hover:opacity-80"
            >
              Rent
            </button>
          </form>

          {watchQuantity > 0 && (
            <p className="mt-3 text-sm text-gray-500">
              Estimated total: $
              {(gear.price * watchQuantity).toFixed(2)}/day
            </p>
          )}
        </section>
      )}

      <section>
        <h2 className="mb-4 text-xl font-semibold">
          Reviews ({reviews?.length ?? 0})
        </h2>
        {reviews && reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review: Review) => (
              <div key={review.id} className="rounded-lg border p-4">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-yellow-500">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                  <span className="text-sm text-gray-400">
                    {review.customerId}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </section>
    </div>
  );
}
