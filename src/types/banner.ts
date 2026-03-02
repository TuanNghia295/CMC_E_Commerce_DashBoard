export interface Banner {
  id: number;
  title: string;
  link_url: string | null;
  display_order: number;
  status: 'active' | 'inactive';
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface BannerQueryParams {
  q?: string;
  status?: 'active' | 'inactive';
  sort_by?: 'title' | 'display_order' | 'created_at';
  sort_dir?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface BannerListResponse {
  data: Banner[];
  meta: {
    page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  };
}

export interface BannerCreateInput {
  title: string;
  link_url?: string;
  display_order?: number;
  status?: 'active' | 'inactive';
  image_signed_id?: string;
}

export interface BannerUpdateInput {
  title?: string;
  link_url?: string;
  display_order?: number;
  status?: 'active' | 'inactive';
  image_signed_id?: string;
}

export interface BannerReorderInput {
  id: number;
  display_order: number;
}
