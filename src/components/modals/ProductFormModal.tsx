/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import type { Product, ProductCreateInput, ProductUpdateInput } from "../../types/product";
import { useCategories } from "../../hooks/useCategories";
import ImageUpload from "../form/input/ImageUpload";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductCreateInput | ProductUpdateInput) => Promise<void>;
  product?: Product | null;
  mode: "create" | "edit";
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  product,
  mode,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    image_signed_ids: [] as string[],
    variants: [] as { size: string; color: string; sku: string; quantity: string }[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Fetch categories for selection
  const { data: categoriesResponse } = useCategories({ per_page: 100, status: "active" });
  const categories = categoriesResponse?.data || [];

  useEffect(() => {
    if (mode === "edit" && product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category_id: product.category_id.toString(),
        image_signed_ids: [],
        variants: product.variants?.map(v => ({
          size: v.size,
          color: v.color,
          sku: v.sku,
          quantity: v.quantity.toString()
        })) || [],
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        category_id: "",
        image_signed_ids: [],
        variants: [],
      });
    }
    setError(null);
    setUploadError(null);
  }, [product, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError("Product name is required");
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    if (!formData.category_id) {
      setError("Category is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const submitData: ProductCreateInput | ProductUpdateInput = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id),
        ...(formData.image_signed_ids.length > 0 && {
          image_signed_ids: formData.image_signed_ids,
        }),
        ...(formData.variants.length > 0 && {
          variants: formData.variants.map(v => ({
            size: v.size,
            color: v.color,
            sku: v.sku,
            quantity: parseInt(v.quantity) || 0
          }))
        }),
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
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {mode === "create" ? "Add New Product" : "Edit Product"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        {uploadError && (
          <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg text-sm">
            {uploadError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Images */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Product Images
            </label>
            <ImageUpload
              currentImages={product?.images || []}
              onUploadComplete={(blobSignedIds) => {
                setFormData({ ...formData, image_signed_ids: blobSignedIds });
                setUploadError(null);
              }}
              onUploadError={(error) => setUploadError(error)}
              disabled={isSubmitting}
              maxImages={5}
            />
          </div>

          {/* Product Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="Enter product name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white min-h-[100px]"
              placeholder="Enter product description"
            />
          </div>

          {/* Price and Category - Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Price *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="0.00"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Category *
              </label>
              <select
                required
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Variants Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Product Variants
              </label>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    variants: [...formData.variants, { size: "", color: "", sku: "", quantity: "0" }]
                  });
                }}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-600 dark:border-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                + Add Variant
              </button>
            </div>

            {formData.variants.map((variant, index) => (
              <div key={index} className="mb-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Variant {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const newVariants = formData.variants.filter((_, i) => i !== index);
                      setFormData({ ...formData, variants: newVariants });
                    }}
                    className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-xs text-gray-600 dark:text-gray-400">
                      Size
                    </label>
                    <input
                      type="text"
                      value={variant.size}
                      onChange={(e) => {
                        const newVariants = [...formData.variants];
                        newVariants[index].size = e.target.value;
                        setFormData({ ...formData, variants: newVariants });
                      }}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      placeholder="e.g. M, L, XL"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-xs text-gray-600 dark:text-gray-400">
                      Color
                    </label>
                    <input
                      type="text"
                      value={variant.color}
                      onChange={(e) => {
                        const newVariants = [...formData.variants];
                        newVariants[index].color = e.target.value;
                        setFormData({ ...formData, variants: newVariants });
                      }}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      placeholder="e.g. Red, Blue"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-xs text-gray-600 dark:text-gray-400">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) => {
                        const newVariants = [...formData.variants];
                        newVariants[index].sku = e.target.value;
                        setFormData({ ...formData, variants: newVariants });
                      }}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      placeholder="e.g. PROD-M-RED"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-xs text-gray-600 dark:text-gray-400">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={variant.quantity}
                      onChange={(e) => {
                        const newVariants = [...formData.variants];
                        newVariants[index].quantity = e.target.value;
                        setFormData({ ...formData, variants: newVariants });
                      }}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            ))}

            {formData.variants.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No variants added. Click "Add Variant" to create product variants.
              </p>
            )}
          </div>

          {/* Form Actions */}
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
              {isSubmitting ? "Saving..." : mode === "create" ? "Create Product" : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
