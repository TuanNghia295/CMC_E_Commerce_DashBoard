/* eslint-disable @typescript-eslint/no-explicit-any */
import {jwtDecode} from 'jwt-decode';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AxiosClient from '../constants/axiosClient';
import { AxiosResponse } from 'axios';

type DecodeToken = {
  exp: number;
  [key: string]: any; 
};


type RefreshToken = {
  access_token: string;
};

type UserState = {
  userInfo: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  setUserInfo: (info: any) => void;
  setAccessToken: (token: string | null) => Promise<void>;
  setRefreshToken: (token: string | null) => Promise<void>;
  loadToken: () => Promise<void>;
  checkToken: () => Promise<boolean>;
  refreshAccessToken: () => Promise<boolean>;
  logout: () => Promise<void>;
};

export const useUserStore = create<UserState>()(
  // Sử dụng persist để lưu các state vào AynscStorage để tránh việc reload App các state bị null
  persist(
    (set, get) => ({
      userInfo: null,
      accessToken: null,
      refreshToken: null,
      setUserInfo: info => set({userInfo: info}),
      setAccessToken: async token => {
        if (token) {
          await localStorage.setItem('accessToken', token);
        } else {
          await localStorage.removeItem('accessToken');
        }
        set({accessToken: token});
      },
      setRefreshToken: async token => {
        set({refreshToken: token});
      },
      loadToken: async () => {
        const accessToken = await localStorage.getItem('accessToken');
        set({accessToken});
      },
      checkToken: async () => {
        const token = get().accessToken;
        if (!token) return false;
        try {
          const decoded: DecodeToken = jwtDecode(token);
          console.log('Decode 😊😊', decoded);

          const now = Date.now() / 1000; // convert sang giây
          if (decoded.exp && decoded.exp < now) {
            console.log('⏰ Access token expired → trying refresh...');
            const refreshed = await get().refreshAccessToken();
            return refreshed;
          }
          return true;
        } catch (error) {
          console.log('❌ Lỗi khi decode access token:', error);
          // Token lỗi -> xóa
          await get().logout();
          return false;
        }
      },
      refreshAccessToken: async () => {
      try {
        const res: AxiosResponse<RefreshToken> = await AxiosClient.post('refresh');

        if (res.data?.access_token) {
          await get().setAccessToken(res.data.access_token);
          console.log('🔄 Refresh token thành công');
          return true;
        }

        return false;
      } catch (error) {
        console.log('❌ Refresh token thất bại', error);
        await get().logout();
        return false;
      }
      },


      logout: async () => {
        await localStorage.removeItem('accessToken');
        set({accessToken: null, refreshToken: null, userInfo: null});
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
