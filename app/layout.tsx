import type { Metadata, Viewport } from "next";
import { Fraunces, Figtree, Patrick_Hand } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyContactBar } from "@/components/StickyContactBar";
import { PawCursor } from "@/components/PawCursor";
import { FollowMascot } from "@/components/FollowMascot";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["700", "800", "900"],
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  variable: "--font-patrick-hand",
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://puppynest.ae"),
  title: {
    default: "PuppyNest | Premium Teacup Puppies in Dubai",
    template: "%s | PuppyNest Dubai",
  },
  description: siteConfig.description,
  keywords: [
    "PuppyNest",
    "teacup puppies Dubai",
    "puppies in Dubai",
    "Korean Maltipoo Dubai",
    "Pomeranian Dubai",
    "teacup poodle Dubai",
    "Cavapoo Dubai",
    "Shih Tzu Dubai",
    "ethical puppy boutique Dubai",
  ],
  authors: [{ name: "PuppyNest Dubai" }],
  creator: "PuppyNest",
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: "https://puppynest.ae",
    siteName: "PuppyNest",
    title: "PuppyNest | Premium Teacup Puppies in Dubai",
    description: siteConfig.description,
    images: [
      {
        url: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "PuppyNest - Premium Teacup Puppies in Dubai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PuppyNest | Premium Teacup Puppies in Dubai",
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF3D9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${figtree.variable} ${patrickHand.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FFF3D9] text-[#5A4030] antialiased selection:bg-[#F0B955] selection:text-[#2A1A12]">
        {/* Skip to content accessible landmark */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#2A1A12] focus:text-white focus:rounded-full focus:shadow-lg focus:font-bold"
        >
          Skip to main content
        </a>

        {/* Sticky Header with Thin Top Bar */}
        <Header />

        {/* Main Content Area */}
        <main id="main-content" className="flex-1 w-full">
          {children}
        </main>

        {/* Footer */}
        <Footer />

        {/* Mobile Sticky Action Bar + Desktop Floating WhatsApp Pill */}
        <StickyContactBar />

        {/* Custom Desktop Paw Cursor & Trail */}
        <PawCursor />

        {/* Global Follow-the-Scroll Storytelling Mascot */}
        <FollowMascot />
      </body>
    </html>
  );
}
