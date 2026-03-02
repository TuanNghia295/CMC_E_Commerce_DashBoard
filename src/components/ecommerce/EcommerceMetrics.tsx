import { BoxIconLine, DollarLineIcon, GroupIcon } from "../../icons";

interface EcommerceMetricsProps {
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  isCustomersLoading: boolean;
  isOrdersLoading: boolean;
  isRevenueLoading: boolean;
  isCustomersError: boolean;
  isOrdersError: boolean;
  isRevenueError: boolean;
}

const numberFormatter = new Intl.NumberFormat("en-US");
const vndFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

function renderMetricValue({
  value,
  isLoading,
  isError,
  formatter = numberFormatter,
}: {
  value: number;
  isLoading: boolean;
  isError: boolean;
  formatter?: Intl.NumberFormat;
}) {
  if (isLoading) return "Loading...";
  if (isError) return "--";

  const formattedValue = formatter.format(value);

  return formatter === vndFormatter ? `${formattedValue} VND` : formattedValue;
}

export default function EcommerceMetrics({
  totalCustomers,
  totalOrders,
  totalRevenue,
  isCustomersLoading,
  isOrdersLoading,
  isRevenueLoading,
  isCustomersError,
  isOrdersError,
  isRevenueError,
}: EcommerceMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Customers
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {renderMetricValue({
              value: totalCustomers,
              isLoading: isCustomersLoading,
              isError: isCustomersError,
            })}
          </h4>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Orders (range)
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {renderMetricValue({
              value: totalOrders,
              isLoading: isOrdersLoading,
              isError: isOrdersError,
            })}
          </h4>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <DollarLineIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Revenue (range)
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {renderMetricValue({
              value: totalRevenue,
              isLoading: isRevenueLoading,
              isError: isRevenueError,
              formatter: vndFormatter,
            })}
          </h4>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
