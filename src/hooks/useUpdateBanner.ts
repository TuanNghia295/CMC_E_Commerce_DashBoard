import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bannerApi } from "../services/bannerService";
import type { BannerUpdateInput } from "../types/banner";
import { toast } from "react-hot-toast";

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BannerUpdateInput }) =>
      bannerApi.updateBanner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast.success("Banner updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.errors?.join(", ") || "Failed to update banner");
    },
  });
};
