/**
 * Cloudinary Upload Utility
 * Uploads images to Cloudinary and returns the secure URL.
 * Uses unsigned upload with the configured preset.
 */

const CLOUD_NAME = 'dth0on4sc';
const UPLOAD_PRESET = 'ozitech1';
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

/**
 * Upload a single image file to Cloudinary.
 * Returns the secure URL string on success.
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('cloud_name', CLOUD_NAME);

  const response = await fetch(UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Image upload failed (${response.status})`);
  }

  const data = await response.json();
  const url = data.secure_url || data.url;

  if (!url) {
    throw new Error('No URL returned from Cloudinary');
  }

  return url;
}

/**
 * Upload multiple image files to Cloudinary in parallel.
 * Returns an array of secure URL strings.
 */
export async function uploadMultipleToCloudinary(files: File[]): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadToCloudinary(file));
  return Promise.all(uploadPromises);
}
