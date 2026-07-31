import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "../api-client";
import { RentalOrder } from "@/types";

export function useMyRentals() {
  return useQuery({
    queryKey: ["rentals"],
    queryFn: async () => {
      const { data } = await apiClient.get("/rentals");
      return data.data as RentalOrder[];
    },
  });
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
