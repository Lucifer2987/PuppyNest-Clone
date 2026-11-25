import { Suspense } from "react";
import type { Metadata } from "next";
import { PuppiesClient } from "./PuppiesClient";
import puppiesData from "@/data/puppies.json";
import { Puppy } from "@/lib/types";

export const metadata: Metadata = {
  title: "Available Teacup Puppies",
  description:
    "Explore available teacup Maltipoos, Pomeranians, Poodles, Cavapoos, and Shih Tzus in Dubai. Health certified and ready for their forever families.",
};

export default function PuppiesPage() {
  const puppies = puppiesData as Puppy[];

  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center font-display font-bold text-xl text-[#2A1A12]">
          Loading puppies...
        </div>
      }
    >
      <PuppiesClient puppies={puppies} />
    </Suspense>
  );
}
