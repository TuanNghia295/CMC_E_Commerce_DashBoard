import AxiosClient from "../constants/axiosClient";
import type { CategoryListResponse, CategoryQueryParams, Category, CategoryCreateInput, CategoryUpdateInput } from "../types/category";

export const categoryApi = {
  getCategories: async (params: CategoryQueryParams = {}): Promise<CategoryListResponse> => {
    const queryParams = new URLSearchParams();

    if (params.q) queryParams.append("q", params.q);
    if (params.status) queryParams.append("status", params.status);
    if (params.parent_id) queryParams.append("parent_id", params.parent_id.toString());
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.per_page) queryParams.append("per_page", params.per_page.toString());

    const queryString = queryParams.toString();
    const url = `/admin/categories${queryString ? `?${queryString}` : ""}`;

    return AxiosClient.get<CategoryListResponse>(url);
  },

  createCategory: async (data: CategoryCreateInput): Promise<Category> => {
    return AxiosClient.post<Category>("/admin/categories", {
      category: data
    });
  },

  updateCategory: async (id: number, data: CategoryUpdateInput): Promise<Category> => {
    return AxiosClient.put<Category>(`/admin/categories/${id}`, {
      category: data
    });
  },

  deleteCategory: async (id: number): Promise<void> => {
    return AxiosClient.delete(`/admin/categories/${id}`);
  },
};
