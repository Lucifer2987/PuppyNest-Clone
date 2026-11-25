import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import puppiesData from "@/data/puppies.json";
import { Puppy } from "@/lib/types";
import { PuppyDetailContent } from "@/components/puppy-detail/PuppyDetailContent";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const puppies = puppiesData as Puppy[];
  return puppies.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const puppies = puppiesData as Puppy[];
  const puppy = puppies.find((p) => p.slug === params.slug);

  if (!puppy) {
    return {
      title: "Puppy Not Found | PuppyNest",
      description: "Discover verified teacup and miniature puppies in Dubai at PuppyNest.",
    };
  }

  const title = `${puppy.name}, ${puppy.breed} puppy in Dubai | PuppyNest`;
  const description =
    puppy.description ||
    `Meet ${puppy.name}, a healthy and vetted ${puppy.breed} (${puppy.gender}, ${puppy.ageMonths} months) at PuppyNest Dubai showroom. Worldwide VIP nanny delivery available.`;
  const ogImage = puppy.images && puppy.images.length > 0 ? puppy.images[0] : "/images/og-image.jpg";

  return {
    title,
    description,
    alternates: {
      canonical: `https://puppynest.ae/puppies/${puppy.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://puppynest.ae/puppies/${puppy.slug}`,
      siteName: "PuppyNest Dubai",
      locale: "en_AE",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 800,
          height: 800,
          alt: `${puppy.name} - ${puppy.breed} puppy in Dubai`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function PuppyDetailPage({ params }: PageProps) {
  const puppies = puppiesData as Puppy[];
  const puppy = puppies.find((p) => p.slug === params.slug);

  if (!puppy) {
    notFound();
  }

  // Calculate previous and next puppy (wrapping around array order)
  const currentIndex = puppies.findIndex((p) => p.slug === puppy.slug);
  const totalPuppies = puppies.length;
  const prevPuppy = puppies[(currentIndex - 1 + totalPuppies) % totalPuppies];
  const nextPuppy = puppies[(currentIndex + 1) % totalPuppies];

  // Structured Data (JSON-LD Product/Pet schema without fake price)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${puppy.name} - ${puppy.breed}`,
    image: puppy.images,
    description: puppy.description,
    sku: puppy.id,
    brand: {
      "@type": "Brand",
      name: "PuppyNest",
    },
    offers: {
      "@type": "Offer",
      url: `https://puppynest.ae/puppies/${puppy.slug}`,
      priceCurrency: "AED",
      price: puppy.priceAed,
      itemCondition: "https://schema.org/NewCondition",
      availability:
        puppy.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
      seller: {
        "@type": "Organization",
        name: "PuppyNest Dubai Boutique",
      },
    },
  };

  return (
    <>
      {/* Inject JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PuppyDetailContent
        puppy={puppy}
        prevPuppy={prevPuppy}
        nextPuppy={nextPuppy}
      />
    </>
  );
}
