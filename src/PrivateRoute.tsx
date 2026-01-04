import { Navigate, Outlet } from "react-router";

function isAuthenticated() {
  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");
  // Kiểm tra token có tồn tại và hợp lệ (có thể thêm kiểm tra hết hạn nếu cần)
  return !!accessToken && !!refreshToken;
}

export default function PrivateRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/signin" replace />;
}
