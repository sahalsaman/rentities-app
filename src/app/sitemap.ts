import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // Authenticated workspaces are not public, searchable pages.
  return [];
}
