/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import type {
  Banner,
  BannerQueryParams,
  BannerCreateInput,
  BannerUpdateInput,
} from "../../../types/banner";
import { useBanners } from "../../../hooks/useBanners";
import { useCreateBanner } from "../../../hooks/useCreateBanner";
import { useUpdateBanner } from "../../../hooks/useUpdateBanner";
import { useDeleteBanner } from "../../../hooks/useDeleteBanner";
import BannerFormModal from "../../modals/BannerFormModal";
import DeleteConfirmModal from "../../modals/DeleteConfirmModal";
import { ExternalLink } from "lucide-react";

export default function BannerListTable() {
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "active" | "inactive">("");
  const [sortBy, setSortBy] = useState<"title" | "display_order" | "created_at">("display_order");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  // Query params for API call
  const [queryParams, setQueryParams] = useState<BannerQueryParams>({
    page: 1,
    per_page: 10,
    sort_by: "display_order",
    sort_dir: "asc",
  });

  // React Query hooks
  const { data, isLoading, error } = useBanners(queryParams);
  const createBannerMutation = useCreateBanner();
  const updateBannerMutation = useUpdateBanner();
  const deleteBannerMutation = useDeleteBanner();

  const banners = data?.data || [];
  const totalPages = data?.meta.total_pages || 1;
  const totalCount = data?.meta.total_count || 0;

  const handleSearch = () => {
    setQueryParams({
      ...queryParams,
      page: 1,
      q: searchQuery || undefined,
      status: statusFilter || undefined,
    });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setQueryParams({
      page: 1,
      per_page: perPage,
      sort_by: sortBy,
      sort_dir: sortDir,
    });
    setCurrentPage(1);
  };

  const handleSort = (column: "title" | "display_order" | "created_at") => {
    const newSortDir = sortBy === column && sortDir === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortDir(newSortDir);
    setQueryParams({
      ...queryParams,
      sort_by: column,
      sort_dir: newSortDir,
    });
  };

  const handleSortToggle = () => {
    const newSortDir = sortDir === "asc" ? "desc" : "asc";
    setSortDir(newSortDir);
    setQueryParams({
      ...queryParams,
      sort_dir: newSortDir,
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setQueryParams({ ...queryParams, page: newPage });
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
    setQueryParams({ ...queryParams, per_page: newPerPage, page: 1 });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Create banner
  const handleCreate = () => {
    setFormMode("create");
    setSelectedBanner(null);
    setIsFormModalOpen(true);
  };

  const handleCreateSubmit = async (data: BannerCreateInput | BannerUpdateInput) => {
    await createBannerMutation.mutateAsync(data as BannerCreateInput);
  };

  // Edit banner
  const handleEdit = (banner: Banner) => {
    setFormMode("edit");
    setSelectedBanner(banner);
    setIsFormModalOpen(true);
  };

  const handleEditSubmit = async (data: BannerCreateInput | BannerUpdateInput) => {
    if (selectedBanner) {
      await updateBannerMutation.mutateAsync({
        id: selectedBanner.id,
        data: data as BannerUpdateInput,
      });
    }
  };

  // Delete banner
  const handleDeleteClick = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedBanner) {
      await deleteBannerMutation.mutateAsync(selectedBanner.id);
      setIsDeleteModalOpen(false);
      setSelectedBanner(null);
    }
  };

  // Reorder banners (move up/down)
  // const handleMoveUp = async (banner: Banner, index: number) => {
  //   if (index === 0) return;

  //   const previousBanner = banners[index - 1];
  //   const reorderData = [
  //     { id: banner.id, display_order: previousBanner.display_order },
  //     { id: previousBanner.id, display_order: banner.display_order },
  //   ];

  //   await reorderBannersMutation.mutateAsync(reorderData);
  // };

  // const handleMoveDown = async (banner: Banner, index: number) => {
  //   if (index === banners.length - 1) return;

  //   const nextBanner = banners[index + 1];
  //   const reorderData = [
  //     { id: banner.id, display_order: nextBanner.display_order },
  //     { id: nextBanner.id, display_order: banner.display_order },
  //   ];

  //   await reorderBannersMutation.mutateAsync(reorderData);
  // };

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Failed to load banners. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add Banner Button */}
      <div className="flex justify-end">
        <button
          onClick={handleCreate}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Banner
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white dark:bg-white/[0.03] p-4 rounded-xl border border-gray-200 dark:border-white/[0.05]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          {/* Left side: Search + Status */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search */}
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search by title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Status Filter */}
            <div className="min-w-[150px]">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "" | "active" | "inactive")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Right side: Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="px-3 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
            >
              Search
            </button>

            <button
              onClick={handleSortToggle}
              className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-md
                        hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              {sortDir === "asc" ? "A-Z ↑" : "Z-A ↓"}
            </button>

            {(searchQuery || statusFilter) && (
              <button
                onClick={handleClearFilters}
                className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200
                          dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 dark:text-gray-400">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            Loading banners...
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
                  {/* <TableCell className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Order
                  </TableCell> */}
                  <TableCell className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Preview
                  </TableCell>
                  <TableCell
                    className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center gap-1">
                      Title
                      {sortBy === "title" && (
                        <span>{sortDir === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Link
                  </TableCell>
                  <TableCell
                    className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => handleSort("display_order")}
                  >
                    <div className="flex items-center gap-1">
                      Display Order
                      {sortBy === "display_order" && (
                        <span>{sortDir === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
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
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {banners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                      No banners found
                    </TableCell>
                  </TableRow>
                ) : (
                  banners.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell className="px-5 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {banner.id}
                      </TableCell>
                      {/* <TableCell className="px-5 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleMoveUp(banner, index)}
                            disabled={index === 0 || reorderBannersMutation.isPending}
                            className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Move up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleMoveDown(banner, index)}
                            disabled={index === banners.length - 1 || reorderBannersMutation.isPending}
                            className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Move down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell> */}
                      <TableCell className="px-5 py-3">
                        {banner.image ? (
                          <img
                            src={banner.image}
                            alt={banner.title}
                            className="h-12 w-20 object-cover rounded border border-gray-200 dark:border-gray-700"
                          />
                        ) : (
                          <div className="h-12 w-20 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-400">No image</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium">
                        {banner.title}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {banner.link_url ? (
                          <a
                            href={banner.link_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span className="max-w-[150px] truncate">Link</span>
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {banner.display_order}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            banner.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                        >
                          {banner.status}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(banner.created_at)}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(banner)}
                            className="px-3 py-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-600 dark:border-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(banner)}
                            className="px-3 py-1 text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 border border-red-600 dark:border-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Pagination Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-white/[0.03] p-4 rounded-xl border border-gray-200 dark:border-white/[0.05]">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Per page:
          </label>
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
            Showing {banners.length === 0 ? 0 : (currentPage - 1) * perPage + 1} to{" "}
            {Math.min(currentPage * perPage, totalCount)} of {totalCount} banners
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

      {/* Modals */}
      <BannerFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={formMode === "create" ? handleCreateSubmit : handleEditSubmit}
        banner={selectedBanner}
        mode={formMode}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        userName={selectedBanner?.title}
        isDeleting={deleteBannerMutation.isPending}
      />
    </div>
  );
}
