export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  images: string[];
  image_thumbnails: string[];
  created_at: string;
}

export interface ProductQueryParams {
  q?: string;
  min_price?: number;
  max_price?: number;
  category_id?: number;
  sort_by?: "name" | "price" | "created_at";
  sort_dir?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

export interface ProductListResponse {
  data: Product[];
  meta: {
    page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  };
}

export interface ProductCreateInput {
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_signed_ids?: string[];
}

export interface ProductUpdateInput {
  name?: string;
  description?: string;
  price?: number;
  category_id?: number;
  image_signed_ids?: string[];
}
