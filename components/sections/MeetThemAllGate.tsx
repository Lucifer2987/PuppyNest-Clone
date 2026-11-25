"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { PawIcon } from "@/components/PawTrail";
import { cn } from "@/lib/utils";

/**
 * =========================================================================
 * TUNABLE CONSTANTS (MeetThemAllGate Spec)
 * =========================================================================
 */
const COLOR_STROKE = "#2A1A12"; // Dark brown stroke
const COLOR_UNDERLINE = "#C8502A"; // Rust orange hand-drawn underline
const COLOR_GLOW_FILL = "#FBE3B8"; // Soft cream-orange glow fill
const STROKE_WIDTH = 2.5; // Dashed arch stroke width
const DASH_ARRAY = "5 6"; // 5px dash, 6px gap

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface MeetThemAllGateProps {
  isApproached: boolean;
  isArrived: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export function MeetThemAllGate({
  isApproached,
  isArrived,
  width = 290,
  height = 390,
  className,
}: MeetThemAllGateProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  const [isHovered, setIsHovered] = useState(false);
  const [isSwinging, setIsSwinging] = useState(false);
  const [sparkles, setSparkles] = useState<SparkleParticle[]>([]);

  const isSolidAndGlow = isApproached || isArrived || isHovered;
  const radius = width / 2;

  // Arch SVG path: starts at bottom-left, goes up, semicircular arch across top, down to bottom-right
  const strokeOffset = STROKE_WIDTH / 2;
  const pathD = `M ${strokeOffset} ${height} L ${strokeOffset} ${radius} A ${radius - strokeOffset} ${radius - strokeOffset} 0 0 1 ${width - strokeOffset} ${radius} L ${width - strokeOffset} ${height}`;

  // Emit paw sparkles when arrived in front of gate
  useEffect(() => {
    if (!isArrived || prefersReducedMotion) {
      setSparkles([]);
      return;
    }

    const interval = setInterval(() => {
      const newSparkle: SparkleParticle = {
        id: Date.now() + Math.random(),
        x: (Math.random() - 0.5) * (width * 0.7),
        y: (Math.random() - 0.5) * (height * 0.4),
        size: Math.floor(Math.random() * 8) + 12,
      };

      setSparkles((prev) => [...prev.slice(-5), newSparkle]);
    }, 450);

    return () => clearInterval(interval);
  }, [isArrived, width, height, prefersReducedMotion]);

  // Click handler: door swing animation before route transition
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefersReducedMotion) return; // Allow instant link navigation
    e.preventDefault();
    setIsSwinging(true);
    setTimeout(() => {
      router.push("/puppies");
    }, 420);
  };

  return (
    <div
      style={{ width: `${width}px` }}
      className={cn("shrink-0 flex flex-col items-center select-none relative group", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Header Spacer to match DoorGate name height */}
      <div className="h-14 mb-3 flex items-end justify-center pointer-events-none">
        <span
          className={cn(
            "font-handwriting text-xs text-[#9A4F28] font-bold tracking-wider uppercase transition-opacity duration-300",
            isSolidAndGlow ? "opacity-100" : "opacity-0"
          )}
        >
          All 15+ Rare Lineages •
        </span>
      </div>

      {/* 2. Arched Gate Container standing on the wooden floor line */}
      <Link
        href="/puppies"
        onClick={handleClick}
        aria-label="Meet them all: see every available puppy"
        style={{ height: `${height}px` }}
        className="door-perspective relative w-full flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-[#9A4F28] rounded-t-[140px] cursor-pointer"
      >
        {/* Sparkle Particles floating up upon arrival */}
        <AnimatePresence>
          {sparkles.map((sp) => (
            <motion.div
              key={sp.id}
              initial={{ opacity: 0, scale: 0.4, y: 20 }}
              animate={{ opacity: 0.9, scale: 1.1, y: -45 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{
                left: `calc(50% + ${sp.x}px)`,
                top: `calc(50% + ${sp.y}px)`,
              }}
              className="absolute z-30 pointer-events-none text-[#F0B955]"
            >
              <PawIcon size={sp.size} fill="currentColor" />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* 3D DOOR LEAF (Normally stationary, swings open on click) */}
        <div
          style={{
            transform: isSwinging ? "rotateY(-95deg)" : "rotateY(0deg)",
            transformOrigin: "left center",
            transition: "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
          className="absolute inset-0 flex items-center justify-center rounded-t-[140px] overflow-hidden"
        >
          {/* SVG Outline and Glow Fill */}
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          >
            {/* Soft Warm Cream-Orange Glow Fill */}
            <path
              d={pathD}
              fill={COLOR_GLOW_FILL}
              className={cn(
                "transition-opacity duration-500 ease-out",
                isSolidAndGlow ? "opacity-60" : "opacity-0"
              )}
            />

            {/* Arch Stroke: Dashed in idle, Solid when approached */}
            <path
              d={pathD}
              stroke={COLOR_STROKE}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeDasharray={isSolidAndGlow ? "none" : DASH_ARRAY}
              className={cn(
                "transition-all duration-500",
                !isSolidAndGlow && !prefersReducedMotion && "animate-dash-crawl"
              )}
            />
          </svg>

          {/* Centered Content: "Meet them all" in Fraunces 900 with Rust Underlines */}
          <motion.div
            animate={{
              y: isSolidAndGlow ? -4 : 0,
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative z-20 flex flex-col items-center justify-center text-center px-4"
          >
            {/* Line 1: "Meet" */}
            <div className="relative inline-flex flex-col items-center">
              <span className="font-display font-black text-3xl sm:text-4xl md:text-[2.6rem] text-[#2A1A12] tracking-tight leading-[0.95]">
                Meet
              </span>
              {/* Rust Orange Hand-Drawn Underline 1 */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isSolidAndGlow ? 1 : 0.85 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                style={{ transformOrigin: "left center" }}
                className="w-full mt-1 flex justify-center"
              >
                <svg
                  viewBox="0 0 100 8"
                  className="w-full h-2 overflow-visible"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 2 4 Q 50 1, 98 4"
                    stroke={COLOR_UNDERLINE}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>
            </div>

            {/* Line 2: "them all" */}
            <div className="relative inline-flex flex-col items-center mt-0.5">
              <span className="font-display font-black text-3xl sm:text-4xl md:text-[2.6rem] text-[#2A1A12] tracking-tight leading-[0.95]">
                them all
              </span>
              {/* Rust Orange Hand-Drawn Underline 2 */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isSolidAndGlow ? 1 : 0.85 }}
                transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
                style={{ transformOrigin: "left center" }}
                className="w-full mt-1 flex justify-center"
              >
                <svg
                  viewBox="0 0 160 8"
                  className="w-full h-2 overflow-visible"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 2 4 Q 80 1.5, 158 4"
                    stroke={COLOR_UNDERLINE}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Link>
    </div>
  );
}
