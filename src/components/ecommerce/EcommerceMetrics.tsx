import { BoxIconLine, GroupIcon } from "../../icons";

interface EcommerceMetricsProps {
  totalCustomers: number;
  totalOrders: number;
  isCustomersLoading: boolean;
  isOrdersLoading: boolean;
  isCustomersError: boolean;
  isOrdersError: boolean;
}

const numberFormatter = new Intl.NumberFormat("en-US");

function renderMetricValue({
  value,
  isLoading,
  isError,
}: {
  value: number;
  isLoading: boolean;
  isError: boolean;
}) {
  if (isLoading) return "Loading...";
  if (isError) return "--";

  return numberFormatter.format(value);
}

export default function EcommerceMetrics({
  totalCustomers,
  totalOrders,
  isCustomersLoading,
  isOrdersLoading,
  isCustomersError,
  isOrdersError,
}: EcommerceMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
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
            Orders
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
    </div>
  );
}
