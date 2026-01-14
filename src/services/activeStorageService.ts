import AxiosClient from "../constants/axiosClient";
import SparkMD5 from "spark-md5";

interface DirectUploadResponse {
  direct_upload: {
    url: string;
    headers: Record<string, string>;
  };
  blob_signed_id: string;
}

interface BlobParams {
  filename: string;
  byte_size: number;
  checksum: string;
  content_type: string;
}

/**
 * Calculate MD5 checksum for file
 * Used for Active Storage direct upload
 */
export const calculateChecksum = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const spark = new SparkMD5.ArrayBuffer();

    reader.onload = (e) => {
      if (e.target?.result) {
        spark.append(e.target.result as ArrayBuffer);
        const hexHash = spark.end(false); // Get hex string
        console.log("MD5 hex hash:", hexHash);

        // Convert hex to binary then to base64
        const checksum = btoa(
          hexHash
            .match(/\w{2}/g)!
            .map((byte) => String.fromCharCode(parseInt(byte, 16)))
            .join("")
        );
        console.log("Base64 checksum:", checksum);
        resolve(checksum);
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Active Storage API Service
 * Handles direct uploads to S3 via Rails Active Storage
 */
export const activeStorageService = {
  /**
   * Step 1: Request presigned URL from Rails backend ( quyền upload trực tiếp lên S3 từ BackEnd)
   */
  requestDirectUpload: async (
    blobParams: BlobParams
  ): Promise<DirectUploadResponse> => {
    console.log("Requesting direct upload with params:", blobParams);
    const response = await AxiosClient.post<DirectUploadResponse>("/direct_uploads", {
      blob: blobParams,
    });
    console.log("Direct upload response:", response);
    return response;
  },

  /**
   * Step 2: Upload file directly to S3
   */
  uploadToS3: async (
    file: File,
    url: string,
    headers: Record<string, string>
  ): Promise<void> => {
    console.log("Uploading to S3:", { url, headers, fileSize: file.size });

    // Remove any undefined or null headers and add Content-Length
    const cleanHeaders: Record<string, string> = {
      ...headers,
      'Content-Length': String(file.size),
    };

    // Remove undefined/null values
    Object.entries(cleanHeaders).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        delete cleanHeaders[key];
      }
    });

    console.log("Clean headers for S3:", cleanHeaders);

    const response = await fetch(url, {
      method: "PUT",
      headers: cleanHeaders,
      body: file,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("S3 upload error:", {
        status: response.status,
        statusText: response.statusText,
        errorText,
      });
      throw new Error(`S3 upload failed: ${response.statusText}`);
    }
  },

  /**
   * Complete flow: Calculate checksum, get presigned URL, upload to S3
   * Returns blob_signed_id to attach to model
   */
  uploadFile: async (file: File): Promise<string> => {
    // Step 1: Calculate checksum
    const checksum = await calculateChecksum(file);

    // Step 2: Request direct upload URL
    const blobParams: BlobParams = {
      filename: file.name,
      byte_size: file.size,
      checksum: checksum,
      content_type: file.type,
    };

    const uploadData = await activeStorageService.requestDirectUpload(
      blobParams
    );

    // Step 3: Upload to S3
    await activeStorageService.uploadToS3(
      file,
      uploadData.direct_upload.url,
      uploadData.direct_upload.headers
    );

    // Step 4: Return blob_signed_id for attaching to model
    return uploadData.blob_signed_id;
  },

  /**
   * Validate file before upload
   */
  validateFile: (
    file: File,
    options: {
      maxSize?: number; // in bytes
      allowedTypes?: string[];
    } = {}
  ): { valid: boolean; error?: string } => {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ["image/jpeg", "image/png"],
    } = options;

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size must be less than ${maxSize / 1024 / 1024}MB`,
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type must be one of: ${allowedTypes.join(", ")}`,
      };
    }

    return { valid: true };
  },
};
