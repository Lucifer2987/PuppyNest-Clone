import React from "react";
import { cn } from "@/lib/utils";

interface WavyUnderlineProps {
  className?: string;
  color?: string;
  strokeWidth?: number;
}

/**
 * Hand-drawn wavy underline SVG for handwritten eyebrows
 * like "every puppy is family" in Screenshot 1.
 */
export function WavyUnderline({
  className,
  color = "#9A4F28",
  strokeWidth = 2.5,
}: WavyUnderlineProps) {
  return (
    <svg
      viewBox="0 0 200 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-3.5 select-none pointer-events-none block", className)}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M2 10C30 3 60 14 90 9C120 4 150 13 180 8C188 6.5 194 7 198 8"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Single Paw Print SVG icon
 */
export function PawIcon({
  className,
  size = 18,
  fill = "currentColor",
}: {
  className?: string;
  size?: number;
  fill?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block select-none", className)}
      aria-hidden="true"
    >
      {/* Main pad */}
      <ellipse cx="12" cy="16" rx="5" ry="4" />
      {/* 4 toe pads */}
      <circle cx="6.5" cy="10.5" r="2.2" />
      <circle cx="10" cy="6.5" r="2.2" />
      <circle cx="14" cy="6.5" r="2.2" />
      <circle cx="17.5" cy="10.5" r="2.2" />
    </svg>
  );
}

/**
 * Animated fading trail of paw prints leading diagonally across sections
 * matching Screenshot 2.
 */
export function PawTrail({ className }: { className?: string }) {
  const steps = [
    { x: 30, y: 15, rot: 32, opacity: 0.15, scale: 0.8 },
    { x: 55, y: 35, rot: 45, opacity: 0.25, scale: 0.9 },
    { x: 80, y: 60, rot: 35, opacity: 0.4, scale: 0.95 },
    { x: 105, y: 88, rot: 50, opacity: 0.6, scale: 1.0 },
    { x: 130, y: 118, rot: 40, opacity: 0.8, scale: 1.05 },
  ];

  return (
    <div
      className={cn("relative pointer-events-none select-none", className)}
      aria-hidden="true"
    >
      {steps.map((s, idx) => (
        <div
          key={idx}
          className="absolute text-[#9A4F28] transition-opacity duration-700"
          style={{
            left: `${s.x}px`,
            bottom: `${s.y}px`,
            transform: `rotate(${s.rot}deg) scale(${s.scale})`,
            opacity: s.opacity,
          }}
        >
          <PawIcon size={16} fill="currentColor" />
        </div>
      ))}
    </div>
  );
}
