import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../api-client";
import { Payment } from "@/types";

export function useCreatePayment () {
    return useMutation({
        mutationFn: async(rentalOrderId: string) => {
            const { data } = await apiClient.post(`/payments/create`,{
                rentalOrderId
            });
            return data.data as {paymentUrl: string};
        },

        onSuccess: (data) => {
            window.location.href = data.paymentUrl
        }
    })
}

export function useMyPayments () {
    return useQuery({
        queryKey: ["payments"],
        queryFn: async () => {
            const { data } = await apiClient.get("/payments");
            return data.data as Payment[];
        }
    })
}

export function usePaymentById (id: string) {
    return useQuery({
        queryKey: ["payments", id],
        queryFn: async () => {
            const {data} = await apiClient.get(`/payments/${id}`);
            return data.data as Payment;
        },
        enabled: !!id
    })
}