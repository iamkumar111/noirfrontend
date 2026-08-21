import type { MetadataRoute } from "next";
import { fallbackProducts } from "@/lib/noir-products/fallback-products";

const baseUrl = "https://noiroak.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/collection", "/chocolates", "/gifts", "/gifting", "/our-story", "/contact"];
  return [...staticRoutes.map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 })), ...fallbackProducts.map((product) => ({ url: `${baseUrl}/product/${product.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 }))];
}
