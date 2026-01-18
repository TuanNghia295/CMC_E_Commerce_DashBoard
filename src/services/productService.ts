import AxiosClient from "../constants/axiosClient";
import type { ProductListResponse, ProductQueryParams, Product, ProductCreateInput, ProductUpdateInput } from "../types/product";

export const productApi = {
  getProducts: async (params: ProductQueryParams = {}): Promise<ProductListResponse> => {
    const queryParams = new URLSearchParams();

    if (params.q) queryParams.append("q", params.q);
    if (params.min_price) queryParams.append("min_price", params.min_price.toString());
    if (params.max_price) queryParams.append("max_price", params.max_price.toString());
    if (params.category_id) queryParams.append("category_id", params.category_id.toString());
    if (params.sort_by) queryParams.append("sort_by", params.sort_by);
    if (params.sort_dir) queryParams.append("sort_dir", params.sort_dir);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.per_page) queryParams.append("per_page", params.per_page.toString());

    const queryString = queryParams.toString();
    const url = `/admin/products${queryString ? `?${queryString}` : ""}`;

    return AxiosClient.get<ProductListResponse>(url);
  },

  createProduct: async (data: ProductCreateInput): Promise<Product> => {
    return AxiosClient.post<Product>("/admin/products", {
      product: data
    });
  },

  updateProduct: async (id: number, data: ProductUpdateInput): Promise<Product> => {
    return AxiosClient.put<Product>(`/admin/products/${id}`, {
      product: data
    });
  },

  deleteProduct: async (id: number): Promise<void> => {
    return AxiosClient.delete(`/admin/products/${id}`);
  },
};
