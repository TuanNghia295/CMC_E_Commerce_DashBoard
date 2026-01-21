import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bannerApi } from "../services/bannerService";
import type { BannerCreateInput } from "../types/banner";
import { toast } from "react-hot-toast";

export const useCreateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BannerCreateInput) => bannerApi.createBanner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast.success("Banner created successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.errors?.join(", ") || "Failed to create banner");
    },
  });
};
