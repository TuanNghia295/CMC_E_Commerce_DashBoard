import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "../services/orderService";
import type { OrderStatus } from "../types/order";

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      orderApi.updateOrderStatus(id, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: ["orderDetail", variables.id] });
      }
    },
  });
};
