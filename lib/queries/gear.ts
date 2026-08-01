import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api-client";
import { GearItem, Category, Review } from "@/types";

export interface GearFilters {
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export function useGearList(filters?: GearFilters) {
  return useQuery({
    queryKey: ["gear", filters],
    queryFn: async () => {
      const { data } = await apiClient.get("/gear", { params: filters });
      return data.data as GearItem[];
    },
  });
}

export function useGearItem(id: string) {
  return useQuery({
    queryKey: ["gear", id],
    queryFn: async () => {
      const {data} = await apiClient.get(`/gear/${id}`);
      return data.data as GearItem;
    },
    enabled: !!id,
  })
}


export function useGearReviews(gearItemId: string) {
  return useQuery({
    queryKey: ["gear", gearItemId, "reviews"],
    queryFn: async () => {
      const { data } = await apiClient.get(`/gear/${gearItemId}/reviews`);
      return data.data as Review[];
    },
    enabled: !!gearItemId,
  })
}
