import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = localFont({
  src: [
    {
      path: "../../public/fonts/PlayfairDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-playfair",
  display: "swap",
  preload: true,
});

const SITE_URL = "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "VIBE | The Next Age of Real Estate",
  description:
    "One CRM for your entire real estate empire. Unified leads, multi-site capture, QuickBooks-synced financials. Stop duct-taping 6 platforms together.",
  keywords:
    "real estate CRM, unified leads, multi-site capture, QuickBooks sync, pipeline management, VIBE",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "VIBE | The Next Age of Real Estate",
    description:
      "One CRM for your entire real estate empire. Unified leads, multi-site capture, QuickBooks-synced financials.",
    type: "website",
    url: SITE_URL,
    siteName: "VIBE",
    images: [
      {
        url: `${SITE_URL}/opengraph-image.jpeg`,
        width: 1200,
        height: 630,
        alt: "VIBE - One CRM for your entire real estate empire",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VIBE | The Next Age of Real Estate",
    description:
      "One CRM for your entire real estate empire. Stop duct-taping 6 platforms together.",
    images: [`${SITE_URL}/opengraph-image.jpeg`],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "VIBE",
  applicationCategory: "BusinessApplication",
  description:
    "Unified CRM for vertically integrated real estate businesses. Leads, pipeline, communications, and QuickBooks-synced financials in one platform.",
  url: SITE_URL,
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "600",
    priceCurrency: "USD",
    description: "First 50 member pricing - Starter plan",
  },
  creator: {
    "@type": "Organization",
    name: "Your Company",
    url: "https://example.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#D4A017" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-[#0A0A0F] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
