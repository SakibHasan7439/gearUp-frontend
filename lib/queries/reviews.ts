import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "../api-client";
import { Review } from "@/types";

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
  return useMutation({
    mutationFn: async ({
      gearItemId,
      rating,
      comment,
    }: {
      gearItemId: string;
      rating: number;
      comment: string;
    }) => {
      const { data } = await apiClient.post(`/gear/${gearItemId}/reviews`, {
        rating,
        comment,
      });
      return data.data as Review;
    },
  });
}
