import { FC, useRef, useState } from "react";
import { activeStorageService } from "../../../services/activeStorageService";
import Avatar from "../../ui/avatar/Avatar";
import { Camera, Upload, X } from "lucide-react";

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  onUploadComplete?: (blobSignedId: string) => void;
  onUploadError?: (error: string) => void;
  size?: "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge";
  className?: string;
  disabled?: boolean;
}

const AvatarUpload: FC<AvatarUploadProps> = ({
  currentAvatarUrl,
  onUploadComplete,
  onUploadError,
  size = "xlarge",
  className = "",
  disabled = false,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentAvatarUrl || null
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
      setPreviewUrl(currentAvatarUrl || null);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveAvatar = () => {
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
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Avatar Preview with Upload Button Overlay */}
      <div className="relative group">
        {previewUrl ? (
          <Avatar src={previewUrl} size={size} alt="User Avatar" />
        ) : (
          <div
            className={`flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 ${
              size === "xlarge"
                ? "h-16 w-16"
                : size === "xxlarge"
                ? "h-20 w-20"
                : size === "large"
                ? "h-12 w-12"
                : size === "medium"
                ? "h-10 w-10"
                : size === "small"
                ? "h-8 w-8"
                : "h-6 w-6"
            }`}
          >
            <Camera className="h-6 w-6 text-gray-400" />
          </div>
        )}

        {/* Upload Progress Overlay */}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
              <p className="mt-1 text-xs text-white">{uploadProgress}%</p>
            </div>
          </div>
        )}

        {/* Hover Overlay - Upload/Change Button */}
        {!uploading && !disabled && (
          <button
            onClick={handleClickUpload}
            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
            type="button"
          >
            <Upload className="h-6 w-6 text-white" />
          </button>
        )}

        {/* Remove Button */}
        {previewUrl && !uploading && !disabled && (
          <button
            onClick={handleRemoveAvatar}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-error-500 text-white shadow-lg transition-transform hover:scale-110"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Upload Instructions */}
      <div className="text-center">
        <button
          type="button"
          onClick={handleClickUpload}
          disabled={disabled || uploading}
          className="text-sm font-medium text-brand-600 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-brand-400"
        >
          {previewUrl ? "Change Avatar" : "Upload Avatar"}
        </button>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          JPG or PNG, max 5MB
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
      />
    </div>
  );
};

export default AvatarUpload;
