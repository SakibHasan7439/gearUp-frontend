import z from "zod";

export const gearSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  brand: z.string().min(1, "Brand is required"),
  price: z
    .number({ message: "Price is required" })
    .positive("Price must be positive"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  totalQuantity: z
    .number({ message: "Total quantity is required" })
    .int()
    .positive("Quantity must be at least 1"),
});

export type GearFormValues = z.infer<typeof gearSchema>;
