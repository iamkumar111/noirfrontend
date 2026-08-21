import type { Metadata } from "next";
import { getProductByHandle } from "@/lib/medusa/products";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductByHandle(slug);
  if (!product) return { title: "Product not found", robots: { index: false, follow: false } };
  const title = `${product.name} ${product.weight} | NOIR & OAK`;
  const description = product.shortDescription;
  return {
    title,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: { type: "website", title, description, url: `/product/${product.slug}`, images: [{ url: product.images[0], alt: `${product.name} ${product.weight}` }] },
    twitter: { card: "summary_large_image", title, description, images: [product.images[0]] },
  };
}

export default async function ProductLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductByHandle(slug);
  if (!product) return children;
  const numericPrice = Number((product.price || "").replace(/[^\d.]/g, ""));
  const schema = [
    {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((image) => `${SITE_URL}${image}`),
    description: product.shortDescription,
    sku: product.batchCode,
    brand: { "@type": "Brand", name: "NOIR & OAK" },
    url: `${SITE_URL}/product/${product.slug}`,
    offers: Number.isFinite(numericPrice) && numericPrice > 0 ? { "@type": "Offer", price: numericPrice, priceCurrency: "INR", availability: product.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: `${SITE_URL}/product/${product.slug}` } : undefined,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/collection` },
        { "@type": "ListItem", position: 3, name: product.category, item: `${SITE_URL}/${product.category === "Gift Boxes" ? "gifts" : "chocolates"}` },
        { "@type": "ListItem", position: 4, name: product.name, item: `${SITE_URL}/product/${product.slug}` },
      ],
    },
  ];
  return <>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /></>;
}
