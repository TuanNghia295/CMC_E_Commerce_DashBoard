import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../services/productService";
import type { ProductCreateInput, Product } from "../types/product";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductCreateInput): Promise<Product> => {
      return productApi.createProduct(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.error("Error creating product:", error);
    },
  });
}
