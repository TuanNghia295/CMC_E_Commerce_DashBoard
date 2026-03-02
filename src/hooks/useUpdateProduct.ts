import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../services/productService";
import type { ProductUpdateInput, Product } from "../types/product";

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductUpdateInput }): Promise<Product> => {
      return productApi.updateProduct(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.error("Error updating product:", error);
    },
  });
}
