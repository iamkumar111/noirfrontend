import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/cart", "/checkout", "/login", "/profile", "/dashboard", "/wishlist", "/orders", "/admin", "/success", "/vip-access"] }, sitemap: "https://noiroak.com/sitemap.xml" };
}
