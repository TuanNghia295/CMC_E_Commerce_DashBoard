import AxiosClient from "../constants/axiosClient";
import type { OrderListResponse, OrderQueryParams, Order, OrderStatus } from "../types/order";

export const orderApi = {
  getOrders: async (params: OrderQueryParams = {}): Promise<OrderListResponse> => {
    const queryParams = new URLSearchParams();

    if (params.q) queryParams.append("q", params.q);
    if (params.sort_by) queryParams.append("sort_by", params.sort_by);
    if (params.sort_dir) queryParams.append("sort_dir", params.sort_dir);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.per_page) queryParams.append("per_page", params.per_page.toString());

    const queryString = queryParams.toString();
    const url = `/admin/orders${queryString ? `?${queryString}` : ""}`;

    return AxiosClient.get<OrderListResponse>(url);
  },

  updateOrderStatus: async (id: number, status: OrderStatus): Promise<Order> => {
    return AxiosClient.put<Order>(`/admin/orders/${id}`, { status });
  },
};
