import { useQuery } from "@tanstack/react-query";
import { userApi } from "../services/userService";
import type { UserQueryParams } from "../types/user";

export const useUsers = (params: UserQueryParams = {}) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => userApi.getUsers(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
