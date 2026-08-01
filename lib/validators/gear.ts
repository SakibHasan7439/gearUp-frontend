import z from "zod";

export const gearSchema = z.object({
  gearItemId: z.string(),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  startDate: z.date({ error: "Start date is required" }),
  endDate: z.date({ error: "End date is required" }),
}).refine((data) => data.startDate <= data.endDate, {
  message: "Start date must be before or equal to end date",
  path: ["endDate"],
});

export type RentGearFormValues = z.infer<typeof gearSchema>;
