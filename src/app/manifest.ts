import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rentities",
    short_name: "Rentities",
    description: "Smart rental property management",
    start_url: "/",
    display: "standalone",
    background_color: "#1677e8",
    theme_color: "#1677e8",
    icons: [
      { src: "/app%20logo-white.png", sizes: "192x192", type: "image/png" },
      { src: "/app%20logo-white.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
