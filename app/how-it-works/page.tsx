import React, { Suspense } from "react";
import type { Metadata } from "next";
import { HowItWorksHero } from "@/components/how-it-works/HowItWorksHero";
import { TwoWaysHomeSection } from "@/components/how-it-works/TwoWaysHomeSection";
import { PuppyPromiseSection } from "@/components/how-it-works/PuppyPromiseSection";
import { DeliveryCollectionSection } from "@/components/how-it-works/DeliveryCollectionSection";
import { WhyChooseUsSection } from "@/components/how-it-works/WhyChooseUsSection";
import { HowItWorksCTA } from "@/components/how-it-works/HowItWorksCTA";

export const metadata: Metadata = {
  title: "How It Works | Teacup Puppy Adoption in Dubai | PuppyNest",
  description:
    "Discover how adoption works at PuppyNest Dubai: adopt from our Downtown showroom or order a rare teacup puppy imported from ethical breeders worldwide. 100% health checked, vaccinated, and microchipped.",
  alternates: {
    canonical: "https://puppynest.ae/how-it-works",
  },
  openGraph: {
    title: "How It Works | Teacup Puppy Adoption in Dubai | PuppyNest",
    description:
      "Simple, safe, and transparent puppy adoption in Dubai. Explore our two ways home, health promise, VIP delivery, and lifetime support.",
    url: "https://puppynest.ae/how-it-works",
    siteName: "PuppyNest",
    locale: "en_AE",
    type: "website",
    images: [
      {
        url: "https://puppynest.ae/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PuppyNest - How It Works",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How It Works | PuppyNest Dubai",
    description: "Simple, safe, and transparent teacup puppy adoption in Dubai.",
    images: ["https://puppynest.ae/og-image.jpg"],
  },
};

export default function HowItWorksPage() {
  return (
    <main className="w-full relative min-h-screen bg-gradient-to-b from-[#FFF7E6] via-[#FFF2D6] to-[#F2C985] text-[#2A1A12] overflow-x-clip">
      {/* Faint Argyle Diamond Overlay on the first screen / hero area */}
      <div
        className="absolute top-0 left-0 right-0 h-[850px] pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #2A1A12 0, #2A1A12 1px, transparent 0, transparent 50%),
                            repeating-linear-gradient(-45deg, #2A1A12 0, #2A1A12 1px, transparent 0, transparent 50%)`,
          backgroundSize: "36px 36px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Section 1: Hero with scroll-spy shortcut pills */}
        <HowItWorksHero />

        {/* Section 2: Two ways home (In Dubai / Imported toggle + steps) */}
        <Suspense fallback={<div className="h-96" />}>
          <TwoWaysHomeSection />
        </Suspense>

        {/* Section 3: Puppy passport promise with 3 slamming ink stamps */}
        <PuppyPromiseSection />

        {/* Section 4: Delivery & collection (2x2 grid + flight map animation) */}
        <DeliveryCollectionSection />

        {/* Section 5: Why choose us (sliding feature cards) */}
        <WhyChooseUsSection />

        {/* Section 6: Bottom CTA with tilted-head mascot */}
        <HowItWorksCTA />
      </div>
    </main>
  );
}
