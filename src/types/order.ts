export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderUser {
  id: number;
  full_name: string;
  email?: string;
  phone?: string;
}

export interface Order {
  id: number;
  order_code?: string;
  status: OrderStatus;
  total_amount?: number;
  total_price?: number;
  created_at: string;
  updated_at?: string;
  user?: OrderUser;
}

export interface OrderListResponse {
  data: Order[];
  meta: {
    page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  };
}

export interface OrderQueryParams {
  q?: string;
  sort_by?: "created_at" | "total_amount" | "total_price" | "status";
  sort_dir?: "asc" | "desc";
  page?: number;
  per_page?: number;
}
