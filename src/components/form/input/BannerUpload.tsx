import { FC, useRef, useState } from "react";
import { activeStorageService } from "../../../services/activeStorageService";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface BannerUploadProps {
  currentBannerUrl?: string | null;
  onUploadComplete?: (blobSignedId: string) => void;
  onUploadError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
}

const BannerUpload: FC<BannerUploadProps> = ({
  currentBannerUrl,
  onUploadComplete,
  onUploadError,
  className = "",
  disabled = false,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentBannerUrl || null
  );
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = activeStorageService.validateFile(file);
    if (!validation.valid) {
      onUploadError?.(validation.error || "Invalid file");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Create preview
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      setUploadProgress(30);

      // Upload file and get blob_signed_id
      const blobSignedId = await activeStorageService.uploadFile(file);
      setUploadProgress(100);

      // Notify parent component
      onUploadComplete?.(blobSignedId);
    } catch (error) {
      console.error("Upload failed:", error);
      onUploadError?.(
        error instanceof Error ? error.message : "Upload failed"
      );
      // Reset preview on error
      setPreviewUrl(currentBannerUrl || null);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveBanner = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onUploadComplete?.("");
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Banner Preview */}
      <div className="relative group aspect-[16/9] w-full max-w-2xl mx-auto border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Banner preview"
              className="w-full h-full object-cover"
            />
            {/* Upload Progress Overlay */}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent mx-auto"></div>
                  <p className="mt-2 text-sm text-white">{uploadProgress}%</p>
                </div>
              </div>
            )}

            {/* Hover Overlay - Change Button */}
            {!uploading && !disabled && (
              <button
                onClick={handleClickUpload}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                type="button"
              >
                <Upload className="h-8 w-8 text-white" />
              </button>
            )}

            {/* Remove Button */}
            {!uploading && !disabled && (
              <button
                onClick={handleRemoveBanner}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-error-500 text-white shadow-lg transition-transform hover:scale-110"
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={handleClickUpload}
            disabled={disabled || uploading}
            className="w-full h-full flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ImageIcon className="h-12 w-12 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Click to upload banner image
            </span>
            <span className="text-xs text-gray-400">
              Recommended: 1920x1080px, JPG or PNG, max 5MB
            </span>
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default BannerUpload;
