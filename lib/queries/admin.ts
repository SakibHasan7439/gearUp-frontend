import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api-client";
import { Category, GearItem, RentalOrder } from "@/types";
import { toast } from "sonner";

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
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: { name: string; slug: string }) => {
      const { data } = await apiClient.post("/admin/categories", values);
      return data.data as Category;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to create category");
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...values
    }: { id: string; name: string; slug: string }) => {
      const { data } = await apiClient.patch(
        `/admin/categories/${id}`,
        values,
      );
      return data.data as Category;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to update category");
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/admin/categories/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
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
