import { Navigate, Outlet } from "react-router";
import { useEffect, useState } from "react";
import { useUserStore } from "./store/userStore";


export default function PrivateRoute() {
  const accessToken = useUserStore((s) => s.accessToken);
  
  const checkToken = useUserStore((s) => s.checkToken);

  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const verify = async () => {
      if (!accessToken) {
        setAllowed(false);
        return;
      }

      const ok = await checkToken();
      setAllowed(ok);
    };

    verify();
  }, [accessToken, checkToken]);

  if (allowed === null) return null;

  return allowed ? <Outlet /> : <Navigate to="/signin" replace />;
}
