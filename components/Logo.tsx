import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}

export function LogoBadge({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizeClass =
    size === "sm"
      ? "w-9 h-9"
      : size === "md"
      ? "w-[42px] h-[42px] md:w-[52px] md:h-[52px]"
      : "w-[56px] h-[56px]";

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full bg-[#FFF8EA] border-[4px] border-[#9A4F28] shadow-sm select-none shrink-0 transition-transform hover:rotate-3",
        sizeClass,
        className
      )}
      aria-label="PuppyNest Badge"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full p-0.5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer dashed circular accent */}
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="#C98B4D"
          strokeWidth="1.2"
          strokeDasharray="2.5 2.5"
        />

        {/* Inner solid border */}
        <circle cx="50" cy="50" r="41" stroke="#2A1A12" strokeWidth="1.8" fill="#FFF8EA" />

        {/* Cute poodle mascot face with top-knot and cream muzzle inside badge */}
        <g transform="translate(18, 16)">
          {/* Top-Knot Pom-Pom */}
          <circle cx="32" cy="11" r="7.5" fill="#E9B965" stroke="#2A1A12" strokeWidth="2" />
          <circle cx="28" cy="12" r="4.5" fill="#E9B965" stroke="#2A1A12" strokeWidth="1.5" />
          <circle cx="36" cy="12" r="4.5" fill="#E9B965" stroke="#2A1A12" strokeWidth="1.5" />

          {/* Fluffy scalloped ears */}
          <g>
            <circle cx="10" cy="28" r="7.5" fill="#E9B965" stroke="#2A1A12" strokeWidth="2" />
            <circle cx="9" cy="38" r="6" fill="#E9B965" stroke="#2A1A12" strokeWidth="2" />
            <circle cx="54" cy="28" r="7.5" fill="#E9B965" stroke="#2A1A12" strokeWidth="2" />
            <circle cx="55" cy="38" r="6" fill="#E9B965" stroke="#2A1A12" strokeWidth="2" />
          </g>

          {/* Head Cloud Curls */}
          <circle cx="18" cy="21" r="6.5" fill="#E9B965" stroke="#2A1A12" strokeWidth="1.8" />
          <circle cx="46" cy="21" r="6.5" fill="#E9B965" stroke="#2A1A12" strokeWidth="1.8" />

          {/* Head Base */}
          <circle cx="32" cy="30" r="18" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.2" />

          {/* Blush */}
          <circle cx="20" cy="34" r="3.5" fill="#F2A7A0" opacity="0.9" />
          <circle cx="44" cy="34" r="3.5" fill="#F2A7A0" opacity="0.9" />

          {/* Cream Muzzle */}
          <ellipse cx="32" cy="36" rx="9" ry="6.5" fill="#F6DDA6" stroke="#2A1A12" strokeWidth="1.8" />

          {/* Eyes with Twinkles */}
          <circle cx="25" cy="29" r="3.2" fill="#2A1A12" />
          <circle cx="24" cy="28" r="1.2" fill="#FFFFFF" />

          <circle cx="39" cy="29" r="3.2" fill="#2A1A12" />
          <circle cx="38" cy="28" r="1.2" fill="#FFFFFF" />

          {/* Nose & Smile */}
          <ellipse cx="32" cy="34" rx="2" ry="1.4" fill="#2A1A12" />
          <path
            d="M29.5 37C30.5 38.5 33.5 38.5 34.5 37"
            stroke="#2A1A12"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </g>

        {/* Tiny star / paw accent */}
        <path
          d="M50 82L51 85L54 85L51.5 87L52.5 90L50 88L47.5 90L48.5 87L46 85L49 85Z"
          fill="#9A4F28"
        />
      </svg>
    </div>
  );
}

export function Logo({ className, size = "md", showWordmark = true }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-3 focus:outline-none select-none", className)}
      aria-label="PuppyNest Home"
    >
      <LogoBadge size={size} />
      {showWordmark && (
        <span className="font-display font-black text-[21px] md:text-[25px] tracking-[-0.01em] text-[#2A1A12] leading-none transition-colors group-hover:text-[#9A4F28]">
          PuppyNest
        </span>
      )}
    </Link>
  );
}
