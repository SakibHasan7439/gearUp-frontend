import z from "zod";

const rentalBaseSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  quantity: z
    .number({ message: "Quantity is required" })
    .int()
    .positive("Quantity must be at least 1"),
});

const dateRangeRefinement = {
  message: "End date must be after start date",
  path: ["endDate"],
};

export const rentalSchema = rentalBaseSchema.refine(
  (data) => new Date(data.endDate) > new Date(data.startDate),
  dateRangeRefinement,
);

export const rentGearSchema = rentalBaseSchema
  .extend({
    gearItemId: z.string().min(1, "Gear item is required"),
  })
  .refine(
    (data) => new Date(data.endDate) > new Date(data.startDate),
    dateRangeRefinement,
  );

export type RentalFormValues = z.infer<typeof rentalSchema>;
export type RentGearFormValues = z.infer<typeof rentGearSchema>;
