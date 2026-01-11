import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../services/userService";
import type { UserUpdateInput, User } from "../types/user";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserUpdateInput }): Promise<User> => {
      return userApi.updateUser(id, data);
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });
}
