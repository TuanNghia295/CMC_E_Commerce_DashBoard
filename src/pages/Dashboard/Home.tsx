import { useMemo } from "react";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import OrderStatusDistributionCard from "../../components/ecommerce/OrderStatusDistributionCard";
import PageMeta from "../../components/common/PageMeta";
import { useDashboardReport } from "../../hooks/useDashboardReport";

function toIsoDate(date: Date) {
  return date.toISOString().split("T")[0];
}

export default function Home() {
  const defaultRange = useMemo(() => {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - 29);

    return {
      from_date: toIsoDate(fromDate),
      to_date: toIsoDate(toDate),
    };
  }, []);

  const { data, isLoading, isError } = useDashboardReport(defaultRange);

  const trendBuckets = data?.sales_revenue_trend ?? [];
  const categories = trendBuckets.map((bucket) => bucket.label);
  const salesSeries = trendBuckets.map((bucket) => bucket.orders_count);
  const revenueSeries = trendBuckets.map((bucket) => bucket.revenue);

  const statusDistribution = data?.status_distribution ?? {
    pending: 0,
    shipping: 0,
    completed: 0,
    cancelled: 0,
  };

  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

          <MonthlySalesChart
            categories={categories}
            salesData={salesSeries}
            isLoading={isLoading}
            isError={isError}
          />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart
            categories={categories}
            salesData={salesSeries}
            revenueData={revenueSeries}
            isLoading={isLoading}
            isError={isError}
          />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <OrderStatusDistributionCard
            statusDistribution={statusDistribution}
            isLoading={isLoading}
            isError={isError}
          />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
