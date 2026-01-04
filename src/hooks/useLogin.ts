import { useMutation } from '@tanstack/react-query';
import AxiosClient from '../constants/axiosClient';
import { useUserStore } from '../store/userStore';

export type LoginForm = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
  userInfo?: any;
};

export function useLogin() {
  const setAccessToken = useUserStore((s) => s.setAccessToken);
  const setRefreshToken = useUserStore((s) => s.setRefreshToken);
  const setUserInfo = useUserStore((s) => s.setUserInfo);

  return useMutation({
    mutationFn: async (data: LoginForm): Promise<LoginResponse> => {
      const res = await AxiosClient.post<LoginResponse>(
        'auth/login',
        data
      );
      return res;
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      if (data.refreshToken) setRefreshToken(data.refreshToken);
      if (data.userInfo) setUserInfo(data.userInfo);
    },
  });
}
