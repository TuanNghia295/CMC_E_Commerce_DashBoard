/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../services/userService";
import type { UserUpdateInput, User } from "../types/user";
import { useUserStore } from "../store/userStore";

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const {setUserInfo} = useUserStore()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserUpdateInput }): Promise<User> => {
      console.log("Updating user with data:", { id, data });
      return userApi.updateUser(id, data);
    },
    onSuccess: (updatedUser) => {
      console.log("User updated successfully:", updatedUser);
      console.log("Avatar URL from backend:", updatedUser.avatar_url);
      setUserInfo((prev: any) => ({
        ...prev,
        full_name: updatedUser.full_name,
        phone: updatedUser.phone,
        email: updatedUser.email,
        avatar: updatedUser.avatar_url,
      }));
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });
}
