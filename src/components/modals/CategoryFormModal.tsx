/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import type { Category, CategoryCreateInput, CategoryUpdateInput } from "../../types/category";
import { useCategories } from "../../hooks/useCategories";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryCreateInput | CategoryUpdateInput) => Promise<void>;
  category?: Category | null;
  mode: "create" | "edit";
}

export default function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  category,
  mode,
}: CategoryFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    parent_id: null as number | null,
    status: "active" as "active" | "inactive",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories for parent selection
  const { data: categoriesResponse } = useCategories({ per_page: 100 });
  const categories = categoriesResponse?.data || [];

  // Filter out current category and its descendants to prevent circular reference
  const availableParentCategories = categories.filter(
    (cat) => mode === "edit" && category ? cat.id !== category.id : true
  );

  useEffect(() => {
    if (mode === "edit" && category) {
      setFormData({
        name: category.name,
        parent_id: category.parent_id,
        status: category.status,
      });
    } else {
      setFormData({
        name: "",
        parent_id: null,
        status: "active",
      });
    }
    setError(null);
  }, [category, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const submitData: CategoryCreateInput | CategoryUpdateInput = {
        name: formData.name.trim(),
        parent_id: formData.parent_id,
        status: formData.status,
      };

      await onSubmit(submitData);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {mode === "create" ? "Add New Category" : "Edit Category"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="Enter category name"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Parent Category
            </label>
            <select
              value={formData.parent_id || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  parent_id: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="">None (Top Level)</option>
              {availableParentCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Status *
            </label>
            <select
              required
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as "active" | "inactive" })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : mode === "create" ? "Create Category" : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
