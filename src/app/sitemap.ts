import type { MetadataRoute } from "next";
import { fallbackProducts } from "@/lib/noir-products/fallback-products";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/collection", "/chocolates", "/gifts", "/gifting", "/our-story", "/contact"];
  return [...staticRoutes.map((path) => ({ url: `${SITE_URL}${path}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 })), ...fallbackProducts.map((product) => ({ url: `${SITE_URL}/product/${product.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 }))];
}
