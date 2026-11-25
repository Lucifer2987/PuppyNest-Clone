"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Puppy } from "@/lib/types";
import { DoorCard } from "@/components/DoorCard";
import { Mascot } from "@/components/Mascot";
import { PawTrail } from "@/components/PawTrail";
import { ChunkyButton } from "@/components/ChunkyButton";

interface DoorCarouselProps {
  puppies: Puppy[];
}

export function DoorCarousel({ puppies }: DoorCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -330 : 330;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  // Filter available puppies for the home carousel (take first 6-8)
  const displayPuppies = puppies
    .filter((p) => p.status === "available")
    .slice(0, 7);

  const doorThemes: ("warm" | "dark" | "caramel")[] = ["warm", "dark", "caramel"];

  return (
    <section className="relative w-full py-12 sm:py-16 md:py-20 bg-[#FFF3D9] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Title on Left, Button on Right */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#2A1A12] tracking-tight">
              Meet the pups
            </h2>
            <p className="text-base sm:text-lg text-[#5A4030] mt-2 font-normal">
              Real puppies, real photos, looking for their families right now.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Scroll Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Scroll left"
                className="w-10 h-10 rounded-full border-2 border-[#2A1A12] bg-[#FFF8EA] text-[#2A1A12] flex items-center justify-center shadow-chunky-sm active:translate-y-[2px] active:shadow-none hover:bg-white transition-all"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Scroll right"
                className="w-10 h-10 rounded-full border-2 border-[#2A1A12] bg-[#FFF8EA] text-[#2A1A12] flex items-center justify-center shadow-chunky-sm active:translate-y-[2px] active:shadow-none hover:bg-white transition-all"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            <ChunkyButton
              href="/puppies"
              variant="primary"
              size="md"
              className="w-full sm:w-auto"
            >
              See all available puppies
            </ChunkyButton>
          </div>
        </div>

        {/* Carousel & Walking Puppy Area */}
        <div className="relative">
          {/* Walking Cartoon Puppy Mascot on the Left with Paw Trail matching Screenshot 2 */}
          <div className="hidden lg:block absolute -left-6 bottom-4 z-20 pointer-events-none">
            <div className="relative">
              {/* Paw Trail leading up diagonally */}
              <PawTrail className="-mt-16 ml-12" />

              {/* Walking Puppy Mascot */}
              <div className="animate-bob hover:scale-110 transition-transform">
                <Mascot variant="walking" width={150} height={140} />
              </div>
            </div>
          </div>

          {/* Horizontal Scrollable Carousel Container */}
          <div
            ref={scrollRef}
            className="flex items-end gap-5 sm:gap-6 overflow-x-auto pb-6 pt-2 px-2 scroll-smooth no-scrollbar snap-x snap-mandatory"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {/* Spacer for desktop walking puppy */}
            <div className="hidden lg:block w-36 shrink-0" aria-hidden="true" />

            {displayPuppies.map((pup, index) => {
              const theme = doorThemes[index % doorThemes.length];
              return (
                <div key={pup.id} className="snap-start shrink-0">
                  <DoorCard puppy={pup} colorScheme={theme} />
                </div>
              );
            })}

            {/* End Card Linking to all puppies */}
            <div className="snap-start shrink-0 flex flex-col items-center justify-center w-[220px] sm:w-[240px] h-[370px] sm:h-[390px] rounded-t-[140px] border-[3px] border-dashed border-[#2A1A12]/50 bg-[#FFF8EA] text-center p-6 mb-0 mt-auto">
              <span className="font-handwriting text-xl text-[#9A4F28] font-bold">
                Looking for another breed?
              </span>
              <p className="text-xs text-[#5A4030] mt-2 mb-6">
                We also bring custom teacup breeds from certified international breeders.
              </p>
              <ChunkyButton href="/puppies" variant="outline" size="sm">
                Explore All Puppies
              </ChunkyButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
