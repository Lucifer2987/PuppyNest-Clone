import React from "react";
import type { Metadata } from "next";
import faqsData from "@/data/faq.json";
import { FAQClient } from "@/components/faq/FAQClient";

export const metadata: Metadata = {
  title: "Questions & Answers | PuppyNest Dubai",
  description:
    "Find answers to frequently asked questions about adopting teacup puppies in Dubai: veterinary health checks, vaccinations, showroom visits, VIP travel, delivery, and post-adoption care.",
  alternates: {
    canonical: "https://puppynest.ae/faq",
  },
  openGraph: {
    title: "Questions & Answers | PuppyNest Dubai",
    description:
      "All your questions answered: puppy vaccination, health guarantees, Downtown Dubai showroom visits, and worldwide VIP nanny delivery.",
    url: "https://puppynest.ae/faq",
    siteName: "PuppyNest",
    locale: "en_AE",
    type: "website",
    images: [
      {
        url: "https://puppynest.ae/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PuppyNest Questions & Answers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Questions & Answers | PuppyNest Dubai",
    description: "All your questions answered about teacup puppies in Dubai.",
    images: ["https://puppynest.ae/og-image.jpg"],
  },
};

export default function FAQPage() {
  // Construct Schema.org FAQPage JSON-LD
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqsData.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="w-full relative min-h-screen bg-gradient-to-b from-[#A9582B] via-[#633318] to-[#2B1810] text-[#FFF3D9] overflow-x-clip">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-20 sm:pb-28">
        <FAQClient initialFaqs={faqsData} />
      </div>

      {/* Soft Wavy Bottom Edge Transition into Dark Night Footer */}
      <div className="w-full overflow-hidden leading-none -mb-[1px]">
        <svg
          className="relative block w-full h-8 sm:h-12 md:h-16 text-[#22120A]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,50 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </main>
  );
}
