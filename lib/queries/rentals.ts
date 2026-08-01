import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api-client";
import { RentalOrder } from "@/types";
import { toast } from "sonner";

export interface CreateRentalPayload {
  items: {
    gearItemId: string;
    quantity: number;
    startDate: string;
    endDate: string;
  }[];
}

export function useCreateRental() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateRentalPayload) => {
      const {data} = await apiClient.post("/rentals", payload);
      return data.data as RentalOrder;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      toast.success("Rental order created successfully!");
    },
    
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to place order");
    }
  })
}

export function useMyRentals() {
  return useQuery({
    queryKey: ["rentals"],
    queryFn: async () => {
      const { data } = await apiClient.get("/rentals");
      return data.data as RentalOrder[];
    },
  });
}

export function useRentalDetails(id: string, pollForUpdate?: boolean) {
  return useQuery({
    queryKey: ["rentals", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/rentals/${id}`);
      return data.data as RentalOrder;
    },
    enabled: !!id,

    refetchInterval: (query) => {
      if(!pollForUpdate) return false;
      return query.state.data?.status === "PENDING" ? 2000 : false;
    }
  })
}

export function useRentalOrder(id: string) {
  return useQuery({
    queryKey: ["rentals", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/rentals/${id}`);
      return data.data as RentalOrder;
    },
    enabled: !!id,
  });
}

export function useCreatePaymentSession() {
  return useMutation({
    mutationFn: async (rentalOrderId: string) => {
      const { data } = await apiClient.post(`/rentals/${rentalOrderId}/pay`);
      return data.data as { url: string };
    },
  });
}
