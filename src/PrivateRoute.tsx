import { Navigate, Outlet } from "react-router";
import { jwtDecode } from "jwt-decode";

interface JwtPayload{
  exp: number;
}

function isAccessTokenValid() {
  const token = localStorage.getItem("accessToken");
  if (!token) return false;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const now = Date.now() / 1000;

    return decoded.exp > now;
  } catch (err) {
    console.error("Something wrong with accessToken",err);
    return false;
  }
}


export default function PrivateRoute() {
  return isAccessTokenValid()
    ? <Outlet />
    : <Navigate to="/signin" replace />;
}
