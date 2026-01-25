import { FC, useRef, useState, useEffect } from "react";
import { activeStorageService } from "../../../services/activeStorageService";
import { Upload, X } from "lucide-react";

export interface ExistingImage {
  id: number;   // ActiveStorage attachment id
  url: string;
}

interface ImageUploadProps {
  existingImages?: ExistingImage[];
  onChange: (data: {
    keepAttachmentIds: number[];
    newSignedIds: string[];
  }) => void;
  maxImages?: number;
}

const ImageUpload: FC<ImageUploadProps> = ({
  existingImages = [],
  onChange,
  maxImages = 5
}) => {
  const [oldImages, setOldImages] = useState<ExistingImage[]>([]);
  const [newImages, setNewImages] = useState<{ url: string; signedId: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing images when edit product
  useEffect(() => {
    setOldImages(existingImages);
  }, [existingImages]);

  // ===== Helper emit to parent =====
  const emitChange = (
    oldImgs: ExistingImage[],
    newImgs: { url: string; signedId: string }[]
  ) => {
    onChange({
      keepAttachmentIds: oldImgs.map(img => img.id),
      newSignedIds: newImgs.map(img => img.signedId)
    });
  };

  // ===== Upload new files =====
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (oldImages.length + newImages.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    for (const file of files) {
      // Upload to ActiveStorage
      const signedId = await activeStorageService.uploadFile(file);
      const previewUrl = URL.createObjectURL(file);

      setNewImages(prev => {
        const updated = [...prev, { url: previewUrl, signedId }];
        emitChange(oldImages, updated);
        return updated;
      });
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ===== Remove old image =====
  const removeOld = (index: number) => {
    const updated = oldImages.filter((_, i) => i !== index);
    setOldImages(updated);
    emitChange(updated, newImages);
  };

  // ===== Remove new image =====
  const removeNew = (index: number) => {
    const updated = newImages.filter((_, i) => i !== index);
    setNewImages(updated);
    emitChange(oldImages, updated);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {/* Existing images from server */}
        {oldImages.map((img, idx) => (
          <div key={`old-${img.id}`} className="relative">
            <img src={img.url} className="rounded object-cover aspect-square" />
            <button
              type="button"
              onClick={() => removeOld(idx)}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {/* Newly uploaded images */}
        {newImages.map((img, idx) => (
          <div key={`new-${idx}`} className="relative">
            <img src={img.url} className="rounded object-cover aspect-square" />
            <button
              type="button"
              onClick={() => removeNew(idx)}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {/* Upload button */}
        {oldImages.length + newImages.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed rounded flex items-center justify-center aspect-square text-gray-400"
          >
            <Upload />
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        hidden
        multiple
        accept="image/*"
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default ImageUpload;
