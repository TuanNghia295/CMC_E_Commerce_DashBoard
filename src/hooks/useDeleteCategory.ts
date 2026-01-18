import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../services/categoryService";

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number): Promise<void> => {
      return categoryApi.deleteCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
    },
  });
}
