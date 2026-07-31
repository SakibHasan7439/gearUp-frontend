import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api-client";
import { GearItem, Category } from "@/types";

export function useGearList() {
  return useQuery({
    queryKey: ["gear"],
    queryFn: async () => {
      const { data } = await apiClient.get("/gear");
      return data.data as GearItem[];
    },
  });
}

export function useGearItem(id: string) {
  return useQuery({
    queryKey: ["gear", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/gear/${id}`);
      return data.data as GearItem;
    },
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await apiClient.get("/categories");
      return data.data as Category[];
    },
  });
}
