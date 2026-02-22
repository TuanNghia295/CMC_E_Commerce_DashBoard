import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import type { DashboardStatusDistribution } from "../../types/report";

interface OrderStatusDistributionCardProps {
  statusDistribution: DashboardStatusDistribution;
  isLoading: boolean;
  isError: boolean;
}

const STATUS_LABELS = ["Pending", "Shipping", "Completed", "Cancelled"];

export default function OrderStatusDistributionCard({
  statusDistribution,
  isLoading,
  isError,
}: OrderStatusDistributionCardProps) {
  const series = [
    statusDistribution.pending,
    statusDistribution.shipping,
    statusDistribution.completed,
    statusDistribution.cancelled,
  ];

  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
      toolbar: {
        show: false,
      },
    },
    labels: STATUS_LABELS,
    colors: ["#FDB022", "#6172F3", "#17B26A", "#F04438"],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
  };

  const isEmpty = !isLoading && !isError && series.every((value) => value === 0);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        Order Status Distribution
      </h3>
      <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
        Distribution of order statuses in selected range
      </p>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex h-[280px] items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            Loading status distribution...
          </div>
        ) : isError ? (
          <div className="flex h-[280px] items-center justify-center text-sm text-red-500">
            Failed to load status distribution.
          </div>
        ) : isEmpty ? (
          <div className="flex h-[280px] items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            No order status data for selected range.
          </div>
        ) : (
          <Chart options={options} series={series} type="donut" height={280} />
        )}
      </div>
    </div>
  );
}
