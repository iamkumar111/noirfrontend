"use client";

import ProductCard from "@/components/ProductCard";
import { useStore } from "@/store/useStore";

type CategoryCollectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  category: string;
};

export default function CategoryCollection({ eyebrow, title, description, category }: CategoryCollectionProps) {
  const products = useStore((state) => state.products);
  const catalogStatus = useStore((state) => state.catalogStatus);
  const productsInCategory = products.filter((product) => product.category === category);

  return (
    <div className="section-top relative min-h-screen bg-[#050403] px-5 pb-24 md:px-6 md:pb-36">
      <div className="mx-auto max-w-7xl">
        <header className="grid gap-6 border-b border-[rgba(200,164,93,0.2)] pb-10 md:grid-cols-12 md:items-end md:pb-14">
          <div className="md:col-span-7"><p className="eyebrow mb-5 text-[#D9B86C]">{eyebrow}</p><h1 className="font-serif text-5xl leading-none text-[#F1E8D8] md:text-7xl">{title}</h1></div>
          <p className="max-w-xl text-sm leading-relaxed text-[rgba(241,232,216,0.76)] md:col-span-4 md:col-start-9">{description}</p>
        </header>
        {catalogStatus === "loading" && productsInCategory.length === 0 ? <p className="py-16 text-[#D9B86C]">Loading products…</p> : (
          <div className="grid gap-7 py-10 md:grid-cols-2 lg:grid-cols-3">{productsInCategory.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        )}
        {catalogStatus === "ready" && productsInCategory.length === 0 && <p className="py-16 text-[rgba(241,232,216,0.72)]">Products will appear here when this collection is available.</p>}
      </div>
    </div>
  );
}
