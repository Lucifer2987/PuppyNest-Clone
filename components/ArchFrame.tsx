"use client";

import React from "react";
import Image from "next/image";
import { motion, MotionValue, MotionStyle, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ArchFrameProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  speechTag?: string;
  className?: string;
  priority?: boolean;
  // Scroll-linked motion values
  y?: MotionValue<number>;
  rotate?: MotionValue<number>;
  scale?: MotionValue<number>;
  tagOpacity?: MotionValue<number>;
  // Idle bob & Load-in
  isIdle?: boolean;
  idleClass?: string;
  loadInDelay?: number;
  style?: MotionStyle;
}

/**
 * Arch-shaped puppy photo frame with thick 2.5px dark outline
 * matching Screenshot 1, with scroll-driven pop down/up transforms.
 */
export function ArchFrame({
  src,
  alt,
  width = 150,
  height = 190,
  speechTag,
  className,
  priority = false,
  y,
  rotate,
  scale,
  tagOpacity,
  isIdle = false,
  idleClass,
  loadInDelay = 0,
  style,
}: ArchFrameProps) {
  const prefersReducedMotion = useReducedMotion();

  // If reduced motion is enabled, disable scroll transforms
  const motionStyle: MotionStyle = prefersReducedMotion
    ? { ...(style as MotionStyle) }
    : {
        ...(style as MotionStyle),
        y,
        rotate,
        scale,
      };

  const initialY = typeof height === "number" ? height + 30 : 220;

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { y: initialY, opacity: 0 }}
      animate={prefersReducedMotion ? {} : { y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 140,
        damping: 18,
        delay: loadInDelay,
      }}
      style={motionStyle}
      className={cn(
        "relative flex flex-col items-center select-none will-change-transform",
        className
      )}
    >
      {/* Speech label tag if present (e.g. "Maltipoo") */}
      {speechTag && (
        <motion.div
          style={{
            opacity: prefersReducedMotion ? 1 : tagOpacity,
          }}
          className={cn(
            "absolute -top-8 z-20 pointer-events-none transition-transform duration-200",
            isIdle && !prefersReducedMotion && "speech-tag-wiggle"
          )}
        >
          <div className="relative speech-bubble-bottom bg-[#FFF9EE] text-[#2A1A12] border-2 border-[#2A1A12] px-3 py-0.5 rounded-xl font-handwriting text-[13px] font-bold shadow-sticker tracking-wide whitespace-nowrap">
            {speechTag}
          </div>
        </motion.div>
      )}

      {/* Frame body with subtle idle bob at scroll 0 */}
      <div className={cn("relative", isIdle && !prefersReducedMotion && idleClass)}>
        <div
          className="relative overflow-hidden rounded-t-[100px] border-[2.5px] border-[#2A1A12] bg-[#EFE1C9] shadow-sm transition-transform duration-300 ease-out hover:-translate-y-2 hover:shadow-md cursor-pointer group"
          style={{
            width: typeof width === "number" ? `${width}px` : width,
            height: typeof height === "number" ? `${height}px` : height,
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 120px, 180px"
            priority={priority}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {/* Subtle inner top glare overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 pointer-events-none" />
        </div>
      </div>
    </motion.div>
  );
}
