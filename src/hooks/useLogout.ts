import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useUserStore } from "../store/userStore";

export function useLogout() {
  const navigate = useNavigate();
  const logout = useUserStore((s) => s.logout);

  return useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      navigate("/signin", { replace: true });
    },
  });
}
