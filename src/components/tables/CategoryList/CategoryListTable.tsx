import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import type { Category, CategoryQueryParams, CategoryCreateInput, CategoryUpdateInput } from "../../../types/category";
import { useCategories } from "../../../hooks/useCategories";
import { useCreateCategory } from "../../../hooks/useCreateCategory";
import { useUpdateCategory } from "../../../hooks/useUpdateCategory";
import { useDeleteCategory } from "../../../hooks/useDeleteCategory";
import CategoryFormModal from "../../modals/CategoryFormModal";
import DeleteConfirmModal from "../../modals/DeleteConfirmModal";

export default function CategoryListTable() {
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "">("");

  // Modal states (we'll create modals later)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  // Query params for API call
  const [queryParams, setQueryParams] = useState<CategoryQueryParams>({
    page: 1,
    per_page: 10,
  });

  // React Query hooks
  const { data, isLoading, error } = useCategories(queryParams);
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const categories = data?.data || [];
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
    });
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setQueryParams({
      ...queryParams,
      page: newPage,
    });
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
    setQueryParams({
      ...queryParams,
      page: 1,
      per_page: newPerPage,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Modal handlers
  const handleAddCategory = () => {
    setFormMode("create");
    setSelectedCategory(null);
    setIsFormModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setFormMode("edit");
    setSelectedCategory(category);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (data: CategoryCreateInput | CategoryUpdateInput) => {
    if (formMode === "create") {
      await createCategoryMutation.mutateAsync(data as CategoryCreateInput);
    } else if (selectedCategory) {
      await updateCategoryMutation.mutateAsync({
        id: selectedCategory.id,
        data: data as CategoryUpdateInput,
      });
    }
    setIsFormModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategoryMutation.mutateAsync(selectedCategory.id);
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Failed to delete category. It may have products or subcategories.");
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Failed to load categories. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add Category Button */}
      <div className="flex justify-end">
        <button
          onClick={handleAddCategory}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Category
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
                placeholder="Search by category name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Status Filter */}
            <div className="min-w-[200px]">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "active" | "inactive" | "")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="">All</option>
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
            Loading categories...
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
                  <TableCell className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </TableCell>
                  <TableCell className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Parent Category
                  </TableCell>
                  <TableCell className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </TableCell>
                  <TableCell className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Created At
                  </TableCell>
                  <TableCell className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                      No categories found
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="px-5 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {category.id}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {category.name}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {category.parent?.name || "-"}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            category.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                        >
                          {category.status}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(category.created_at)}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="px-3 py-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-600 dark:border-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(category)}
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
            Showing {categories.length === 0 ? 0 : (currentPage - 1) * perPage + 1} to{" "}
            {Math.min(currentPage * perPage, totalCount)} of {totalCount} categories
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

      {/* CategoryFormModal */}
      <CategoryFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        category={selectedCategory}
        mode={formMode}
      />

      {/* DeleteConfirmModal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteCategoryMutation.isPending}
        userName={selectedCategory?.name || ""}
      />
    </div>
  );
}
