import { useMutation } from '@tanstack/react-query';
import AxiosClient from '../constants/axiosClient';
import { useUserStore } from '../store/userStore';

export type LoginForm = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export function useLogin() {
  const setAccessToken = useUserStore((s) => s.setAccessToken);
  const setUserInfo = useUserStore((s) => s.setUserInfo);

  return useMutation({
    mutationFn: async (data: LoginForm): Promise<LoginResponse> => {
      const res = await AxiosClient.post<LoginResponse>(
        'admin/auth/login',
        data
      );
      return res;
    },
    onSuccess: (data) => {
      setAccessToken(data.access_token);
      setUserInfo(data.user);
    },
  });
}
