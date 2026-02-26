import { useMemo, useState } from "react";
import { useParams } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { useOrders } from "../../../hooks/useOrders";
import { useUpdateOrderStatus } from "../../../hooks/useUpdateOrderStatus";
import { useDebounce } from "../../../hooks/useDebounce";
import type { Order, OrderQueryParams, OrderStatus } from "../../../types/order";

const statusOptions: OrderStatus[] = [
  "pending",
  "shipping",
  "completed",
  "cancelled",
];

export default function OrdersListTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<OrderQueryParams["sort_by"]>("created_at");
  const [sortDir, setSortDir] = useState<OrderQueryParams["sort_dir"]>("desc");
  const { status: statusParam } = useParams<{ status?: string }>();

  const debouncedSearch = useDebounce(searchQuery, 500);
  const routeStatus = useMemo<OrderStatus | undefined>(() => {
    if (!statusParam) return undefined;
    return statusOptions.includes(statusParam as OrderStatus)
      ? (statusParam as OrderStatus)
      : undefined;
  }, [statusParam]);

  const queryParams = useMemo<OrderQueryParams>(
    () => ({
      page: currentPage,
      per_page: perPage,
      q: debouncedSearch || undefined,
      status: routeStatus,
      sort_by: sortBy,
      sort_dir: sortDir,
    }),
    [currentPage, perPage, debouncedSearch, routeStatus, sortBy, sortDir]
  );

  const { data, isLoading, error } = useOrders(queryParams);
  const updateStatusMutation = useUpdateOrderStatus();

  const orders = data?.data || [];
  const totalPages = data?.meta.total_pages || 1;
  const totalCount = data?.meta.total_count || 0;

  const handleSort = (column: NonNullable<OrderQueryParams["sort_by"]>) => {
    const newSortDir = sortBy === column && sortDir === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortDir(newSortDir);
  };

  const handleSortToggle = () => {
    setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const formatCurrency = (value?: number | null) => {
    if (value == null) return "-";
    return `${new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(value)} VND`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleStatusChange = (order: Order, status: OrderStatus) => {
    if (order.status === status) return;
    updateStatusMutation.mutate({ id: order.id, status });
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Failed to load orders. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Search
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by order code, user, phone..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSortToggle}
            className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-md
            hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            {sortDir === "asc" ? "A-Z ↑" : "Z-A ↓"}
          </button>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200
              dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 dark:text-gray-400">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            Loading orders...
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto overflow-y-visible rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    ID
                  </TableCell>
                  <TableCell
                    className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => handleSort("created_at")}
                  >
                    <div className="flex items-center gap-1">
                      Created At
                      {sortBy === "created_at" && (
                        <span>{sortDir === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Order Code
                  </TableCell>
                  <TableCell className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Customer
                  </TableCell>
                  <TableCell className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total
                  </TableCell>
                  <TableCell
                    className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {sortBy === "status" && (
                        <span>{sortDir === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="px-5 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {order.id}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(order.created_at)}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {order.order_code || "-"}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {order.user?.full_name || "Unknown"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {order.user?.email || order.user?.phone || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {formatCurrency(order.total_amount ?? order.total_price)}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-sm">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order, e.target.value as OrderStatus)}
                          className="px-2 py-1 border border-gray-300 rounded-lg text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                          disabled={updateStatusMutation.isPending}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-white/[0.03] p-4 rounded-xl border border-gray-200 dark:border-white/[0.05]">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 dark:text-gray-300">Per page:</label>
          <select
            value={perPage}
            onChange={(e) => handlePerPageChange(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing {orders.length === 0 ? 0 : (currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, totalCount)} of {totalCount} orders
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
