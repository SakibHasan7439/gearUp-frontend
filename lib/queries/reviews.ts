import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api-client";
import { Review } from "@/types";
import { toast } from "sonner";


export interface CreateReviewPayload {
  gearItemId: string;
  rating: number;
  comment: string;
}


export function useGearReviews(gearId: string) {
  return useQuery({
    queryKey: ["reviews", gearId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/gear/${gearId}/reviews`);
      return data.data as Review[];
    },
    enabled: !!gearId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateReviewPayload) => {
      const { data } = await apiClient.post(`/review`, payload);
      return data.data as Review;
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["gear", variables.gearItemId, "review"]
     });
     toast.success("Review created successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to create review");
    }
  })
}
