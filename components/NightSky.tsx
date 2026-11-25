"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

interface NightSkyProps {
  className?: string;
  showMoon?: boolean;
  starCount?: number;
}

/**
 * Night sky background with twinkling stars (small CSS dots, random delays)
 * and optional glowing crescent moon.
 */
export function NightSky({
  className,
  showMoon = true,
  starCount = 38,
}: NightSkyProps) {
  // Generate deterministic pseudo-random star coordinates
  const stars = useMemo(() => {
    return Array.from({ length: starCount }, (_, i) => {
      const top = ((i * 37 + 13) % 94) + 3; // 3% to 97%
      const left = ((i * 47 + 23) % 96) + 2; // 2% to 98%
      const size = (i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1.5);
      const delay = ((i * 0.3) % 2.5).toFixed(2);
      const duration = (2 + ((i * 0.4) % 2)).toFixed(2);
      return { top, left, size, delay, duration };
    });
  }, [starCount]);

  return (
    <div
      className={cn("absolute inset-0 pointer-events-none select-none overflow-hidden z-0", className)}
      aria-hidden="true"
    >
      {/* Crescent Moon */}
      {showMoon && (
        <div className="absolute top-8 sm:top-12 right-8 sm:right-16 w-14 h-14 sm:w-16 sm:h-16 text-[#F0B955] drop-shadow-[0_0_12px_rgba(240,185,85,0.45)]">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <path
              d="M78 18C52 24 38 48 42 76C44 85 48 92 54 96C30 92 12 70 14 46C16 22 36 6 62 4C68 4 73 5 78 8C73 11 75 14 78 18Z"
              fill="#F0B955"
              stroke="#FFF3D9"
              strokeWidth="2"
            />
            {/* Soft inner glow circle */}
            <circle cx="36" cy="48" r="3" fill="#FFFDF8" opacity="0.8" />
          </svg>
        </div>
      )}

      {/* Twinkling Stars */}
      {stars.map((s, idx) => (
        <div
          key={idx}
          className="absolute rounded-full bg-[#FFF3D9] animate-pulse"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            opacity: 0.75,
            boxShadow: "0 0 4px #FFF3D9",
          }}
        />
      ))}
    </div>
  );
}
