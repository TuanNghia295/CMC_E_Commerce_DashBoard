export interface DashboardReportRange {
  from_date: string;
  to_date: string;
}

export interface SalesRevenueTrendBucket {
  label: string;
  orders_count: number;
  revenue: number;
}

export interface DashboardStatusDistribution {
  pending: number;
  shipping: number;
  completed: number;
  cancelled: number;
}

export interface DashboardReportResponse {
  range: DashboardReportRange;
  sales_revenue_trend: SalesRevenueTrendBucket[];
  status_distribution: DashboardStatusDistribution;
}

export interface DashboardReportQueryParams {
  from_date?: string;
  to_date?: string;
}
