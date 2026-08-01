import z from "zod";

export const gearFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.number().positive("Price must be greater than 0"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Select a category"),
  totalQuantity: z.number().int().min(1, "Must have at least 1 in stock"),
});

export type RentGearFormValues = z.infer<typeof gearFormSchema>;
