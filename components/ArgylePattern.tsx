import React from "react";
import { cn } from "@/lib/utils";

interface ArgylePatternProps {
  className?: string;
  opacity?: number;
  lineColor?: string;
  size?: number; // Size of diamond grid in px
}

/**
 * Argyle / diamond lattice line pattern in thin brown lines at subtle opacity (~8%)
 * used at section edges, hero lower divider, and footer.
 */
export function ArgylePattern({
  className,
  opacity = 0.08,
  lineColor = "#2A1A12",
  size = 48,
}: ArgylePatternProps) {
  const patternId = `argyle-grid-${size}`;

  return (
    <div
      className={cn("absolute inset-0 pointer-events-none select-none overflow-hidden", className)}
      aria-hidden="true"
      style={{ opacity }}
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={patternId}
            width={size}
            height={size}
            patternUnits="userSpaceOnUse"
          >
            {/* Diagonal lines forming diamond lattice */}
            <path
              d={`M0 0L${size} ${size} M${size} 0L0 ${size}`}
              stroke={lineColor}
              strokeWidth="1"
              fill="none"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}
