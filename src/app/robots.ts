import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/cart", "/checkout", "/login", "/profile", "/dashboard", "/wishlist", "/orders", "/admin", "/success", "/vip-access"] }, sitemap: `${SITE_URL}/sitemap.xml` };
}
