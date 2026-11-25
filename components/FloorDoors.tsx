"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Video, ArrowRight } from "lucide-react";
import { Puppy } from "@/lib/types";
import { ChunkyButton } from "@/components/ChunkyButton";
import { PawIcon } from "@/components/PawTrail";
import { ScrollRevealText, ScrollFadeUp } from "@/components/ScrollRevealText";
import { cn } from "@/lib/utils";

interface FloorDoorsProps {
  puppies: Puppy[];
}

export function FloorDoors({ puppies }: FloorDoorsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [hoveredDoor, setHoveredDoor] = useState<string | null>(null);
  const [mascotPositionPercent, setMascotPositionPercent] = useState(0);

  const displayPuppies = puppies
    .filter((p) => p.status === "available")
    .slice(0, 6);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      // Map scroll progress to mascot position percentage
      const percent = Math.min(100, Math.max(0, ((latest - 0.15) / 0.7) * 100));
      setMascotPositionPercent(percent);
    });
  }, [scrollYProgress]);

  const doorThemes = ["warm", "dark", "caramel"] as const;

  const scrollNav = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const amount = direction === "left" ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      data-mascot="pups"
      className="relative w-full pt-16 sm:pt-20 pb-0 overflow-hidden bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        {/* Section Header: Title on Left, Button on Right */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <ScrollRevealText
              as="h2"
              className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#2A1A12] tracking-tight"
            >
              Meet the pups
            </ScrollRevealText>
            <ScrollFadeUp
              delay={0.15}
              className="text-base sm:text-lg text-[#5A4030] mt-2 font-normal"
            >
              Real puppies, real photos, looking for their families right now.
            </ScrollFadeUp>
          </div>

          <ScrollFadeUp delay={0.2} className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <button
                type="button"
                onClick={() => scrollNav("left")}
                aria-label="Scroll left"
                className="w-10 h-10 rounded-full border-2 border-[#2A1A12] bg-[#FFF8EA] text-[#2A1A12] flex items-center justify-center shadow-chunky-sm active:translate-y-[2px] active:shadow-none hover:bg-white"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={() => scrollNav("right")}
                aria-label="Scroll right"
                className="w-10 h-10 rounded-full border-2 border-[#2A1A12] bg-[#FFF8EA] text-[#2A1A12] flex items-center justify-center shadow-chunky-sm active:translate-y-[2px] active:shadow-none hover:bg-white"
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
          </ScrollFadeUp>
        </div>
      </div>

      {/* Doors Carousel standing on a Wooden Floor strip */}
      <div className="relative w-full">
        {/* Scrollable Doors Track */}
        <div
          ref={scrollContainerRef}
          className="flex items-end gap-5 sm:gap-7 overflow-x-auto pb-10 pt-4 px-4 sm:px-8 no-scrollbar scroll-smooth snap-x snap-mandatory relative z-10"
          style={{ scrollbarWidth: "none" }}
        >
          {displayPuppies.map((pup, idx) => {
            const theme = doorThemes[idx % doorThemes.length];
            const doorThresholdStart = (idx / displayPuppies.length) * 85;
            const doorThresholdEnd = doorThresholdStart + 35; // Closes after mascot moves 2 doors ahead

            // Door is open if hovered or if mascot is currently passing it
            const isOpenByMascot =
              !prefersReducedMotion &&
              mascotPositionPercent >= doorThresholdStart &&
              mascotPositionPercent <= doorThresholdEnd;

            const isOpen = hoveredDoor === pup.id || isOpenByMascot;

            return (
              <div
                key={pup.id}
                className="snap-start shrink-0 flex flex-col items-center select-none w-[260px] sm:w-[280px] md:w-[300px]"
                onMouseEnter={() => setHoveredDoor(pup.id)}
                onMouseLeave={() => setHoveredDoor(null)}
                onTouchStart={() =>
                  setHoveredDoor(hoveredDoor === pup.id ? null : pup.id)
                }
              >
                {/* 1. Puppy Name & Subtitle sitting ABOVE the door */}
                <div className="text-center mb-3 h-16 flex flex-col justify-end px-2">
                  <Link
                    href={`/puppies/${pup.slug}`}
                    className="font-display font-black text-xl sm:text-2xl text-[#2A1A12] leading-tight hover:text-[#9A4F28] transition-colors"
                  >
                    {pup.name}
                  </Link>
                  <p className="text-xs text-[#5A4030] mt-0.5 font-medium line-clamp-1">
                    {pup.breed}, {pup.gender}, {pup.ageMonths} mo
                    {pup.hasVideo && (
                      <span className="inline-flex items-center gap-0.5 ml-1 text-[#9A4F28] font-semibold">
                        <Video className="w-3 h-3 inline" /> with video
                      </span>
                    )}
                  </p>
                </div>

                {/* 2. Arched Wooden Door Frame */}
                <div className="door-perspective relative w-full h-[370px] sm:h-[390px] rounded-t-[140px] border-[3px] border-[#2A1A12] shadow-chunky bg-[#2A1A12] overflow-hidden">
                  {/* INNER WINDOW: Puppy Photo + Inner Arch Shadow */}
                  <div className="absolute inset-0 bg-[#FFFDF8] flex flex-col justify-between overflow-hidden">
                    <div className="relative w-full h-[72%] overflow-hidden">
                      <Image
                        src={pup.images[0]}
                        alt={`${pup.name} - ${pup.breed}`}
                        fill
                        sizes="300px"
                        className="object-cover"
                      />
                      {/* Darker Inner Arch Shadow */}
                      <div className="absolute inset-0 ring-4 ring-inset ring-black/25 pointer-events-none rounded-t-[136px]" />
                    </div>

                    {/* Inside details */}
                    <div className="p-3 bg-[#FFF8EA] border-t-2 border-[#2A1A12] flex flex-col justify-center">
                      <div className="flex items-center justify-between text-xs font-bold text-[#2A1A12] mb-1.5">
                        <span>{pup.color}</span>
                        <span className="font-display font-black text-sm text-[#9A4F28]">
                          AED {pup.priceAed.toLocaleString()}
                        </span>
                      </div>

                      <Link
                        href={`/puppies/${pup.slug}`}
                        className="w-full py-1.5 px-3 rounded-full bg-[#2A1A12] text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#9A4F28] transition-colors shadow-sm"
                      >
                        <span>Meet {pup.name}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* 3D WOODEN DOOR LEAF */}
                  <div
                    style={{
                      transform: isOpen ? "rotateY(-82deg)" : "rotateY(0deg)",
                      transformOrigin: "left center",
                      transition: "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                    className={cn(
                      "absolute inset-0 rounded-t-[136px] border-2 cursor-pointer flex flex-col justify-between p-4 z-20 shadow-md",
                      theme === "warm" && "bg-[#8E4420] border-[#2A1A12] text-[#FFE8D6]",
                      theme === "dark" && "bg-[#382318] border-[#2A1A12] text-[#FFE8D6]",
                      theme === "caramel" && "bg-[#BA7C3E] border-[#2A1A12] text-[#FFF3D9]"
                    )}
                  >
                    {/* Inner Arch Outline & Faint Paw */}
                    <div className="relative w-full h-[55%] flex flex-col items-center justify-start pt-6">
                      <div className="absolute inset-x-3 top-2 bottom-0 rounded-t-[120px] border-2 border-dashed border-black/30 pointer-events-none" />
                      <div className="relative z-10 opacity-35 text-white mt-4">
                        <PawIcon size={38} fill="currentColor" />
                      </div>
                    </div>

                    {/* Vertical Plank Grooves */}
                    <div className="absolute inset-0 flex justify-evenly pointer-events-none opacity-25">
                      <div className="w-[1px] h-full bg-black/40" />
                      <div className="w-[1px] h-full bg-black/40" />
                    </div>

                    {/* Gold Door Knob */}
                    <div className="absolute right-4 top-[58%] -translate-y-1/2 z-30">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#FCE7BE] via-[#F0B955] to-[#B88528] border-2 border-[#2A1A12] shadow-sm flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/70 -translate-x-0.5 -translate-y-0.5" />
                      </div>
                    </div>

                    {/* Knock hint */}
                    <div className="relative z-10 w-full pt-4 pb-2 border-t border-black/20 text-center">
                      <span className="font-handwriting text-xs text-white/70 tracking-widest font-bold uppercase">
                        Knock to peek •
                      </span>
                    </div>
                  </div>

                  {/* Tilted White "Available" Sticker */}
                  <div className="absolute top-4 right-3 z-30 pointer-events-none transform rotate-12">
                    <div className="px-3 py-1 rounded-full border-2 border-[#2A1A12] bg-[#FFFDF8] text-[#2A1A12] font-handwriting text-sm font-bold shadow-sticker tracking-wide">
                      Available
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>



        {/* WOODEN FLOOR STRIP (orange-brown plank band along the bottom) */}
        <div
          data-floor-strip="true"
          className="relative w-full h-16 bg-[#A0572D] border-t-4 border-[#2A1A12] overflow-hidden shadow-inner flex items-center"
        >
          {/* Floor planks woodgrain lines */}
          <div className="absolute inset-0 flex flex-col justify-between opacity-30 pointer-events-none">
            <div className="w-full h-[1px] bg-black/40" />
            <div className="w-full h-[1px] bg-white/30" />
            <div className="w-full h-[1px] bg-black/40" />
          </div>
          {/* Vertical plank joints */}
          <div className="w-full flex justify-between px-10 opacity-30 pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-[1.5px] h-16 bg-black/40" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
