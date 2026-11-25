"use client";

import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useScrollActivity } from "@/hooks/useScrollActivity";
import { Mascot } from "@/components/Mascot";
import { PawIcon } from "@/components/PawTrail";
import { cn } from "@/lib/utils";

interface WalkingMascotProps {
  containerRef: React.RefObject<HTMLElement>;
  startLeftPercent?: number;
  endLeftPercent?: number;
  className?: string;
  size?: number;
  showAirPaws?: boolean;
}

/**
 * Position-linked mascot puppy that moves along the section's path
 * while scrolling; legs animate only while scroll velocity > 0,
 * and settle to idle standing when scrolling stops.
 */
export function WalkingMascot({
  containerRef,
  startLeftPercent = 5,
  endLeftPercent = 88,
  className,
  size = 110,
  showAirPaws = true,
}: WalkingMascotProps) {
  const prefersReducedMotion = useReducedMotion();
  const { isScrolling, scrollDirection } = useScrollActivity();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const xPercent = useTransform(
    scrollYProgress,
    [0, 1],
    [`${startLeftPercent}%`, `${endLeftPercent}%`]
  );

  // If user prefers reduced motion, render static mascot
  if (prefersReducedMotion) {
    return (
      <div className={cn("relative pointer-events-none select-none", className)}>
        <Mascot pose="idle" size={size} />
      </div>
    );
  }

  return (
    <motion.div
      style={{
        left: xPercent,
      }}
      className={cn(
        "absolute z-30 pointer-events-none select-none transition-transform duration-75",
        className
      )}
      aria-hidden="true"
    >
      <div className="relative">
        {/* Floating tiny air paw prints around the mascot's path */}
        {showAirPaws && isScrolling && (
          <div className="absolute -left-6 top-8 text-[#9A4F28]/40 animate-ping">
            <PawIcon size={12} fill="currentColor" />
          </div>
        )}

        <Mascot
          pose="walk"
          isWalking={isScrolling}
          facing={scrollDirection === "down" ? "right" : "left"}
          width={size}
          height={size * 0.9}
        />
      </div>
    </motion.div>
  );
}
