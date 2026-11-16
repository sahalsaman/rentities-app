import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Existing ImgBB assets remain viewable while newly uploaded images use Cloudinary.
      { protocol: "https", hostname: "i.ibb.co" },
    ],
  },
};

export default nextConfig;
