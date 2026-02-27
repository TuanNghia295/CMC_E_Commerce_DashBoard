export type AdminOrderNotificationCustomer = {
  id: number;
  full_name: string | null;
  email: string | null;
  phone: string | null;
};

export type AdminOrderNotificationData = {
  id: number;
  order_code: string;
  status: "pending" | "shipping" | "completed" | "cancelled";
  total_amount: number | string;
  created_at: string;
  customer: AdminOrderNotificationCustomer;
};

export type AdminOrdersCreatedEvent = {
  event: "admin.orders.created.v1";
  data: AdminOrderNotificationData;
};
