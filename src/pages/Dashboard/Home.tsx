import { useMemo, useState } from "react";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import OrderStatusDistributionCard from "../../components/ecommerce/OrderStatusDistributionCard";
import PageMeta from "../../components/common/PageMeta";
import { useDashboardReport } from "../../hooks/useDashboardReport";
import { useOrders } from "../../hooks/useOrders";
import { useUsers } from "../../hooks/useUsers";

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

  const [chartRange, setChartRange] = useState(defaultRange);

  const { data, isLoading, isError } = useDashboardReport(chartRange);
  const {
    data: usersData,
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useUsers({ per_page: 1 });
  const { data: ordersData } = useOrders({ per_page: 1 });
  const {
    data: pendingOrdersData,
    isLoading: isPendingOrdersLoading,
    isError: isPendingOrdersError,
  } = useOrders({ per_page: 1, status: "pending" });
  const {
    data: shippingOrdersData,
    isLoading: isShippingOrdersLoading,
    isError: isShippingOrdersError,
  } = useOrders({ per_page: 1, status: "shipping" });
  const {
    data: completedOrdersData,
    isLoading: isCompletedOrdersLoading,
    isError: isCompletedOrdersError,
  } = useOrders({ per_page: 1, status: "completed" });
  const {
    data: cancelledOrdersData,
    isLoading: isCancelledOrdersLoading,
    isError: isCancelledOrdersError,
  } = useOrders({ per_page: 1, status: "cancelled" });

  const totalCustomers = usersData?.meta.total_count ?? 0;
  const totalOrders = data?.summary.total_orders ?? ordersData?.meta.total_count ?? 0;
  const totalRevenue = data?.summary.total_revenue ?? 0;

  const trendBuckets = data?.sales_revenue_trend ?? [];
  const categories = trendBuckets.map((bucket) => bucket.label);
  const salesSeries = trendBuckets.map((bucket) => bucket.orders_count);
  const revenueSeries = trendBuckets.map((bucket) => bucket.revenue);

  const statusDistribution = {
    pending: pendingOrdersData?.meta.total_count ?? 0,
    shipping: shippingOrdersData?.meta.total_count ?? 0,
    completed: completedOrdersData?.meta.total_count ?? 0,
    cancelled: cancelledOrdersData?.meta.total_count ?? 0,
  };

  const isStatusDistributionLoading =
    isPendingOrdersLoading ||
    isShippingOrdersLoading ||
    isCompletedOrdersLoading ||
    isCancelledOrdersLoading;

  const isStatusDistributionError =
    isPendingOrdersError ||
    isShippingOrdersError ||
    isCompletedOrdersError ||
    isCancelledOrdersError;

  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | NikeAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for NikeAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <EcommerceMetrics
            totalCustomers={totalCustomers}
            totalOrders={totalOrders}
            totalRevenue={totalRevenue}
            isCustomersLoading={isUsersLoading}
            isOrdersLoading={isLoading}
            isRevenueLoading={isLoading}
            isCustomersError={isUsersError}
            isOrdersError={isError}
            isRevenueError={isError}
          />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <StatisticsChart
            categories={categories}
            salesData={salesSeries}
            revenueData={revenueSeries}
            isLoading={isLoading}
            isError={isError}
            selectedRange={chartRange}
            onDateRangeChange={setChartRange}
          />
        </div>


       

        <div className="col-span-12 xl:col-span-4">
          <OrderStatusDistributionCard
            statusDistribution={statusDistribution}
            isLoading={isStatusDistributionLoading}
            isError={isStatusDistributionError}
          />
        </div>

      </div>
    </>
  );
}
