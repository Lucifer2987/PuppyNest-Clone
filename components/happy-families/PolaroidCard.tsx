"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FamilyItem {
  id: string;
  image: string;
  caption: string;
  alt: string;
  owner: string;
  location: string;
  breed: string;
  date?: string;
}

interface PolaroidCardProps {
  item: FamilyItem;
  index: number;
  onOpenLightbox: (item: FamilyItem) => void;
  className?: string;
}

function getPolaroidStyle(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  // Rotation between -3.8deg and +3.8deg
  const rotation = ((absHash % 76) - 38) / 10;

  // Tape color: pink, beige, or soft blue washi tape
  const tapeColors = [
    "bg-[#F7D6D0]/85 border-[#2A1A12]/25", // Soft blush pink
    "bg-[#EADECC]/90 border-[#2A1A12]/25", // Warm beige
    "bg-[#D4E6EB]/85 border-[#2A1A12]/25", // Soft baby blue
  ];
  const tapeColor = tapeColors[absHash % tapeColors.length];

  // Tape position: top-center, top-left, or top-right
  const tapePositions = [
    "-top-3 left-1/2 -translate-x-1/2 rotate-[-2deg]",
    "-top-3.5 left-5 rotate-[-10deg]",
    "-top-3.5 right-5 rotate-[8deg]",
  ];
  const tapePos = tapePositions[absHash % tapePositions.length];

  return { rotation, tapeColor, tapePos };
}

export function PolaroidCard({
  item,
  index,
  onOpenLightbox,
  className,
}: PolaroidCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const [imageLoaded, setImageLoaded] = useState(false);
  const { rotation, tapeColor, tapePos } = getPolaroidStyle(item.id);

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: prefersReducedMotion ? 0 : 36,
        rotate: prefersReducedMotion ? 0 : rotation * 2.2,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        rotate: rotation,
      }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        type: "spring",
        stiffness: 140,
        damping: 18,
        delay: prefersReducedMotion ? 0 : (index % 4) * 0.08,
      }}
      whileHover={
        prefersReducedMotion
          ? undefined
          : {
              y: -8,
              rotate: 0,
              scale: 1.025,
              transition: { duration: 0.22, ease: "easeOut" },
            }
      }
      onClick={() => onOpenLightbox(item)}
      role="button"
      tabIndex={0}
      aria-label={`View photo of ${item.alt}: ${item.caption}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenLightbox(item);
        }
      }}
      className={cn(
        "group relative bg-[#FFFDF8] rounded-[6px] border border-[#2A1A12]/15 shadow-[0_6px_16px_rgba(42,26,18,0.12)] hover:shadow-[0_14px_28px_rgba(42,26,18,0.22)] p-2.5 pb-8 transition-shadow duration-300 cursor-pointer select-none",
        className
      )}
    >
      {/* Tape piece (semi-transparent, tilted, wiggles on hover) */}
      <div
        className={cn(
          "absolute w-20 h-6 border shadow-xs z-20 pointer-events-none transition-transform duration-300 group-hover:rotate-0",
          tapeColor,
          tapePos
        )}
      />

      {/* Photo Frame Container with Color Placeholder Block */}
      <div className="relative w-full aspect-[4/4.4] bg-[#E8DDD0] rounded-[3px] overflow-hidden border border-[#2A1A12]/10">
        {/* Placeholder Color Background while photo loads */}
        <div
          className={cn(
            "absolute inset-0 bg-[#E8DDD0] transition-opacity duration-300",
            imageLoaded ? "opacity-0" : "opacity-100"
          )}
        />

        <Image
          src={item.image}
          alt={item.alt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={cn(
            "object-cover transition-all duration-300 group-hover:scale-104",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      {/* Caption at the bottom in Patrick Hand (font-handwriting) */}
      <div className="mt-2.5 px-1 text-center">
        <p className="font-handwriting text-sm sm:text-base text-[#2A1A12] leading-snug line-clamp-2">
          {item.caption}
        </p>
      </div>
    </motion.div>
  );
}
