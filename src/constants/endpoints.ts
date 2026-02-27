export const END_POINTS = import.meta.env.VITE_API_URL;

const deriveCableEndpoint = () => {
  if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL;

  const apiBaseUrl = END_POINTS || "http://localhost:3000/api/v1";
  const baseHttp = apiBaseUrl.replace(/\/api\/v1\/?$/, "");
  return `${baseHttp.replace(/^http/i, "ws")}/cable`;
};

export const CABLE_ENDPOINT = deriveCableEndpoint();
export const ACCESS_TOKEN_KEY = "admin_access_token";
export const REFRESH_TOKEN_KEY = "admin_refresh_token";
export const USER_KEY = "admin_user";