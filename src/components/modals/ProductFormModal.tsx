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
    variants: [] as { size: string; color: string; sku: string; quantity: string }[],

    // image handling
    keepAttachmentIds: [] as number[],
    newImageSignedIds: [] as string[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: categoriesResponse } = useCategories({ per_page: 100, status: "active" });
  const categories = categoriesResponse?.data || [];

  // ===== Load product when edit =====
  useEffect(() => {
    if (mode === "edit" && product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category_id: product.category_id.toString(),
        variants: product.variants?.map(v => ({
          size: v.size,
          color: v.color,
          sku: v.sku,
          quantity: v.quantity.toString()
        })) || [],

        // old images initially all kept
        keepAttachmentIds: product.images?.map(img => img.id) || [],
        newImageSignedIds: [],
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        category_id: "",
        variants: [],
        keepAttachmentIds: [],
        newImageSignedIds: [],
      });
    }
    setError(null);
  }, [product, mode, isOpen]);

  // ===== Submit =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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

        // ===== Image payload đúng backend =====
        image_attachment_ids: formData.keepAttachmentIds,
        new_image_signed_ids: formData.newImageSignedIds,

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
      setError(err?.response?.data?.errors?.[0] || "An error occurred");
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
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ===== Images ===== */}
          <div className="border-b pb-4">
            <label className="block mb-2 text-sm font-medium">
              Product Images
            </label>

            <ImageUpload
              existingImages={product?.images || []}
              onChange={(data) => {
                setFormData(prev => ({
                  ...prev,
                  keepAttachmentIds: data.keepAttachmentIds,
                  newImageSignedIds: data.newSignedIds
                }));
              }}
              maxImages={5}
            />
          </div>

          {/* ===== Name ===== */}
          <div>
            <label className="block mb-1 text-sm font-medium">Product Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* ===== Description ===== */}
          <div>
            <label className="block mb-1 text-sm font-medium">Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border rounded min-h-[100px]"
            />
          </div>

          {/* ===== Price + Category ===== */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Price *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Category *</label>
              <select
                required
                value={formData.category_id}
                onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Select category</option>
                {categories.map((c:any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ===== Variants (giữ nguyên logic cũ của bạn) ===== */}
          {/* ... phần variants bạn có thể giữ lại y hệt ... */}

          {/* ===== Actions ===== */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded"
            >
              {isSubmitting ? "Saving..." : mode === "create" ? "Create" : "Update"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
