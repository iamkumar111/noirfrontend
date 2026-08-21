import type { Metadata } from "next";
import CategoryCollection from "@/components/CategoryCollection";

export const metadata: Metadata = {
  title: "Premium Gift Boxes Online",
  description: "Discover NOIR & OAK gift boxes with chocolate almonds and makhana, presented in elegant matte-black packaging.",
  alternates: { canonical: "/gifts" },
};

export default function GiftsPage() {
  return <CategoryCollection eyebrow="Shop gifts" title="Gift Boxes" description="Elegant chocolate and makhana gift boxes for birthdays, thank-yous and festive occasions." category="Gift Boxes" />;
}
