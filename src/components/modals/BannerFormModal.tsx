/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import type {
  Banner,
  BannerCreateInput,
  BannerUpdateInput,
} from "../../types/banner";
import BannerUpload from "../form/input/BannerUpload";

interface BannerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BannerCreateInput | BannerUpdateInput) => Promise<void>;
  banner?: Banner | null;
  mode: "create" | "edit";
}

export default function BannerFormModal({
  isOpen,
  onClose,
  onSubmit,
  banner,
  mode,
}: BannerFormModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    link_url: "",
    display_order: 0,
    status: "active" as "active" | "inactive",
    image_signed_id: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && banner) {
      setFormData({
        title: banner.title,
        link_url: banner.link_url || "",
        display_order: banner.display_order,
        status: banner.status,
        image_signed_id: "",
      });
    } else {
      setFormData({
        title: "",
        link_url: "",
        display_order: 0,
        status: "active",
        image_signed_id: "",
      });
    }
    setError(null);
    setUploadError(null);
  }, [banner, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError("Banner title is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const submitData: BannerCreateInput | BannerUpdateInput = {
        title: formData.title.trim(),
        link_url: formData.link_url.trim() || undefined,
        display_order: formData.display_order,
        status: formData.status,
        ...(formData.image_signed_id && {
          image_signed_id: formData.image_signed_id,
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
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {mode === "create" ? "Add New Banner" : "Edit Banner"}
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
          {/* Banner Image */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Banner Image *
            </label>
            <BannerUpload
              currentBannerUrl={banner?.image || undefined}
              onUploadComplete={(blobSignedId) => {
                setFormData({ ...formData, image_signed_id: blobSignedId });
                setUploadError(null);
              }}
              onUploadError={(error) => setUploadError(error)}
              disabled={isSubmitting}
            />
          </div>

          {/* Banner Title */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="Enter banner title"
            />
          </div>

          {/* Link URL */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Link URL (optional)
            </label>
            <input
              type="url"
              value={formData.link_url}
              onChange={(e) =>
                setFormData({ ...formData, link_url: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="https://example.com/product"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Where users will be redirected when clicking the banner
            </p>
          </div>

          {/* Display Order and Status - Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            {/* Display Order */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Display Order
              </label>
              <input
                type="number"
                min="0"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    display_order: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Lower numbers appear first
              </p>
            </div>

            {/* Status */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "active" | "inactive",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
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
              className="flex-1 px-4 py-2 text-white bg-neutral-600 rounded-lg hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Saving..."
                : mode === "create"
                ? "Create Banner"
                : "Update Banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
