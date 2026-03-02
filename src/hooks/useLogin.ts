// src/hooks/useLogin.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import AxiosClient from "../constants/axiosClient";
import { useUserStore } from "../store/userStore";

export type LoginForm = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    full_name: string;
    role: string;
  };
};

export type UserInfoResponse = {
  user: {
    id: number;
    email: string;
    full_name: string;
    phone: string;
    avatar_url:string;
  };
};



export function useLogin() {
  const setTokens = useUserStore((s) => s.setTokens);
  const setUserInfo = useUserStore((s) => s.setUserInfo);
  return useMutation({
    mutationFn: async (data: LoginForm): Promise<LoginResponse> => {
      const res = await AxiosClient.post<LoginResponse>(
        "admin/auth/login",
        data
      );
      return res;
    },

   onSuccess: async (data) => {
      setTokens(data.access_token, data.refresh_token);
      const res = await AxiosClient.get<UserInfoResponse>("users/userInfo")
      setUserInfo (res.user)
    },
    onError: (e)=> console.log("error",e)
    
  });
}

export function useUserInfo(){
  return useQuery({
    queryKey:["userInfo"],
    queryFn: async ():Promise<UserInfoResponse> =>{
      const res = await AxiosClient.get<UserInfoResponse>(
        "users/userInfo"
      )
      return res
    }
  })
}