"use client";

import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, ReviewFormValues } from "@/lib/validators/review";
import { useCreateReview } from "@/lib/queries/reviews";
import { Button } from "@/components/ui/button";
import {
  FormField,
  formTextareaClass,
} from "@/components/shared/FormField";
import { cn } from "@/lib/utils";

export default function ReviewForm({
  gearItemId,
  onSubmitted,
}: {
  gearItemId: string;
  onSubmitted?: () => void;
}) {
  const { mutate, isPending } = useCreateReview();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema) as unknown as Resolver<ReviewFormValues>,
  });

  const selectedRating = watch("rating");
  console.log("selectedRating", selectedRating)

  const onSubmit = (values: ReviewFormValues) => {
    console.log('values :>> ', values);
    mutate(
      { gearItemId, ...values },
      {
        onSuccess: () => {
          reset();
          onSubmitted?.();
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <FormField label="Rating" error={errors.rating?.message}>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <label key={star} className="cursor-pointer">
              <input
                type="radio"
                value={star}
                {...register("rating", { valueAsNumber: true })}
                className="sr-only"
              />
              <span
                className={cn(
                  "text-2xl transition-colors",
                  selectedRating && star <= selectedRating
                    ? "text-[#B8823A]"
                    : "text-[#4E5D5A]/30 hover:text-[#B8823A]/60",
                )}
              >
                ★
              </span>
            </label>
          ))}
        </div>
      </FormField>

      <FormField label="Comment" error={errors.comment?.message}>
        <textarea
          {...register("comment")}
          placeholder="Write your review…"
          rows={4}
          className={formTextareaClass}
        />
      </FormField>

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? "Submitting…" : "Submit Review"}
      </Button>
    </form>
  );
}
