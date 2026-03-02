import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "../services/categoryService";
import type { CategoryQueryParams } from "../types/category";

export const useCategories = (params: CategoryQueryParams = {}) => {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => categoryApi.getCategories(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
