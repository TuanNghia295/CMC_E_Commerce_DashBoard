import AxiosClient from "../constants/axiosClient";
import type { UserListResponse, UserQueryParams, User, UserCreateInput, UserUpdateInput } from "../types/user";

export const userApi = {
  getUsers: async (params: UserQueryParams = {}): Promise<UserListResponse> => {
    const queryParams = new URLSearchParams();

    if (params.q) queryParams.append("q", params.q);
    if (params.from_date) queryParams.append("from_date", params.from_date);
    if (params.to_date) queryParams.append("to_date", params.to_date);
    if (params.sort_by) queryParams.append("sort_by", params.sort_by);
    if (params.sort_dir) queryParams.append("sort_dir", params.sort_dir);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.per_page) queryParams.append("per_page", params.per_page.toString());

    const queryString = queryParams.toString();
    const url = `/admin/users${queryString ? `?${queryString}` : ""}`;

    return AxiosClient.get<UserListResponse>(url);
  },

  createUser: async (data: UserCreateInput): Promise<User> => {
    return AxiosClient.post<User>("/admin/users", {
      user:data
    });
  },

  updateUser: async (id: number, data: UserUpdateInput): Promise<User> => {
    return AxiosClient.put<User>(`/admin/users/${id}`, {
      user: data
    });
  },

  deleteUser: async (id: number): Promise<void> => {
    return AxiosClient.delete(`/admin/users/${id}`);
  },
};
