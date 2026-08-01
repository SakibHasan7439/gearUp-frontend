import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api-client";
import { Category, GearItem, RentalOrder } from "@/types";
import { toast } from "sonner";
import { CategoryFormValues } from "../validators/category";

// ---- Categories ----

export function useAdminCategories() {
  return useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/categories");
      return data.data as Category[];
    },
  });
}

export function useCreateCategory() {
  const queryClient  = useQueryClient();
  return useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      const { data } = await apiClient.post("/admin/categories", values);
      return data.data as Category;
    },
    onSuccess: () => {
      queryClient .invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to create category");
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: { id: string } & Partial<CategoryFormValues>) => {
      const { data } = await apiClient.patch(
        `/admin/categories/${id}`,
        values,
      );
      return data.data as Category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to update category");
    },
  });
}

export function useDeleteCategory() {
  const queryClient  = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/admin/categories/${id}`);
    },
    onSuccess: () => {
      queryClient .invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to delete category");
    },
  });
}

// ---- Gear ----

export function useAdminGear() {
  return useQuery({
    queryKey: ["admin", "gear"],
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/gear");
      return data.data as GearItem[];
    },
  });
}

// ---- Rentals ----

export function useAdminRentals() {
  return useQuery({
    queryKey: ["admin", "rentals"],
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/rentals");
      return data.data as RentalOrder[];
    },
  });
}
