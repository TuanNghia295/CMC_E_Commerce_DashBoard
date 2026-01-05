
// src/hooks/useLogout.ts
import { useMutation } from "@tanstack/react-query";
import AxiosClient from "../constants/axiosClient";
import type { AxiosResponse, AxiosError } from "axios";
import { useNavigate } from "react-router";

type LogoutSuccess = { message: string };
type LogoutError = { error: string };


function cleanup() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
}


export function useLogout() {
  const navigate = useNavigate();

  return useMutation<LogoutSuccess, AxiosError<LogoutError>, void>({
    mutationFn: async (): Promise<LogoutSuccess> => {
      const res: AxiosResponse<LogoutSuccess> = await AxiosClient.post(
        "admin/auth/logout",
        undefined,
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: (data) => {
      cleanup();
      navigate("/signin");

      console.log("[LOGOUT SUCCESS]:", data?.message);
    },
    onError: () => {
       cleanup();
       navigate("/signin");
    },
  });
}
