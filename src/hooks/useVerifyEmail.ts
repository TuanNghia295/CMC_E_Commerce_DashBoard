import { useMutation } from "@tanstack/react-query";
import AxiosClient from "../constants/axiosClient";
import axios from "axios";

export type VerifyEmailResponse = {
  message: string;
};

export function useVerifyEmail() {
  return useMutation({
    mutationFn: async (token: string): Promise<VerifyEmailResponse> => {
      const res = await AxiosClient.post<VerifyEmailResponse>(
        "auth/verify",
        { token }
      );
      return res;
    },
    onSuccess: (data) => {
      console.log("Email verified successfully:", data);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.error("Verification failed:", error.response?.data);
        throw error.response?.data;
      }
      throw error;
    },
  });
}
