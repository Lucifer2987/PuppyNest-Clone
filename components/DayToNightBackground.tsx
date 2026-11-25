"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface DayToNightBackgroundProps {
  children: React.ReactNode;
}

/**
 * Global "Day to Night" Storytelling Background:
 * Interpolates smoothly:
 *   cream #FFF3D9 (hero, pups: 0 - 0.22)
 *   -> warm tan #F2C48D (two ways, journey: 0.22 - 0.48)
 *   -> caramel brown #A9582B (passport, happy families: 0.48 - 0.72)
 *   -> deep night brown #2B1810 (FAQ, CTA, footer: 0.72 - 1.0)
 */
export function DayToNightBackground({ children }: DayToNightBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.22, 0.48, 0.72, 1],
    ["#FFF3D9", "#FFF3D9", "#F2C48D", "#A9582B", "#2B1810"]
  );

  return (
    <motion.div
      ref={containerRef}
      style={{
        backgroundColor: prefersReducedMotion ? "#FFF3D9" : backgroundColor,
      }}
      className="relative w-full min-h-screen transition-colors duration-200"
    >
      {children}
    </motion.div>
  );
}
