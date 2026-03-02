import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../services/userService";
import type { UserCreateInput, User } from "../types/user";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserCreateInput): Promise<User> => {
      return userApi.createUser(data);
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });
}
