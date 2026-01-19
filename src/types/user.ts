export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  avatar_url?: string | null;
  verified: boolean
}

export interface UserListResponse {
  data: User[];
  meta: {
    page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  };
}

export interface UserQueryParams {
  q?: string; // search query
  from_date?: string; // filter by created_at from
  to_date?: string; // filter by created_at to
  sort_by?: "full_name" | "email"; // column to sort
  sort_dir?: "asc" | "desc"; // sort direction
  page?: number;
  per_page?: number;
}

export interface UserCreateInput {
  email: string;
  full_name: string;
  phone?: string;
  role: "user" | "admin";
  password: string;
  password_confirmation: string;
  avatar?: string;
  verified?:boolean
}

export interface UserUpdateInput {
  email?: string;
  full_name?: string;
  phone?: string;
  role?: "user" | "admin";
  password?: string;
  password_confirmation?: string;
  avatar?: string;
  verified?:boolean;
}
