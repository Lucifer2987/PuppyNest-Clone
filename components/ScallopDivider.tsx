import React from "react";
import { cn } from "@/lib/utils";

interface ScallopDividerProps {
  className?: string;
  fillColor?: string; // Color of the scallops (default cream #FFF3D9)
  strokeColor?: string; // Color of the outer outline (default dark brown #2A1A12)
  dashColor?: string; // Color of inner dashed line
  height?: number; // Height in px
  flip?: boolean;
}

/**
 * Scalloped border: A row of semicircle bumps with a dashed inner stroke
 * matching Screenshot 1: 3px #2A1A12 outline, cream fill, dashed inner stroke (#C98B4D at 60%), bump width ~64px.
 */
export function ScallopDivider({
  className,
  fillColor = "#FFF3D9",
  strokeColor = "#2A1A12",
  dashColor = "rgba(201, 139, 77, 0.6)",
  flip = false,
}: ScallopDividerProps) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden leading-none select-none relative z-10 pointer-events-none",
        flip && "rotate-180",
        className
      )}
      style={{ height: "42px" }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full block"
        viewBox="0 0 1440 42"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="scallop-pattern"
            x="0"
            y="0"
            width="64"
            height="42"
            patternUnits="userSpaceOnUse"
          >
            {/* Base filled shape going down */}
            <path
              d="M0 42V18C10.6 3 21.3 0 32 0C42.7 0 53.4 3 64 18V42H0Z"
              fill={fillColor}
            />

            {/* Inner dashed line following the arc (dashed stroke #C98B4D at 60%) */}
            <path
              d="M7 22C15 10 23.5 7 32 7C40.5 7 49 10 57 22"
              stroke={dashColor}
              strokeWidth="1.5"
              strokeDasharray="3 3"
              fill="none"
            />

            {/* Outer solid rim (3px #2A1A12 outline) */}
            <path
              d="M0 18C10.6 3 21.3 0 32 0C42.7 0 53.4 3 64 18"
              stroke={strokeColor}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </pattern>
        </defs>

        <rect width="1440" height="42" fill="url(#scallop-pattern)" />
      </svg>
    </div>
  );
}
