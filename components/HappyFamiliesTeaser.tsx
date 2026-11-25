import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChunkyButton } from "@/components/ChunkyButton";
import { WavyUnderline } from "@/components/WavyUnderline";
import testimonialsData from "@/data/testimonials.json";

export function HappyFamiliesTeaser() {
  const featured = testimonialsData[0];
  const polaroids = testimonialsData.slice(1, 5);

  const rotations = ["-rotate-2", "rotate-3", "-rotate-1", "rotate-2"];

  return (
    <section className="relative w-full py-16 sm:py-20 md:py-24 bg-[#FFF8EA] border-y-2 border-[#2A1A12]/10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex flex-col items-center mb-2">
            <span className="font-handwriting text-2xl text-[#9A4F28] font-bold">
              heartwarming moments
            </span>
            <WavyUnderline className="w-40 mt-0.5" />
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-[#2A1A12] tracking-tight">
            Happy families and puppies
          </h2>
          <p className="mt-3 text-base text-[#5A4030]">
            Nothing brings us greater joy than seeing our little babies flourish in their new loving palaces.
          </p>
        </div>

        {/* Featured Testimonial Quote */}
        <div className="rounded-3xl border-[3px] border-[#2A1A12] bg-[#FFFDF8] p-6 sm:p-10 shadow-chunky max-w-4xl mx-auto mb-14 relative">
          <div className="font-display text-5xl sm:text-6xl text-[#F0B955] leading-none select-none absolute top-4 left-6">
            “
          </div>
          <p className="font-display text-lg sm:text-2xl text-[#2A1A12] font-extrabold italic leading-relaxed pt-6 sm:pt-4">
            {featured.quote}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between border-t border-[#2A1A12]/15 pt-4 text-sm">
            <div>
              <span className="font-bold text-[#2A1A12]">{featured.family}</span>
              <span className="text-[#9A4F28] font-medium ml-2">with {featured.puppyName} ({featured.breed})</span>
            </div>
            <span className="text-xs text-[#5A4030] mt-1 sm:mt-0 font-medium">{featured.location}</span>
          </div>
        </div>

        {/* Polaroid Style Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {polaroids.map((item, index) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl border-[2.5px] border-[#2A1A12] p-3 pb-4 shadow-chunky transition-transform duration-300 hover:rotate-0 hover:scale-105 hover:z-20 ${rotations[index]}`}
            >
              <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200 mb-2.5">
                <Image
                  src={item.photoUrl}
                  alt={item.caption}
                  fill
                  sizes="(max-width: 768px) 50vw, 250px"
                  className="object-cover"
                />
              </div>
              <p className="font-handwriting text-xs sm:text-sm text-[#2A1A12] font-bold text-center leading-tight">
                {item.caption}
              </p>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-12 text-center">
          <ChunkyButton href="/happy-families" variant="primary" size="lg">
            See every happy family & story
          </ChunkyButton>
        </div>
      </div>
    </section>
  );
}
