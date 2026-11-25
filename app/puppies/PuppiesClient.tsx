"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { Mascot } from "@/components/Mascot";
import { PawIcon } from "@/components/PawTrail";
import { ChunkyButton } from "@/components/ChunkyButton";
import { Puppy, PuppyBreed } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PuppiesClientProps {
  puppies: Puppy[];
}

const BREEDS: PuppyBreed[] = [
  "Maltipoo",
  "Pomeranian",
  "Poodle",
  "Cavapoo",
  "Shih Tzu",
];

// Soft pastel ring colors cycling around the circular portraits
const HALO_COLORS = [
  "#F2D9B3",
  "#D7E5EC",
  "#F5DFB5",
  "#F6CEB8",
  "#E5DEC9",
  "#DCE6DA",
];

// Sketchy hand-drawn doodle accent around each portrait
function PortraitDoodles({ index }: { index: number }) {
  const variant = index % 4;

  if (variant === 0) {
    return (
      <>
        {/* Top-left 4-point sparkle */}
        <svg
          className="absolute -top-1 left-2 w-4 h-4 text-[#C98B4D] pointer-events-none"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 0L12.2 7.8L20 10L12.2 12.2L10 20L7.8 12.2L0 10L7.8 7.8Z" />
        </svg>
        {/* Bottom-right tiny ticks */}
        <svg
          className="absolute bottom-2 -right-2 w-4 h-4 text-[#9A4F28] pointer-events-none"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M4 6L9 3M6 11L12 10M4 16L9 17" />
        </svg>
      </>
    );
  }

  if (variant === 1) {
    return (
      <>
        {/* Top-left outlined heart */}
        <svg
          className="absolute top-0 -left-1 w-4 h-4 text-[#2A1A12] pointer-events-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M12 21s-7-4.5-9.2-8.5C1 9.2 2.8 5 6.8 5c2.2 0 4 1.2 5.2 3 1.2-1.8 3-3 5.2-3 4 0 5.8 4.2 4 7.5C19 16.5 12 21 12 21z" />
        </svg>
        {/* Right sparkle */}
        <svg
          className="absolute top-1/2 -right-2.5 w-3.5 h-3.5 text-[#2A1A12] pointer-events-none"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8Z" />
        </svg>
      </>
    );
  }

  if (variant === 2) {
    return (
      <>
        {/* Top-left paw */}
        <span
          className="absolute -top-1 left-2 text-[#C98B4D] pointer-events-none -rotate-12"
          aria-hidden="true"
        >
          <PawIcon size={13} fill="currentColor" />
        </span>
        {/* Bottom-right heart */}
        <svg
          className="absolute bottom-3 -right-2 w-4 h-4 text-[#2A1A12] pointer-events-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M12 21s-7-4.5-9.2-8.5C1 9.2 2.8 5 6.8 5c2.2 0 4 1.2 5.2 3 1.2-1.8 3-3 5.2-3 4 0 5.8 4.2 4 7.5C19 16.5 12 21 12 21z" />
        </svg>
      </>
    );
  }

  return (
    <>
      {/* Left sketchy ticks */}
      <svg
        className="absolute top-1/2 -left-3 w-4 h-4 text-[#9A4F28] pointer-events-none"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M14 5L8 3M13 10L6 10M14 15L8 17" />
      </svg>
      {/* Top-right paw */}
      <span
        className="absolute bottom-2 -right-2 text-[#C98B4D] pointer-events-none rotate-12"
        aria-hidden="true"
      >
        <PawIcon size={12} fill="currentColor" />
      </span>
    </>
  );
}

export function PuppiesClient({ puppies }: PuppiesClientProps) {
  const searchParams = useSearchParams();
  const prefersReducedMotion = useReducedMotion();

  const initialBreed = searchParams.get("breed") || "all";
  const initialOrigin = searchParams.get("origin") || "all";

  const [selectedBreed, setSelectedBreed] = useState<string>(initialBreed);
  const [selectedOrigin, setSelectedOrigin] = useState<string>(initialOrigin);
  const [selectedGender, setSelectedGender] = useState<string>("all");

  const availablePuppies = useMemo(
    () => puppies.filter((p) => p.status === "available"),
    [puppies]
  );

  const goneHomePuppies = useMemo(
    () => puppies.filter((p) => p.status === "gone-home"),
    [puppies]
  );

  const filteredPuppies = useMemo(() => {
    return availablePuppies.filter((pup) => {
      if (
        selectedBreed !== "all" &&
        pup.breed.toLowerCase() !== selectedBreed.toLowerCase()
      ) {
        return false;
      }
      if (selectedOrigin !== "all" && pup.origin !== selectedOrigin) {
        return false;
      }
      if (selectedGender !== "all" && pup.gender !== selectedGender) {
        return false;
      }
      return true;
    });
  }, [availablePuppies, selectedBreed, selectedOrigin, selectedGender]);

  const hasActiveFilter =
    selectedBreed !== "all" ||
    selectedOrigin !== "all" ||
    selectedGender !== "all";

  const resetFilters = () => {
    setSelectedBreed("all");
    setSelectedOrigin("all");
    setSelectedGender("all");
  };

  return (
    <div className="w-full bg-[#FFF8EC] min-h-screen">
      {/* =================================================================
          TOP SKETCHBOOK SECTION: Header + Self-portrait + Filter Box + Grid
          ================================================================= */}
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 pt-10 sm:pt-14 pb-16 sm:pb-20">
        {/* Header Row: Left Title & Copy + Right Self-Portrait */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-7">
          <div className="max-w-xl">
            <p className="font-handwriting text-[18px] sm:text-[20px] text-[#9A4F28] tracking-wide mb-1">
              from PuppyNest&apos;s sketchbook
            </p>
            <h1 className="font-display font-black text-[clamp(2.5rem,5.4vw,4.3rem)] leading-[0.96] tracking-[-0.025em] text-[#2A1A12]">
              Available puppies
            </h1>
            {/* Thick hand-drawn rust underline */}
            <svg
              className="w-full max-w-[440px] h-[14px] mt-1.5 text-[#A8552A]"
              viewBox="0 0 440 14"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M2 8.5C90 3 185 11.5 275 6.5C340 3 395 8 438 6"
                stroke="currentColor"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            </svg>

            <p className="mt-4 font-body text-[15px] sm:text-[16px] leading-[1.55] text-[#5A4030] max-w-[440px]">
              Every listing shows real photos of the actual puppy. Open a
              profile to see them all, then ask us about them on WhatsApp.
            </p>
          </div>

          {/* Self-portrait Medallion */}
          <div className="hidden sm:flex flex-col items-center shrink-0 md:mr-4 md:mt-2">
            <div className="w-[112px] h-[112px] rounded-full bg-[#F5E7CB] border-2 border-[#2A1A12] p-1 shadow-[3px_3px_0_rgba(42,26,18,0.12)] flex items-center justify-center">
              <div className="w-full h-full rounded-full border border-[#2A1A12]/40 bg-[#F8EED9] flex items-center justify-center overflow-hidden">
                <Mascot pose="sit" size={78} />
              </div>
            </div>
            <span className="mt-1.5 font-handwriting text-[14px] text-[#5A4030]">
              self-portrait
            </span>
          </div>
        </div>

        {/* Filter Card with Masking Tape */}
        <div className="relative bg-[#FFFDF8] rounded-[18px] border-[1.8px] border-[#2A1A12] px-5 sm:px-7 py-4 sm:py-5 shadow-[3px_3px_0_rgba(42,26,18,0.12)] mb-7">
          {/* Masking tape piece on top-left */}
          <div
            className="absolute -top-2.5 left-10 w-14 h-4 bg-[#E9D7B5]/90 border border-[#2A1A12]/15 -rotate-2 pointer-events-none"
            aria-hidden="true"
          />

          <div className="space-y-3">
            {/* Row 1: where */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <span className="font-handwriting text-[16px] text-[#7A5A43] w-20 sm:w-24 shrink-0">
                where
              </span>
              {[
                { value: "all", label: "Everywhere" },
                { value: "imported", label: "Imported" },
                { value: "local", label: "In Dubai" },
              ].map((opt) => {
                const active = selectedOrigin === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedOrigin(opt.value)}
                    className={cn(
                      "px-3.5 py-1 rounded-full font-body text-[13px] font-semibold border-[1.5px] border-[#2A1A12] transition-all duration-150 cursor-pointer",
                      active
                        ? "bg-[#2A1A12] text-white"
                        : "bg-[#FFFDF8] text-[#2A1A12] hover:bg-[#FFF3D9]"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}

              {hasActiveFilter && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-[#9A4F28] hover:underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Row 2: breed */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <span className="font-handwriting text-[16px] text-[#7A5A43] w-20 sm:w-24 shrink-0">
                breed
              </span>
              {BREEDS.map((breed) => {
                const active =
                  selectedBreed.toLowerCase() === breed.toLowerCase();
                return (
                  <button
                    key={breed}
                    type="button"
                    onClick={() =>
                      setSelectedBreed(active ? "all" : breed)
                    }
                    className={cn(
                      "px-3.5 py-1 rounded-full font-body text-[13px] font-semibold border-[1.5px] border-[#2A1A12] transition-all duration-150 cursor-pointer",
                      active
                        ? "bg-[#2A1A12] text-white"
                        : "bg-[#FFFDF8] text-[#2A1A12] hover:bg-[#FFF3D9]"
                    )}
                  >
                    {breed}
                  </button>
                );
              })}
            </div>

            {/* Row 3: boy or girl */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <span className="font-handwriting text-[16px] text-[#7A5A43] w-20 sm:w-24 shrink-0">
                boy or girl
              </span>
              {[
                { value: "boy", label: "Boys" },
                { value: "girl", label: "Girls" },
              ].map((opt) => {
                const active = selectedGender === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setSelectedGender(active ? "all" : opt.value)
                    }
                    className={cn(
                      "px-3.5 py-1 rounded-full font-body text-[13px] font-semibold border-[1.5px] border-[#2A1A12] transition-all duration-150 cursor-pointer",
                      active
                        ? "bg-[#2A1A12] text-white"
                        : "bg-[#FFFDF8] text-[#2A1A12] hover:bg-[#FFF3D9]"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Count Line */}
        <p
          aria-live="polite"
          className="font-handwriting text-[17px] text-[#5A4030] mb-8"
        >
          {filteredPuppies.length}{" "}
          {filteredPuppies.length === 1 ? "puppy" : "puppies"} looking for a home
        </p>

        {/* Circular Sketchbook Puppies Grid */}
        {filteredPuppies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10 justify-items-center">
            {filteredPuppies.map((pup, idx) => {
              const haloColor = HALO_COLORS[idx % HALO_COLORS.length];
              const haloTilt = idx % 2 === 0 ? "-rotate-6" : "rotate-6";

              return (
                <motion.div
                  key={pup.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: prefersReducedMotion ? 0 : Math.min(idx * 0.03, 0.3),
                  }}
                  className="w-full max-w-[172px] flex flex-col items-center text-center"
                >
                  <Link
                    href={`/puppies/${pup.slug}`}
                    className="group flex flex-col items-center w-full focus:outline-none"
                  >
                    {/* Circular Portrait Container */}
                    <div className="relative w-[136px] h-[136px] sm:w-[148px] sm:h-[148px] flex items-center justify-center">
                      {/* Pastel offset halo ring */}
                      <div
                        className={cn(
                          "absolute inset-0 rounded-full border-[1.5px] border-[#2A1A12]/25 transition-transform duration-300 group-hover:scale-105",
                          haloTilt
                        )}
                        style={{
                          backgroundColor: haloColor,
                          transform: `translate(${idx % 2 === 0 ? "-3px" : "3px"}, 3px)`,
                        }}
                        aria-hidden="true"
                      />

                      {/* Crisp circular puppy photo */}
                      <div className="relative w-[126px] h-[126px] sm:w-[138px] sm:h-[138px] rounded-full overflow-hidden border-2 border-[#2A1A12] bg-[#FFFDF8] shadow-sm transition-transform duration-300 group-hover:scale-[1.04]">
                        <Image
                          src={pup.images[0]}
                          alt={`${pup.name} - ${pup.breed} puppy`}
                          fill
                          sizes="150px"
                          className="object-cover"
                        />
                      </div>

                      {/* Sketchy doodles around frame */}
                      <PortraitDoodles index={idx} />

                      {/* Top-right tilted "Available" pill */}
                      <span className="absolute top-1 -right-1 px-2.5 py-0.5 rounded-full bg-[#FFFDF8] border-[1.5px] border-[#2A1A12] font-handwriting text-[12px] font-bold text-[#2A1A12] rotate-[8deg] shadow-sm pointer-events-none">
                        Available
                      </span>

                      {/* Bottom-left "video" pill if hasVideo */}
                      {pup.hasVideo && (
                        <span className="absolute bottom-2 left-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#2A1A12] text-white font-body text-[10px] font-bold shadow-sm pointer-events-none">
                          <Play className="w-2.5 h-2.5 fill-current" />
                          <span>video</span>
                        </span>
                      )}
                    </div>

                    {/* Name & Breed/Age Caption */}
                    <h2 className="mt-3 font-display font-black text-[17px] sm:text-[18px] leading-tight text-[#2A1A12] group-hover:text-[#9A4F28] transition-colors">
                      {pup.name}
                    </h2>
                    <p className="mt-0.5 font-body text-[11px] sm:text-[12px] text-[#6E5442] leading-snug">
                      {pup.breed} · {pup.gender} · {pup.ageMonths}{" "}
                      {pup.ageMonths === 1 ? "month" : "months"}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-14 bg-[#FFFDF8] rounded-[20px] border-2 border-dashed border-[#2A1A12]/30 p-8 max-w-lg mx-auto">
            <p className="font-handwriting text-3xl text-[#9A4F28] font-bold">
              no puppies match that filter!
            </p>
            <p className="mt-2 text-sm text-[#5A4030]">
              Try clearing one of the filters or ask our concierge on WhatsApp about upcoming litters.
            </p>
            <div className="mt-5">
              <ChunkyButton onClick={resetFilters} variant="outline" size="md">
                Show all puppies
              </ChunkyButton>
            </div>
          </div>
        )}
      </div>

      {/* =================================================================
          BOTTOM BAND: "Already gone home"
          ================================================================= */}
      {goneHomePuppies.length > 0 && (
        <section
          aria-labelledby="gone-home-heading"
          className="w-full bg-[#F3DFB9] border-t-2 border-dashed border-[#2A1A12]/20 py-12 sm:py-16"
        >
          <div className="max-w-[1200px] mx-auto px-5 sm:px-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Left Copy + CTA */}
            <div className="max-w-md">
              <h2
                id="gone-home-heading"
                className="font-display font-black text-[30px] sm:text-[36px] text-[#2A1A12] leading-tight"
              >
                Already gone home
              </h2>
              <p className="mt-1.5 font-body text-[14px] sm:text-[15px] text-[#5A4030]">
                These puppies have found their families.
              </p>
              <div className="mt-5">
                <ChunkyButton href="/gone-home" variant="primary" size="md">
                  See the puppies who&apos;ve gone home
                </ChunkyButton>
              </div>
            </div>

            {/* Right Row of Gone-Home Circular Portraits */}
            <div className="flex flex-wrap items-center gap-5 sm:gap-6">
              {goneHomePuppies.map((pup, idx) => (
                <Link
                  key={pup.id}
                  href={`/puppies/${pup.slug}`}
                  className="group flex flex-col items-center text-center focus:outline-none"
                >
                  <div className="relative w-[88px] h-[88px] sm:w-[96px] sm:h-[96px] flex items-center justify-center">
                    <div
                      className="w-full h-full rounded-full overflow-hidden border-2 border-[#2A1A12] bg-[#FFFDF8] shadow-sm transition-transform duration-200 group-hover:scale-105"
                    >
                      <Image
                        src={pup.images[0]}
                        alt={`${pup.name} - gone home`}
                        fill
                        sizes="100px"
                        className="object-cover"
                      />
                    </div>
                    <PortraitDoodles index={idx + 1} />
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-[#FFFDF8] border-[1.5px] border-[#2A1A12] font-handwriting text-[11px] font-bold text-[#9A4F28] shadow-sm">
                      gone home ♥
                    </span>
                  </div>
                  <span className="mt-2.5 font-display font-bold text-[13px] text-[#2A1A12] group-hover:text-[#9A4F28] transition-colors">
                    {pup.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
