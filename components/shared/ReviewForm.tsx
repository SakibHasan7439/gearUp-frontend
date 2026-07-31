"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, ReviewFormValues } from "@/lib/validators/review";
import { useCreateReview } from "@/lib/queries/reviews";

export default function ReviewForm({ gearItemId }: { gearItemId: string }) {
  const { mutate, isPending } = useCreateReview();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
  });

  const onSubmit = (values: ReviewFormValues) => {
    mutate(
      { gearItemId, ...values },
      { onSuccess: () => reset() },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <label key={star} className="cursor-pointer">
              <input
                type="radio"
                value={star}
                {...register("rating", { valueAsNumber: true })}
                className="sr-only"
              />
              <span className="text-xl text-yellow-500">★</span>
            </label>
          ))}
        </div>
        {errors.rating && (
          <p className="mt-1 text-sm text-red-500">{errors.rating.message}</p>
        )}
      </div>

      <div>
        <textarea
          {...register("comment")}
          placeholder="Write your review…"
          rows={3}
          className="w-full rounded border px-3 py-2"
        />
        {errors.comment && (
          <p className="mt-1 text-sm text-red-500">{errors.comment.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {isPending ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
