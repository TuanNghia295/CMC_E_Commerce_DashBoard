export interface Category {
  id: number;
  name: string;
  parent_id: number | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  parent?: {
    id: number;
    name: string;
  };
}

export interface CategoryQueryParams {
  q?: string;
  status?: "active" | "inactive";
  parent_id?: number;
  page?: number;
  per_page?: number;
}

export interface CategoryListResponse {
  data: Category[];
  meta: {
    page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  };
}

export interface CategoryCreateInput {
  name: string;
  parent_id?: number | null;
  status?: "active" | "inactive";
}

export interface CategoryUpdateInput {
  name?: string;
  parent_id?: number | null;
  status?: "active" | "inactive";
}
