import axios from "axios";
import crypto from "crypto";
import { env } from "../../environment";

export async function uploadToCloudinary(base64Image: string, folder = "rentities") {
  try {
    if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
      throw new Error("Cloudinary credentials are not configured.");
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = crypto
      .createHash("sha1")
      .update(`folder=${folder}&timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`)
      .digest("hex");

    const formData = new FormData();
    formData.append("file", base64Image);
    formData.append("api_key", env.CLOUDINARY_API_KEY);
    formData.append("timestamp", String(timestamp));
    formData.append("folder", folder);
    formData.append("signature", signature);
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
    );

    return {
      id: response.data.public_id,
      url: response.data.secure_url,
      delete_url: response.data.public_id,
    };
  } catch (error: any) {
    console.error("Cloudinary upload error:", error.response?.data || error.message);
    return null;
  }
}

export async function deleteFromCloudinary(publicId?: string) {
  try {
    if (!publicId || !env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) return false;
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = crypto
      .createHash("sha1")
      .update(`public_id=${publicId}&timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`)
      .digest("hex");

    const body = new URLSearchParams({ public_id: publicId, timestamp: String(timestamp), api_key: env.CLOUDINARY_API_KEY, signature });
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/destroy`,
      body,
    );

    return res.data.result === "ok" || res.data.result === "not found";
  } catch (error: any) {
    console.error("Cloudinary deletion error:", error.response?.data || error.message);
    return false;
  }
}

export async function updateCloudinaryImage(oldPublicId: string, base64Image: string, folder?: string) {
  const res = await uploadToCloudinary(base64Image, folder);
  if (res?.url) {
    await deleteFromCloudinary(oldPublicId);
  }
  return res;
}
