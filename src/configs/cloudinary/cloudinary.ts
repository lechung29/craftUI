/** @format */

export interface CloudinaryUploadResponse {
    url: string;
    publicId: string;
    fileName: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
    createdAt: string;
    tags?: string[];
    folder?: string;
}

export interface OptimizationOptions {
    width?: number | "auto";
    height?: number | "auto";
    crop?: "fill" | "fit" | "scale" | "crop" | "thumb" | "auto";
    quality?: number | "auto";
    format?: "auto" | "jpg" | "png" | "webp" | "gif";
    gravity?: "center" | "north" | "south" | "east" | "west" | "auto" | "face";
}

export interface ResponsiveImageUrls {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
    original: string;
}

export interface UploadProgressCallback {
    (progress: number): void;
}

const getEnvVar = (name: string): string | undefined => {
    if (typeof import.meta !== "undefined" && import.meta.env) {
        return import.meta.env[name];
    }

    if (typeof window !== "undefined" && (window as any).__ENV__) {
        return (window as any).__ENV__[name];
    }

    return undefined;
};

const getCloudinaryConfig = () => {
    const cloudName = getEnvVar("VITE_CLOUDINARY_CLOUD_NAME");
    const uploadPreset = getEnvVar("VITE_CLOUDINARY_UPLOAD_PRESET");
    return { cloudName, uploadPreset };
};

const validateFileType = (file: File): boolean => {
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/bmp",
        "image/tiff",
        "video/mp4",
        "video/webm",
        "video/ogg",
        "video/avi",
        "video/mov",
        "video/wmv",
        "video/flv",
        "video/mkv",
    ];
    return allowedTypes.includes(file.type);
};

const validateFileSize = (file: File, maxSizeMB?: number): boolean => {
    const defaultMaxSize = file.type.startsWith("video/") ? 100 : 10;
    const maxSize = (maxSizeMB || defaultMaxSize) * 1024 * 1024;
    return file.size <= maxSize;
};

export const uploadToCloudinary = async (file: File, folder: string = "uploads"): Promise<CloudinaryUploadResponse> => {
    if (!file) {
        throw new Error("No file provided");
    }

    if (!validateFileType(file)) {
        throw new Error("Invalid file type. Please upload an image or video file (JPG, PNG, GIF, WebP, MP4, WebM, etc.).");
    }

    if (!validateFileSize(file)) {
        const maxSize = file.type.startsWith("video/") ? "100MB" : "10MB";
        throw new Error(`File size too large. Maximum size is ${maxSize}.`);
    }

    const { cloudName, uploadPreset } = getCloudinaryConfig();

    if (!cloudName || !uploadPreset) {
        throw new Error("Missing Cloudinary configuration. Please check your environment variables.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);
    formData.append("tags", "frontend_upload,typescript_app");

    const uploadUrl = file.type.startsWith("video/") ? `https://api.cloudinary.com/v1_1/${cloudName}/video/upload` : `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    try {
        const response = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `Upload failed with status: ${response.status}`);
        }

        const data = await response.json();

        return {
            url: data.secure_url,
            publicId: data.public_id,
            fileName: data.original_filename || "untitled",
            format: data.format,
            width: data.width || 0,
            height: data.height || 0,
            bytes: data.bytes,
            createdAt: data.created_at,
            tags: data.tags || [],
            folder: data.folder,
        };
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        if (error instanceof Error) {
            throw new Error(`Upload failed: ${error.message}`);
        }
        throw new Error("Upload failed: Unknown error occurred");
    }
};

export const uploadMultipleToCloudinary = async (files: FileList | File[], folder: string = "uploads"): Promise<CloudinaryUploadResponse[]> => {
    if (!files || files.length === 0) {
        throw new Error("No files provided");
    }

    const fileArray = Array.from(files);
    const uploadPromises = fileArray.map((file) => uploadToCloudinary(file, folder));

    try {
        const results = await Promise.all(uploadPromises);
        return results;
    } catch (error) {
        console.error("Error uploading multiple files:", error);
        throw error;
    }
};

export const getOptimizedImageUrl = (publicId: string, options: OptimizationOptions = {}): string => {
    const { width = "auto", height = "auto", crop = "fill", quality = "auto", format = "auto", gravity = "center" } = options;

    const { cloudName } = getCloudinaryConfig();

    if (!cloudName) {
        throw new Error("Missing Cloudinary cloud name in environment variables");
    }

    const transformations: string[] = [];

    if (width !== "auto" || height !== "auto") {
        transformations.push(`w_${width},h_${height}`);
    }

    if (crop !== "fill") {
        transformations.push(`c_${crop}`);
    }

    if (gravity !== "center") {
        transformations.push(`g_${gravity}`);
    }

    transformations.push(`q_${quality}`, `f_${format}`);

    const transformationString = transformations.join(",");

    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}/${publicId}`;
};

export const getThumbnailUrl = (publicId: string, size: number = 200): string => {
    return getOptimizedImageUrl(publicId, {
        width: size,
        height: size,
        crop: "fill",
        quality: "auto",
        format: "auto",
    });
};

export const getResponsiveImageUrls = (publicId: string): ResponsiveImageUrls => {
    const { cloudName } = getCloudinaryConfig();

    if (!cloudName) {
        throw new Error("Missing Cloudinary cloud name in environment variables");
    }

    return {
        small: `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_300,c_fill,q_auto,f_auto/${publicId}`,
        medium: `https://res.cloudinary.com/${cloudName}/image/upload/w_800,h_600,c_fill,q_auto,f_auto/${publicId}`,
        large: `https://res.cloudinary.com/${cloudName}/image/upload/w_1200,h_900,c_fill,q_auto,f_auto/${publicId}`,
        xlarge: `https://res.cloudinary.com/${cloudName}/image/upload/w_1600,h_1200,c_fill,q_auto,f_auto/${publicId}`,
        original: `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`,
    };
};

export const uploadWithProgress = async (file: File, folder: string = "uploads", onProgress?: UploadProgressCallback): Promise<CloudinaryUploadResponse> => {
    if (!file) {
        throw new Error("No file provided");
    }

    if (!validateFileType(file)) {
        throw new Error("Invalid file type. Please upload an image or video file.");
    }

    if (!validateFileSize(file)) {
        const maxSize = file.type.startsWith("video/") ? "100MB" : "10MB";
        throw new Error(`File size too large. Maximum size is ${maxSize}.`);
    }

    const { cloudName, uploadPreset } = getCloudinaryConfig();

    if (!cloudName || !uploadPreset) {
        throw new Error("Missing Cloudinary configuration");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);

    const uploadUrl = file.type.startsWith("video/") ? `https://api.cloudinary.com/v1_1/${cloudName}/video/upload` : `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    return new Promise<CloudinaryUploadResponse>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event: ProgressEvent) => {
            if (event.lengthComputable && onProgress) {
                const percentComplete = (event.loaded / event.total) * 100;
                onProgress(Math.round(percentComplete));
            }
        });

        xhr.addEventListener("load", () => {
            if (xhr.status === 200) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    resolve({
                        url: data.secure_url,
                        publicId: data.public_id,
                        fileName: data.original_filename || "untitled",
                        format: data.format,
                        width: data.width || 0,
                        height: data.height || 0,
                        bytes: data.bytes,
                        createdAt: data.created_at,
                        tags: data.tags || [],
                        folder: data.folder,
                    });
                } catch (error) {
                    reject(new Error("Invalid response format"));
                }
            } else {
                reject(new Error(`Upload failed with status: ${xhr.status}`));
            }
        });

        xhr.addEventListener("error", () => {
            reject(new Error("Upload failed due to network error"));
        });

        xhr.addEventListener("timeout", () => {
            reject(new Error("Upload timed out"));
        });

        xhr.timeout = 120000;
        xhr.open("POST", uploadUrl);
        xhr.send(formData);
    });
};

export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const formatDate = (dateString: string, locale: string = "vi-VN"): string => {
    return new Date(dateString).toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const validateCloudinaryConfig = (): boolean => {
    const { cloudName, uploadPreset } = getCloudinaryConfig();

    if (!cloudName || !uploadPreset) {
        return false;
    }

    return true;
};
