import z from "zod";

export const reviewSchema = z.object({
  rating: z
    .number({ message: "Rating is required" })
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  comment: z.string().min(1, "Comment is required"),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
