import type { Metadata } from "next";
import CategoryCollection from "@/components/CategoryCollection";

export const metadata: Metadata = {
  title: "Premium Chocolate Almonds Online",
  description: "Shop NOIR & OAK chocolate almonds, made with roasted almonds and rich dark or milk chocolate in gift-ready packs.",
  alternates: { canonical: "/chocolates" },
};

export default function ChocolatesPage() {
  return <CategoryCollection eyebrow="Shop chocolates" title="Chocolate Almonds" description="Roasted almonds coated in dark or milk chocolate, packed for treating yourself or sending a thoughtful gift." category="Coated Almonds" />;
}
