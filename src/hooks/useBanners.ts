import { useQuery } from "@tanstack/react-query";
import { bannerApi } from "../services/bannerService";
import type { BannerQueryParams } from "../types/banner";

export const useBanners = (params: BannerQueryParams = {}) => {
  return useQuery({
    queryKey: ["banners", params],
    queryFn: () => bannerApi.getBanners(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
