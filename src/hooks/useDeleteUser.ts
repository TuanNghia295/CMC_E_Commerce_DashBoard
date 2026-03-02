import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../services/userService";

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number): Promise<void> => {
      return userApi.deleteUser(id);
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
    },
  });
}
