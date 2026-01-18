import { FC, useRef, useState } from "react";
import { activeStorageService } from "../../../services/activeStorageService";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  currentImages?: string[];
  onUploadComplete?: (blobSignedIds: string[]) => void;
  onUploadError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
  maxImages?: number;
}

const ImageUpload: FC<ImageUploadProps> = ({
  currentImages = [],
  onUploadComplete,
  onUploadError,
  className = "",
  disabled = false,
  maxImages = 5,
}) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>(currentImages);
  const [blobSignedIds, setBlobSignedIds] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    // Check max images limit
    if (previewUrls.length + files.length > maxImages) {
      onUploadError?.(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Validate all files first
    for (const file of files) {
      const validation = activeStorageService.validateFile(file);
      if (!validation.valid) {
        onUploadError?.(validation.error || "Invalid file");
        return;
      }
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const newPreviews: string[] = [];
      const newBlobIds: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Create preview
        const preview = URL.createObjectURL(file);
        newPreviews.push(preview);
        setPreviewUrls((prev) => [...prev, preview]);
        setUploadProgress(Math.round(((i + 0.5) / files.length) * 100));

        // Upload file and get blob_signed_id
        const blobSignedId = await activeStorageService.uploadFile(file);
        newBlobIds.push(blobSignedId);
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      // Update blob signed IDs
      const allBlobIds = [...blobSignedIds, ...newBlobIds];
      setBlobSignedIds(allBlobIds);

      // Notify parent component
      onUploadComplete?.(allBlobIds);
    } catch (error) {
      console.error("Upload failed:", error);
      onUploadError?.(
        error instanceof Error ? error.message : "Upload failed"
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    const newBlobIds = blobSignedIds.filter((_, i) => i !== index);

    setPreviewUrls(newPreviews);
    setBlobSignedIds(newBlobIds);
    onUploadComplete?.(newBlobIds);
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Image Grid */}
      <div className="grid grid-cols-3 gap-4">
        {previewUrls.map((url, index) => (
          <div key={index} className="relative group aspect-square">
            <img
              src={url}
              alt={`Product ${index + 1}`}
              className="w-full h-full object-cover rounded-lg border border-gray-300 dark:border-gray-600"
            />
            {!uploading && !disabled && (
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-error-500 text-white shadow-lg transition-transform hover:scale-110 opacity-0 group-hover:opacity-100"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}

        {/* Upload Button */}
        {previewUrls.length < maxImages && (
          <button
            type="button"
            onClick={handleClickUpload}
            disabled={disabled || uploading}
            className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-brand-500 dark:hover:border-brand-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent mx-auto"></div>
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  {uploadProgress}%
                </p>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Add Image
                </span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Upload Instructions */}
      <div className="text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {previewUrls.length === 0 && (
            <span className="flex items-center justify-center gap-1">
              <ImageIcon className="h-4 w-4" />
              <span>JPG or PNG, max 5MB per image, up to {maxImages} images</span>
            </span>
          )}
          {previewUrls.length > 0 && (
            <span>
              {previewUrls.length} of {maxImages} images uploaded
            </span>
          )}
        </p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
        multiple
      />
    </div>
  );
};

export default ImageUpload;
