"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Video, ArrowRight } from "lucide-react";
import { Puppy } from "@/lib/types";
import { PawIcon } from "@/components/PawTrail";
import { cn } from "@/lib/utils";

interface DoorCardProps {
  puppy: Puppy;
  colorScheme?: "warm" | "dark" | "caramel";
  className?: string;
}

export function DoorCard({ puppy, colorScheme = "warm", className }: DoorCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Door themes matching Screenshot 2:
  // 1: warm rich brown (#9A4F28)
  // 2: deep dark chocolate (#3E2316)
  // 3: golden caramel (#C98B4D)
  const theme = colorScheme || puppy.doorTheme || "warm";

  const doorBackgrounds = {
    warm: "bg-[#8E4420] text-[#FFE8D6] border-[#2A1A12]",
    dark: "bg-[#382318] text-[#FFE8D6] border-[#2A1A12]",
    caramel: "bg-[#BA7C3E] text-[#FFF3D9] border-[#2A1A12]",
  };

  const doorPlankBorder = {
    warm: "border-[#6E3316]",
    dark: "border-[#25150D]",
    caramel: "border-[#96612E]",
  };

  const isAvailable = puppy.status === "available";

  return (
    <div
      className={cn(
        "door-card group relative flex flex-col items-center select-none w-[260px] sm:w-[280px] md:w-[300px] shrink-0",
        isOpen && "is-open",
        className
      )}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onTouchStart={() => setIsOpen(!isOpen)}
    >
      {/* 1. Puppy Name & Subtitle Sitting ABOVE the Door (Fraunces Display font) */}
      <div className="text-center mb-3 h-16 flex flex-col justify-end px-2">
        <Link
          href={`/puppies/${puppy.slug}`}
          className="font-display font-black text-xl sm:text-2xl text-[#2A1A12] leading-tight hover:text-[#9A4F28] transition-colors"
        >
          {puppy.name}
        </Link>
        <p className="text-xs text-[#5A4030] mt-0.5 font-medium line-clamp-1">
          {puppy.breed}, {puppy.gender}, {puppy.ageMonths} months
          {puppy.hasVideo && (
            <span className="inline-flex items-center gap-0.5 ml-1 text-[#9A4F28] font-semibold">
              <Video className="w-3 h-3 inline" /> with video
            </span>
          )}
        </p>
      </div>

      {/* 2. Arched Frame Container with 3D Door Perspective */}
      <div className="door-perspective relative w-full h-[370px] sm:h-[390px] rounded-t-[140px] border-[3px] border-[#2A1A12] shadow-chunky bg-[#2A1A12] overflow-hidden">
        {/* === INNER REVEALED CONTENT (Puppy Photo + Details) === */}
        <div className="absolute inset-0 bg-[#FFFDF8] flex flex-col justify-between overflow-hidden">
          {/* Puppy photo */}
          <motion.div
            layoutId={`pup-photo-${puppy.slug}`}
            onClick={() => {
              if (isOpen) router.push(`/puppies/${puppy.slug}`);
            }}
            className={cn("relative w-full h-[72%] overflow-hidden", isOpen && "cursor-pointer")}
          >
            <Image
              src={puppy.images[0]}
              alt={`${puppy.name} - ${puppy.breed}`}
              fill
              sizes="300px"
              className="object-cover"
            />
          </motion.div>

          {/* Quick stats & CTA inside bottom */}
          <div className="p-3 bg-[#FFF8EA] border-t-2 border-[#2A1A12] flex flex-col justify-center">
            <div className="flex items-center justify-between text-xs font-semibold text-[#2A1A12] mb-2">
              <span>{puppy.color}</span>
              <span className="font-display font-black text-sm text-[#9A4F28]">
                AED {puppy.priceAed.toLocaleString()}
              </span>
            </div>

            <Link
              href={`/puppies/${puppy.slug}`}
              className="w-full py-1.5 px-3 rounded-full bg-[#2A1A12] text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#9A4F28] transition-colors shadow-sm"
            >
              <span>Meet {puppy.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* === THE 3D WOODEN DOOR LEAF (Swings open on hover) === */}
        <div
          className={cn(
            "door-leaf absolute inset-0 rounded-t-[136px] border-[2px] cursor-pointer flex flex-col justify-between p-4 z-20 shadow-md",
            doorBackgrounds[theme]
          )}
        >
          {/* Top Panel with Inner Arch Outline and Faint Paw Emblem */}
          <div className="relative w-full h-[55%] flex flex-col items-center justify-start pt-6">
            {/* Inner Arch Outline */}
            <div
              className={cn(
                "absolute inset-x-3 top-2 bottom-0 rounded-t-[120px] border-2 border-dashed opacity-30 pointer-events-none",
                doorPlankBorder[theme]
              )}
            />

            {/* Faint Paw Emblem stamped in center of top arch */}
            <div className="relative z-10 opacity-35 transition-opacity group-hover:opacity-60 text-white mt-4">
              <PawIcon size={38} fill="currentColor" />
            </div>
          </div>

          {/* Vertical Plank Groove Lines */}
          <div
            className={cn(
              "absolute inset-0 flex justify-evenly pointer-events-none opacity-25",
              doorPlankBorder[theme]
            )}
          >
            <div className="w-[1px] h-full bg-black/40" />
            <div className="w-[1px] h-full bg-black/40" />
          </div>

          {/* Round Gold Door Knob with 3D highlight */}
          <div className="absolute right-4 top-[58%] -translate-y-1/2 z-30">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#FCE7BE] via-[#F0B955] to-[#B88528] border-2 border-[#2A1A12] shadow-sm flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white/70 -translate-x-0.5 -translate-y-0.5" />
            </div>
          </div>

          {/* Bottom Wood Base Rim */}
          <div className="relative z-10 w-full pt-4 pb-2 border-t border-black/20 text-center">
            <span className="font-handwriting text-xs text-white/70 tracking-widest font-bold uppercase">
              Knock to peek •
            </span>
          </div>
        </div>

        {/* 3. Tilted White "Available" Sticker at Top-Right */}
        <div className="absolute top-4 right-3 z-30 pointer-events-none transform rotate-12 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
          <div
            className={cn(
              "px-3 py-1 rounded-full border-2 border-[#2A1A12] font-handwriting text-sm font-bold shadow-sticker tracking-wide",
              isAvailable
                ? "bg-[#FFFDF8] text-[#2A1A12]"
                : "bg-[#2A1A12] text-white"
            )}
          >
            {isAvailable ? "Available" : "Gone Home"}
          </div>
        </div>
      </div>
    </div>
  );
}
