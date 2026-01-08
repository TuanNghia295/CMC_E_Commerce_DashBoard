import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { END_POINTS } from './endpoints';
import { useUserStore } from '../store/userStore';

// 🧠 Khai báo type AxiosClient chung
interface TypedAxiosInstance extends AxiosInstance {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

const AxiosClient: TypedAxiosInstance = axios.create({
  baseURL: END_POINTS,
  timeout: 10000,
}) as TypedAxiosInstance;

// 🟡 Request Interceptor
AxiosClient.interceptors.request.use((config) => {
  if (!config.url?.includes("auth/logout")) {
    const token = useUserStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});


// 🟢 Response Interceptor — trả về data trực tiếp
AxiosClient.interceptors.response.use(
  function <T>(response: AxiosResponse<T>) {
    return response.data;
  },
  async (error: AxiosError) => {
    const {setTokens, setUserInfo} = useUserStore.getState();
    if ( error.response?.status === 401 && !error.config?.url?.includes("auth/logout")) {
      setTokens(null,null);
      setUserInfo(null);
}
    return Promise.reject(error.response?.data || error);
  },
);

export default AxiosClient;
