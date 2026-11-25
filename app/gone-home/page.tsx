import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { WavyUnderline } from "@/components/WavyUnderline";
import { ChunkyButton } from "@/components/ChunkyButton";
import puppiesData from "@/data/puppies.json";
import { Puppy } from "@/lib/types";
import { Heart, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Gone Home | Happy Rehomed Puppies",
  description:
    "See our adorable teacup puppies that have found their forever homes and loving families across Dubai and the UAE.",
};

export default function GoneHomePage() {
  const puppies = puppiesData as Puppy[];
  const goneHomePuppies = puppies.filter((p) => p.status === "gone-home");

  return (
    <div className="w-full py-10 sm:py-16 md:py-20 bg-[#FFF3D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex flex-col items-center mb-2">
            <span className="font-handwriting text-2xl text-[#9A4F28] font-bold">
              forever palaces
            </span>
            <WavyUnderline className="w-40 mt-0.5" />
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-[#2A1A12] tracking-tight">
            Puppies That Have Gone Home
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[#5A4030]">
            Each of these sweet babies is now happily settled with their new family. Looking for a puppy of your own? We welcome new litters weekly.
          </p>
          <div className="mt-6 flex justify-center">
            <ChunkyButton href="/puppies" variant="primary" size="md">
              View Available Puppies
            </ChunkyButton>
          </div>
        </div>

        {/* Gone Home Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {goneHomePuppies.map((pup) => (
            <div
              key={pup.id}
              className="rounded-3xl border-[2.5px] border-[#2A1A12] bg-[#FFFDF8] overflow-hidden shadow-chunky flex flex-col group hover:-translate-y-1 transition-transform"
            >
              {/* Photo */}
              <div className="relative w-full h-64 overflow-hidden border-b-2 border-[#2A1A12]">
                <Image
                  src={pup.images[0]}
                  alt={`${pup.name} has gone home`}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 bg-[#2A1A12] text-white px-3 py-1 rounded-full font-handwriting text-sm font-bold shadow-sticker flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-[#F28F79] text-[#F28F79]" />
                  <span>Gone Home</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-black text-2xl text-[#2A1A12]">
                    {pup.name}
                  </h3>
                  <p className="text-sm font-semibold text-[#9A4F28] mt-0.5">
                    {pup.breed} ({pup.color})
                  </p>
                  <p className="mt-3 text-sm text-[#5A4030] leading-relaxed">
                    {pup.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#2A1A12]/10 flex items-center justify-between text-xs text-[#2A1A12] font-semibold">
                  <span className="flex items-center gap-1 text-[#3A7D54]">
                    <Sparkles className="w-3.5 h-3.5" />
                    Happily settled in Dubai
                  </span>
                  <span>{pup.ageMonths} mo</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
