import { useQuery } from "@tanstack/react-query";
import { orderApi } from "../services/orderService";
import type { OrderQueryParams } from "../types/order";

export const useOrders = (params: OrderQueryParams = {}) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => orderApi.getOrders(params),
    staleTime: 1000 * 60 * 5,
  });
};
