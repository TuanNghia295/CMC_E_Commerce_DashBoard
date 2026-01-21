/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bannerApi } from "../services/bannerService";
import type { BannerReorderInput } from "../types/banner";
import { toast } from "react-hot-toast";

export const useReorderBanners = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (banners: BannerReorderInput[]) => bannerApi.reorderBanners(banners),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast.success("Banners reordered successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to reorder banners");
    },
  });
};
