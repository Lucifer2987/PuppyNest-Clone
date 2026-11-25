"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion, MotionValue } from "framer-motion";
import { Video, ArrowRight, Pin, Sparkles } from "lucide-react";
import { Puppy } from "@/lib/types";
import { PawIcon } from "@/components/PawTrail";
import { useMascotPosition, triggerExcitedMascot } from "@/hooks/useMascotPosition";
import { cn } from "@/lib/utils";

interface DoorGateProps {
  pup: Puppy;
  index: number;
  isOpen?: boolean;
  isPinnedOpen: boolean;
  onTogglePin: () => void;
  width?: number;
  height?: number;
  theme?: "warm" | "dark" | "caramel";
  trackX?: MotionValue<number>;
  doorOffset?: number;
}

// Helpers for status sticker labels and styling
function getStickerConfig(status: string) {
  if (status === "reserved") {
    return {
      label: "Reserved",
      bg: "bg-[#FFE7A8]",
    };
  }
  if (status === "gone-home") {
    return {
      label: "Gone home",
      bg: "bg-[#E5DED3]",
    };
  }
  return {
    label: "Available",
    bg: "bg-[#FFFEFA]",
  };
}

export function DoorGate({
  pup,
  index,
  isOpen,
  isPinnedOpen,
  onTogglePin,
  width = 290,
  height = 390,
  theme = "warm",
  trackX,
  doorOffset,
}: DoorGateProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);
  const [isAutoOpen, setIsAutoOpen] = useState(false);
  const prevOpenRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();

  // Read global mascot's live position
  const { mascotX } = useMascotPosition();

  // Door click / keydown handling:
  // First click opens/pins; if already open, navigates to /puppies/{slug}
  const handleDoorClick = () => {
    if (effectiveOpen) {
      router.push(`/puppies/${pup.slug}`);
    } else {
      onTogglePin();
    }
  };

  const handleDoorKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleDoorClick();
    }
  };

  // Open-ahead (1.2 door widths) and close-behind (1.25 door widths) logic with hysteresis
  useEffect(() => {
    if (!trackX || doorOffset === undefined || prefersReducedMotion) return;

    const checkDoorDistance = () => {
      const curTrackX = trackX.get();
      const doorScreenX = curTrackX + doorOffset;
      const curMascotX = mascotX.get();
      const dist = curMascotX - doorScreenX;

      const openAhead = 1.2 * width;
      const closeBehind = 1.25 * width;

      if (dist >= -openAhead && dist <= closeBehind) {
        setIsAutoOpen(true);
      } else if (dist < -openAhead - 25 || dist > closeBehind + 25) {
        setIsAutoOpen(false);
      }
    };

    const unsubTrack = trackX.on("change", checkDoorDistance);
    const unsubMascot = mascotX.on("change", checkDoorDistance);
    checkDoorDistance();

    return () => {
      unsubTrack();
      unsubMascot();
    };
  }, [trackX, doorOffset, width, mascotX, prefersReducedMotion]);

  // Manual override (e.g. reduced motion or parent prop) or mascot-driven auto-open + user pinned
  const effectiveOpen =
    (isOpen !== undefined ? isOpen : isAutoOpen) || isPinnedOpen;
  const stickerConfig = getStickerConfig(pup.status);

  // Trigger sparkle pop when door opens and trigger excited tail wag
  useEffect(() => {
    if (effectiveOpen && !prevOpenRef.current) {
      setShowSparkle(true);
      triggerExcitedMascot();
      const timer = setTimeout(() => setShowSparkle(false), 700);
      return () => clearTimeout(timer);
    }
    prevOpenRef.current = effectiveOpen;
  }, [effectiveOpen]);

  // Target rotation for 3D door leaf
  // Closed: 0deg | Hover peek: -14deg | Open: -105deg
  const targetRotation = effectiveOpen ? -105 : isHovered ? -14 : 0;

  return (
    <div
      className="shrink-0 flex flex-col items-center select-none relative group"
      style={{ width: `${width}px` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Puppy Name & Meta above the door arch */}
      {/* On hover the puppy name turns rust #9A4F28 with 0.2s color transition */}
      <div className="text-center mb-3 h-14 flex flex-col justify-end px-2 select-none">
        <Link
          href={`/puppies/${pup.slug}`}
          className={cn(
            "font-display font-black text-xl sm:text-2xl leading-tight transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#9A4F28] rounded-md px-1",
            isHovered ? "text-[#9A4F28]" : "text-[#2A1A12]"
          )}
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

      {/* 2. Door Wrapper (relative, overflow visible)
          Contains (a) the clipped door/photo shell and (b) a sibling floating Available sticker */}
      <div
        className="doorWrap relative w-full overflow-visible"
        style={{ height: `${height}px` }}
      >
        {/* ============================================================
            (a) CLIPPED DOOR / PHOTO SHELL (with 3D perspective)
            ============================================================ */}
        <div className="door-perspective relative w-full h-full rounded-t-[140px] border-[3px] border-[#2A1A12] shadow-chunky bg-[#2A1A12] overflow-hidden">
          {/* INNER REVEALED CARD (Behind Door) */}
          <div className="absolute inset-0 bg-[#FFFDF8] flex flex-col justify-between overflow-hidden">
            {/* Puppy Photo Container */}
            <motion.div
              layoutId={`pup-photo-${pup.slug}`}
              onClick={() => {
                if (effectiveOpen) {
                  router.push(`/puppies/${pup.slug}`);
                }
              }}
              className={cn(
                "relative w-full h-[72%] overflow-hidden bg-[#EFEAE2]",
                effectiveOpen && "cursor-pointer"
              )}
            >
              <Image
                src={pup.images[0]}
                alt={`${pup.name} - ${pup.breed}`}
                fill
                sizes="320px"
                className="object-cover"
                priority={index < 2}
              />
              {/* Inner Arch Inset Shadow */}
              <div className="absolute inset-0 ring-4 ring-inset ring-black/25 pointer-events-none rounded-t-[136px]" />

              {/* Sparkle burst animation when gate opens */}
              <AnimatePresence>
                {showSparkle && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1.2 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-4 right-4 z-20 text-[#F0B955] drop-shadow-md pointer-events-none sparkle-burst"
                  >
                    <Sparkles className="w-6 h-6 fill-current" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Bottom Info Slot with Pricing & Direct CTA */}
            <div className="p-3 bg-[#FFF8EA] border-t-2 border-[#2A1A12] flex flex-col justify-center">
              <div className="flex items-center justify-between text-xs font-bold text-[#2A1A12] mb-1.5">
                <span className="text-[#5A4030]">{pup.color}</span>
                <span className="font-display font-black text-sm text-[#9A4F28]">
                  AED {pup.priceAed.toLocaleString()}
                </span>
              </div>

              <Link
                href={`/puppies/${pup.slug}`}
                className="w-full py-1.5 px-3 rounded-full bg-[#2A1A12] text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#9A4F28] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9A4F28]"
              >
                <span>Meet {pup.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 3D WOODEN DOOR LEAF (Swings Open / Closed) */}
          <button
            type="button"
            onClick={handleDoorClick}
            onKeyDown={handleDoorKeyDown}
            aria-expanded={effectiveOpen}
            aria-label={`${pup.name}, ${pup.breed}, ${stickerConfig.label}. ${effectiveOpen ? "Click to view puppy details" : "Click to open door"}`}
            style={{
              transform: `rotateY(${targetRotation}deg)`,
              transformOrigin: "left center",
              transition: effectiveOpen
                ? "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
                : "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
            }}
            className={cn(
              "absolute inset-0 rounded-t-[136px] border-2 cursor-pointer flex flex-col justify-between p-4 z-20 shadow-md text-left focus:outline-none focus:ring-2 focus:ring-white/80",
              theme === "warm" && "bg-[#8E4420] border-[#2A1A12] text-[#FFE8D6]",
              theme === "dark" && "bg-[#382318] border-[#2A1A12] text-[#FFE8D6]",
              theme === "caramel" && "bg-[#BA7C3E] border-[#2A1A12] text-[#FFF3D9]"
            )}
          >
            {/* Inner Arch Outline & Paw Icon Emblem */}
            <div className="relative w-full h-[55%] flex flex-col items-center justify-start pt-6 pointer-events-none">
              <div className="absolute inset-x-3 top-2 bottom-0 rounded-t-[120px] border-2 border-dashed border-black/35 pointer-events-none" />
              <div className="relative z-10 opacity-40 text-white mt-4">
                <PawIcon size={38} fill="currentColor" />
              </div>
            </div>

            {/* Vertical Wooden Plank Grooves */}
            <div className="absolute inset-0 flex justify-evenly pointer-events-none opacity-25">
              <div className="w-[1.5px] h-full bg-black/50" />
              <div className="w-[1.5px] h-full bg-black/50" />
            </div>

            {/* Gold Brass Door Knob */}
            <div className="absolute right-4 top-[58%] -translate-y-1/2 z-30 pointer-events-none">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#FCE7BE] via-[#F0B955] to-[#B88528] border-2 border-[#2A1A12] shadow-sm flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/70 -translate-x-0.5 -translate-y-0.5" />
              </div>
            </div>

            {/* Bottom Label: "Knock to peek •" */}
            <div className="relative z-10 w-full pt-4 pb-1 border-t border-black/20 text-center pointer-events-none">
              <span className="font-handwriting text-xs text-white/75 tracking-widest font-bold uppercase">
                Knock to peek •
              </span>
            </div>
          </button>

          {/* Pin Status Badge (Shown when pinned open by user tap) */}
          {isPinnedOpen && (
            <div className="absolute top-4 left-3 z-30 pointer-events-none">
              <div className="bg-[#F0B955] text-[#2A1A12] border-2 border-[#2A1A12] px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sticker flex items-center gap-1">
                <Pin className="w-3 h-3 fill-current rotate-45" />
                <span>Pinned</span>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================
            (b) SIBLING FLOATING "AVAILABLE" STICKER (Match Image 3)
            - NOT clipped by overflow-hidden
            - NOT affected by 3D rotateY when door swings
            - Sits above door outline (z-30)
            - Desktop: top 13%, right -14px (~40% hangs outside door)
            - Mobile: top 13%, right -8px
            - Rounded pill radius 14px, 2px solid #2A1A12 outline
            - Rotate 12deg clockwise
            - Hard offset shadow 2px 3px 0 rgba(42,26,18,0.35) + 0 4px 8px rgba(42,26,18,0.12)
            - On hover: wiggles 12 -> 17 -> 9 -> 12deg (0.4s) & lifts 2px
            ============================================================ */}
        <motion.div
          className="availableSticker absolute top-[13%] -right-[8px] sm:-right-[14px] z-30 pointer-events-none select-none"
          style={{
            transformOrigin: "center",
          }}
          animate={
            isHovered && !prefersReducedMotion
              ? {
                  rotate: [12, 17, 9, 12],
                  y: -2,
                  transition: { duration: 0.4, ease: "easeInOut" },
                }
              : {
                  rotate: 12,
                  y: 0,
                  transition: { duration: 0.2 },
                }
          }
        >
          <span
            className={cn(
              "inline-flex items-center justify-center rounded-[14px] border-2 border-[#2A1A12] font-handwriting text-[13px] sm:text-[15px] font-bold tracking-[0.02em] text-[#2A1A12] px-[10px] py-[4px] sm:px-[12px] sm:py-[5px] whitespace-nowrap",
              stickerConfig.bg
            )}
            style={{
              boxShadow: "2px 3px 0 rgba(42, 26, 18, 0.35), 0 4px 8px rgba(42, 26, 18, 0.12)",
            }}
          >
            {stickerConfig.label}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
