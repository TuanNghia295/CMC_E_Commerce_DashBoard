import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../services/userService";
import type { UserUpdateInput, User } from "../types/user";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserUpdateInput }): Promise<User> => {
      console.log("Updating user with data:", { id, data });
      return userApi.updateUser(id, data);
    },
    onSuccess: (updatedUser) => {
      console.log("User updated successfully:", updatedUser);
      console.log("Avatar URL from backend:", updatedUser.avatar_url);
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });
}
