"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGearItem } from "@/lib/queries/gear";
import { useGearReviews } from "@/lib/queries/reviews";
import { useCreateRental } from "@/lib/queries/rentals";
import { rentGearSchema, RentGearFormValues } from "@/lib/validators/rental";
import { Review } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreatePayment } from "@/lib/queries/payment";

function today() {
  return new Date().toISOString().split("T")[0];
}

export default function GearDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: gear, isLoading } = useGearItem(id);
  const { data: reviews } = useGearReviews(id);
  console.log("reviews :>> ", reviews);
  const { mutate: createRental, isPending: isCreating } = useCreateRental();
  const { mutate: pay, isPending } = useCreatePayment();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<RentGearFormValues>({
    resolver: zodResolver(rentGearSchema),
    defaultValues: {
      gearItemId: id ?? "",
      quantity: 1,
    },
  });

  useEffect(() => {
    if (id) {
      setValue("gearItemId", id);
    }
  }, [id, setValue]);

  const inStock = gear ? gear.availableQuantity > 0 : false;
  const watchQuantity = watch("quantity");
  const isSubmitting = isCreating || isPending;

  const onSubmit = (values: RentGearFormValues) => {
    createRental(
      {
        items: [
          {
            gearItemId: values.gearItemId || id,
            quantity: values.quantity,
            startDate: values.startDate,
            endDate: values.endDate,
          },
        ],
      },
      {
        onSuccess: (order) => {
          router.push(`/rentals/${order.id}`);
        },
      },
    );
};

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="h-8 w-64 animate-pulse bg-[#4E5D5A]/10" />
        <div className="mt-4 h-6 w-48 animate-pulse bg-[#4E5D5A]/10" />
        <div className="mt-6 h-32 animate-pulse bg-[#4E5D5A]/10" />
      </div>
    );
  }

  if (!gear) {
    return (
      <div className="py-20 text-center text-[#4E5D5A]">Gear item not found.</div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 border-b border-[#4E5D5A]/20 pb-6">
        <div className="mb-2 flex items-start justify-between gap-4">
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#20291F]">
            {gear.name}
          </h1>
          <span
            className={`shrink-0 font-mono text-xs font-semibold uppercase px-2.5 py-1 ${
              inStock
                ? "bg-[#2F4A34]/15 text-[#2F4A34]"
                : "bg-[#8C3B2E]/15 text-[#8C3B2E]"
            }`}
          >
            {inStock ? `${gear.availableQuantity} available` : "Out of stock"}
          </span>
        </div>

        <p className="text-base text-[#4E5D5A] font-medium">{gear.brand}</p>
        <p className="font-mono text-xs text-[#4E5D5A]/80 uppercase mt-0.5">
          {gear.category?.name ?? "Uncategorized"}
        </p>

        <p className="mt-4 font-mono text-3xl font-bold text-[#20291F]">
          ${gear.price.toFixed(2)}
          <span className="font-sans text-sm font-normal text-[#4E5D5A]"> / day</span>
        </p>

        <p className="mt-4 text-[#20291F] leading-relaxed">{gear.description}</p>
      </div>

      {inStock && (
        <section className="mb-12 py-6 border-b border-[#4E5D5A]/20">
          <h2 className="font-display text-xl font-bold tracking-tight text-[#20291F] mb-4">
            Rent Now
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 sm:flex-row sm:items-end"
          >
            <input type="hidden" {...register("gearItemId")} />

            <div className="space-y-1">
              <Label className="font-sans text-xs uppercase tracking-wider text-[#4E5D5A]">Start date</Label>
              <Input
                type="date"
                min={today()}
                {...register("startDate")}
                className="w-full rounded-none border-[#4E5D5A]/40 bg-transparent font-mono text-sm text-[#20291F] focus-visible:ring-0 focus-visible:border-[#B8823A] sm:w-auto"
              />
              {errors.startDate && (
                <p className="text-xs font-mono text-[#8C3B2E]">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="font-sans text-xs uppercase tracking-wider text-[#4E5D5A]">End date</Label>
              <Input
                type="date"
                min={today()}
                {...register("endDate")}
                className="w-full rounded-none border-[#4E5D5A]/40 bg-transparent font-mono text-sm text-[#20291F] focus-visible:ring-0 focus-visible:border-[#B8823A] sm:w-auto"
              />
              {errors.endDate && (
                <p className="text-xs font-mono text-[#8C3B2E]">
                  {errors.endDate.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="font-sans text-xs uppercase tracking-wider text-[#4E5D5A]">Quantity</Label>
              <Input
                type="number"
                min={1}
                max={gear.availableQuantity}
                {...register("quantity", { valueAsNumber: true })}
                className="w-full rounded-none border-[#4E5D5A]/40 bg-transparent font-mono text-sm text-[#20291F] focus-visible:ring-0 focus-visible:border-[#B8823A] sm:w-24"
              />
              {errors.quantity && (
                <p className="text-xs font-mono text-[#8C3B2E]">
                  {errors.quantity.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8"
            >
              {isSubmitting ? "Processing…" : "Rent Equipment"}
            </Button>
          </form>

          {watchQuantity > 0 && (
            <p className="mt-3 font-mono text-xs text-[#4E5D5A]">
              Estimated daily rate: ${(gear.price * watchQuantity).toFixed(2)}/day
            </p>
          )}
        </section>
      )}

      <section>
        <h2 className="font-display text-xl font-bold tracking-tight text-[#20291F] mb-4">
          Reviews ({reviews?.length ?? 0})
        </h2>
        {reviews && reviews.length > 0 ? (
          <div className="divide-y divide-[#4E5D5A]/20 border-y border-[#4E5D5A]/20">
            {reviews.map((review: Review) => (
              <div key={review.id} className="py-4">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-[#B8823A]">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                  <span className="font-mono text-xs text-[#4E5D5A]">
                    Customer #{review?.customer?.name}
                  </span>
                </div>
                <p className="text-[#20291F]">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#4E5D5A] border-y border-[#4E5D5A]/20 py-4">No reviews yet for this gear.</p>
        )}
      </section>
    </div>
  );
}
