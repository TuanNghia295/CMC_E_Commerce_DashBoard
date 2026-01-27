export interface ProductVariant {
  id: number;
  size: string;
  color: string;
  sku: string;
  quantity: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  images: string[];
  image_thumbnails: string[];
  images_signed_ids: string[];
  variants: ProductVariant[];
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
  variants?: {
    size: string;
    color: string;
    sku: string;
    quantity: number;
  }[];
}

export interface ProductUpdateInput {
  name?: string;
  description?: string;
  price?: number;
  category_id?: number;
  image_signed_ids?: string[];
  existing_image_signed_ids?: string[];
}
