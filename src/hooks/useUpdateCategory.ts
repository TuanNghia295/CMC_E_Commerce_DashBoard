import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../services/categoryService";
import type { CategoryUpdateInput, Category } from "../types/category";

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryUpdateInput }): Promise<Category> => {
      return categoryApi.updateCategory(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error("Error updating category:", error);
    },
  });
}
