import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import PageReveal from "@/components/transitions/PageReveal";

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
});

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
});

const SITE_URL = "https://noiroak.com";
const OG_IMAGE = "/images/hero/noir-oak-final-frame.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "NOIR & OAK — Premium Dry Fruits & Luxury Gifting",
    template: "%s — NOIR & OAK",
  },
  description:
    "Premium dry fruits, pure couverture coated almonds, gold-sealed makhana tins, and curated gifting boxes by NOIR & OAK. Released in numbered micro-batches for private access.",
  applicationName: "NOIR & OAK",
  keywords: [
    "premium dry fruits",
    "coated almonds",
    "makhana tins",
    "luxury gifting",
    "corporate gifting",
    "NOIR & OAK",
  ],
  authors: [{ name: "NOIR & OAK" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "NOIR & OAK",
    title: "NOIR & OAK — Premium Dry Fruits & Luxury Gifting",
    description:
      "Pure couverture coated almonds, gold-sealed makhana tins, and curated gifting vaults — released in numbered micro-batches for private access.",
    images: [
      {
        url: OG_IMAGE,
        width: 1280,
        height: 720,
        alt: "NOIR & OAK — a matte-black and antique-gold private gifting vault.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NOIR & OAK — Premium Dry Fruits & Luxury Gifting",
    description:
      "Pure couverture coated almonds, gold-sealed makhana tins, and curated gifting vaults by NOIR & OAK.",
    images: [OG_IMAGE],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#030303",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable}`}
      style={{ backgroundColor: '#090806' }}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        className="noise-bg"
        suppressHydrationWarning
      >
        <Providers>
          <Header />
          <main className="relative z-10">
            <PageReveal>{children}</PageReveal>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
