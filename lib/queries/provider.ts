import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api-client";
import { GearItem, RentalOrder } from "@/types";
import { toast } from "sonner";

// ---- Gear ----

export function useMyGear() {
  return useQuery({
    queryKey: ["provider", "gear"],
    queryFn: async () => {
      const { data } = await apiClient.get("/provider/gear");
      return data.data as GearItem[];
    },
  });
}

export function useCreateGear() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Omit<GearItem, "id" | "userId" | "createdAt" | "updatedAt" | "availableQuantity" | "category"> & { categoryId: string }) => {
      const { data } = await apiClient.post("/provider/gear", values);
      return data.data as GearItem;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["provider", "gear"] });
      toast.success("Gear created");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to create gear");
    },
  });
}

export function useUpdateGear() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...values
    }: Partial<Omit<GearItem, "id" | "userId" | "createdAt" | "updatedAt" | "availableQuantity" | "category">> & { id: string; categoryId?: string }) => {
      const { data } = await apiClient.patch(`/provider/gear/${id}`, values);
      return data.data as GearItem;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["provider", "gear"] });
      toast.success("Gear updated");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to update gear");
    },
  });
}

export function useDeleteGear() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/provider/gear/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["provider", "gear"] });
      toast.success("Gear deleted");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to delete gear");
    },
  });
}

// ---- Orders ----

export function useProviderOrders() {
  return useQuery({
    queryKey: ["provider", "orders"],
    queryFn: async () => {
      const { data } = await apiClient.get("/provider/orders");
      return data.data as RentalOrder[];
    },
  });
}

const nextStatus: Record<string, { label: string; status: string }> = {
  PENDING: { label: "Confirm", status: "CONFIRMED" },
  CONFIRMED: { label: "Mark Picked Up", status: "PICKED_UP" },
  PICKED_UP: { label: "Mark Returned", status: "RETURNED" },
};

export { nextStatus };

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await apiClient.patch(`/provider/orders/${id}`, { status });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["provider", "orders"] });
      toast.success("Order status updated");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to update order");
    },
  });
}
