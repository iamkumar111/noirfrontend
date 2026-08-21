import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import PageReveal from "@/components/transitions/PageReveal";
import LuxuryRouteTransition from "@/components/transitions/LuxuryRouteTransition";
import IntroGate from "@/components/IntroGate";
import CartDrawer from "@/components/CartDrawer";
import RecentPurchaseNotifications from "@/components/RecentPurchaseNotifications";

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_URL = "https://noiroak.com";
const OG_IMAGE = "/images/hero/noir-oak-final-frame.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Premium Chocolates & Gifts Online | NOIR & OAK",
    template: "%s — NOIR & OAK",
  },
  description:
    "Shop premium chocolate almonds, roasted makhana and gift boxes from NOIR & OAK. Thoughtfully packed for everyday treats and meaningful gifts.",
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
      "Premium chocolate almonds, roasted makhana and gift boxes, thoughtfully packed by NOIR & OAK.",
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
      "Premium chocolate almonds, roasted makhana and gift boxes from NOIR & OAK.",
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
      suppressHydrationWarning
    >
      <body
        className="noise-bg"
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                { "@type": "Organization", name: "NOIR & OAK", url: SITE_URL, logo: `${SITE_URL}/images/logo/noir-oak-tree-mark.png` },
                { "@type": "WebSite", name: "NOIR & OAK", url: SITE_URL },
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
        <Providers>
          <LuxuryRouteTransition>
            <IntroGate>
              <Header />
              <main id="site-content" className="relative z-10">
                <PageReveal>{children}</PageReveal>
              </main>
              <Footer />
              <CartDrawer />
              <RecentPurchaseNotifications />
            </IntroGate>
          </LuxuryRouteTransition>
        </Providers>
      </body>
    </html>
  );
}
