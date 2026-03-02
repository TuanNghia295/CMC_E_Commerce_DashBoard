import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../services/categoryService";
import type { CategoryCreateInput, Category } from "../types/category";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryCreateInput): Promise<Category> => {
      return categoryApi.createCategory(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error("Error creating category:", error);
    },
  });
}
