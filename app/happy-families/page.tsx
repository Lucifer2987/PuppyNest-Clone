import React from "react";
import type { Metadata } from "next";
import familiesData from "@/data/families.json";
import { HappyFamiliesHero } from "@/components/happy-families/HappyFamiliesHero";
import { PolaroidWall } from "@/components/happy-families/PolaroidWall";
import { HappyFamiliesCTA } from "@/components/happy-families/HappyFamiliesCTA";
import { FamilyItem } from "@/components/happy-families/PolaroidCard";

export const metadata: Metadata = {
  title: "Happy Families & Reviews | PuppyNest Dubai",
  description:
    "Nothing makes us happier than seeing our teacup and miniature puppies in loving homes! Explore over 60+ real moments shared by our happy families in Dubai and the UAE.",
  alternates: {
    canonical: "https://puppynest.ae/happy-families",
  },
  openGraph: {
    title: "Happy Families & Wall of Moments | PuppyNest Dubai",
    description:
      "Heartwarming stories, photos, and reviews from real families who adopted their dream teacup puppy from PuppyNest in Dubai.",
    url: "https://puppynest.ae/happy-families",
    siteName: "PuppyNest Dubai",
    locale: "en_AE",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PuppyNest Happy Families Wall",
      },
    ],
  },
};

export default function HappyFamiliesPage() {
  const families = familiesData as FamilyItem[];

  return (
    <div className="w-full min-h-screen bg-[#FFF9EE] py-8 sm:py-12 md:py-16 selection:bg-[#F0B955] selection:text-[#2A1A12]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Hero Section: Eyebrow, Title with Heartbeat, Description & Rotating Paper Note */}
        <HappyFamiliesHero totalCount={families.length} />

        {/* 2. Hand-Placed Polaroid Wall (4-Column Masonry with Offset Columns, Load More & Lightbox) */}
        <PolaroidWall items={families} />

        {/* 3. Bottom CTA Card with Mascot & Direct Action Buttons */}
        <HappyFamiliesCTA />
      </div>
    </div>
  );
}
