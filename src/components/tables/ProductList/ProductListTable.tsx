import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import type { Product, ProductQueryParams, ProductCreateInput, ProductUpdateInput } from "../../../types/product";
import { useProducts } from "../../../hooks/useProducts";
import { useCreateProduct } from "../../../hooks/useCreateProduct";
import { useUpdateProduct } from "../../../hooks/useUpdateProduct";
import { useDeleteProduct } from "../../../hooks/useDeleteProduct";
import { useCategories } from "../../../hooks/useCategories";
import ProductFormModal from "../../modals/ProductFormModal";
import DeleteConfirmModal from "../../modals/DeleteConfirmModal";

export default function ProductListTable() {
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "created_at">("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  // Query params for API call
  const [queryParams, setQueryParams] = useState<ProductQueryParams>({
    page: 1,
    per_page: 10,
    sort_by: "created_at",
    sort_dir: "desc",
  });

  // React Query hooks
  const { data, isLoading, error } = useProducts(queryParams);
  console.log(data);
  
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  // Fetch categories for filter dropdown
  const { data: categoriesResponse } = useCategories({ per_page: 100, status: "active" });
  const categories = categoriesResponse?.data || [];

  const products = data?.data || [];
  // console.log("products", products);
  
  const totalPages = data?.meta.total_pages || 1;
  const totalCount = data?.meta.total_count || 0;

  const handleSearch = () => {
    setQueryParams({
      ...queryParams,
      page: 1,
      q: searchQuery || undefined,
      category_id: categoryFilter ? parseInt(categoryFilter) : undefined,
      min_price: minPrice ? parseFloat(minPrice) : undefined,
      max_price: maxPrice ? parseFloat(maxPrice) : undefined,
    });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("");
    setMinPrice("");
    setMaxPrice("");
    setQueryParams({
      page: 1,
      per_page: perPage,
      sort_by: sortBy,
      sort_dir: sortDir,
    });
    setCurrentPage(1);
  };

  const handleSort = (column: "name" | "price" | "created_at") => {
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Modal handlers
  const handleAddProduct = () => {
    setFormMode("create");
    setSelectedProduct(null);
    setIsFormModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setFormMode("edit");
    setSelectedProduct(product);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (data: ProductCreateInput | ProductUpdateInput) => {
    if (formMode === "create") {
      await createProductMutation.mutateAsync(data as ProductCreateInput);
    } else if (selectedProduct) {
      await updateProductMutation.mutateAsync({
        id: selectedProduct.id,
        data: data as ProductUpdateInput,
      });
    }
    setIsFormModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;

    try {
      await deleteProductMutation.mutateAsync(selectedProduct.id);
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Please try again.");
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Failed to load products. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add Product Button */}
      <div className="flex justify-end">
        <button
          onClick={handleAddProduct}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Product
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white dark:bg-white/[0.03] p-4 rounded-xl border border-gray-200 dark:border-white/[0.05]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          {/* Left side: Search + Category + Price Range */}
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
                placeholder="Search products..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Category Filter */}
            <div className="min-w-[180px]">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            {/* <div className="min-w-[120px]">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Min Price
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="$0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div> */}

            {/* Max Price */}
            {/* <div className="min-w-[120px]">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Max Price
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="$999"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div> */}
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

            {(searchQuery || categoryFilter || minPrice || maxPrice) && (
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
            Loading products...
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
                    Image
                  </TableCell>
                  <TableCell
                    className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      Name
                      {sortBy === "name" && (
                        <span>{sortDir === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </TableCell>
                  <TableCell
                    className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => handleSort("price")}
                  >
                    <div className="flex items-center gap-1">
                      Price
                      {sortBy === "price" && (
                        <span>{sortDir === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Variants
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
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="px-5 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {product.id}
                      </TableCell>
                      <TableCell className="px-5 py-3">
                        {product.image_thumbnails?.[0] ? (
                          <img
                            src={product.image_thumbnails[0]}
                            alt={product.name}
                            className="h-12 w-12 object-cover rounded"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">No img</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {product.name}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {product.description?.substring(0, 50)}
                        {product.description?.length > 50 ? "..." : ""}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-sm text-gray-900 dark:text-gray-100 font-semibold">
                        {formatPrice(product.price)}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {product.variants && product.variants.length > 0 ? (
                          <div className="space-y-1">
                            {product.variants.slice(0, 2).map((variant, idx) => (
                              <div key={idx} className="text-xs">
                                <span className="font-medium">{variant.size}</span>
                                {variant.color && <span> · {variant.color}</span>}
                                <span className="text-gray-500 dark:text-gray-500"> (Qty: {variant.quantity})</span>
                              </div>
                            ))}
                            {product.variants.length > 2 && (
                              <div className="text-xs text-blue-600 dark:text-blue-400">
                                +{product.variants.length - 2} more
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs italic text-gray-400">No variants</span>
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(product.created_at)}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="px-3 py-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-600 dark:border-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product)}
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
            Showing {products.length === 0 ? 0 : (currentPage - 1) * perPage + 1} to{" "}
            {Math.min(currentPage * perPage, totalCount)} of {totalCount} products
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

      {/* ProductFormModal */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        product={selectedProduct}
        mode={formMode}
      />

      {/* DeleteConfirmModal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteProductMutation.isPending}
        userName={selectedProduct?.name || ""}
      />
    </div>
  );
}
