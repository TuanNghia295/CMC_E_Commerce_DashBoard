import AxiosClient from "../constants/axiosClient";
import type { BannerListResponse, BannerQueryParams, Banner, BannerCreateInput, BannerUpdateInput, BannerReorderInput } from "../types/banner";

export const bannerApi = {
  // Get all banners (with filters, search, pagination)
  getBanners: async (params: BannerQueryParams = {}): Promise<BannerListResponse> => {
    const queryParams = new URLSearchParams();

    if (params.q) queryParams.append("q", params.q);
    if (params.status) queryParams.append("status", params.status);
    if (params.sort_by) queryParams.append("sort_by", params.sort_by);
    if (params.sort_dir) queryParams.append("sort_dir", params.sort_dir);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.per_page) queryParams.append("per_page", params.per_page.toString());

    const queryString = queryParams.toString();
    const url = `/admin/banners${queryString ? `?${queryString}` : ""}`;

    return AxiosClient.get<BannerListResponse>(url);
  },

  // Get single banner by ID
  getBanner: async (id: number): Promise<Banner> => {
    return AxiosClient.get<Banner>(`/admin/banners/${id}`);
  },

  // Create new banner
  createBanner: async (data: BannerCreateInput): Promise<Banner> => {
    return AxiosClient.post<Banner>("/admin/banners", {
      banner: data
    });
  },

  // Update banner
  updateBanner: async (id: number, data: BannerUpdateInput): Promise<Banner> => {
    return AxiosClient.put<Banner>(`/admin/banners/${id}`, {
      banner: data
    });
  },

  // Delete banner (soft delete)
  deleteBanner: async (id: number): Promise<void> => {
    return AxiosClient.delete(`/admin/banners/${id}`);
  },

  // Reorder banners (bulk update display_order)
  reorderBanners: async (banners: BannerReorderInput[]): Promise<void> => {
    return AxiosClient.patch("/admin/banners/reorder", {
      banners: banners
    });
  },

  // Public API - Get active banners for display on website
  getPublicBanners: async (): Promise<{ data: Banner[] }> => {
    return AxiosClient.get<{ data: Banner[] }>("/banners");
  },
};
