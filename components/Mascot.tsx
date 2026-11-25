"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type MascotPose = "walk" | "idle" | "sit" | "peek" | "sleep" | "standing";

export interface MascotProps {
  pose?: MascotPose;
  variant?: MascotPose | "walking"; // Backward compatibility alias
  isWalking?: boolean;
  isRunning?: boolean;
  isExcited?: boolean;
  facing?: "left" | "right";
  size?: number;
  width?: number | string;
  height?: number | string;
  className?: string;
}

/**
 * NEW Original Mascot for PuppyNest:
 * Fluffy Toy Poodle / Maltipoo puppy in chibi proportions.
 * Features:
 * - Scalloped cloud-like fluffy head with top-knot pom-pom on top
 * - Big fluffy scalloped ears hanging on sides
 * - Lighter cream muzzle patch (#F6DDA6) with small dark nose & w-smile
 * - Large glossy black round eyes with white highlights
 * - Rose blush circles (#F2A7A0)
 * - Brown collar (#7A3E22) with cream heart tag (#FFF1D0)
 * - Plump fluffy body with scalloped fur curves
 * - Raised round pom-pom tail
 * - Thick dark-brown outline (#2A1A12) with flat cartoon sticker look
 *
 * Supported Poses:
 * - walk: walking cycle with 4 animated legs, body bob, ear bounce, tail wag
 * - idle: standing still, natural eye-blinking every 4s, gentle breathing
 * - sit: sitting front/three-quarter view looking up with tilted head
 * - peek: head + paws resting over scalloped edge
 * - sleep: curled up in woven basket with floating "z z z" bubbles
 */
export function Mascot({
  pose = "walk",
  variant,
  isWalking = false,
  isRunning = false,
  isExcited = false,
  facing = "right",
  size,
  width,
  height,
  className,
}: MascotProps) {
  // Normalize pose prop
  let activePose: "walk" | "idle" | "sit" | "peek" | "sleep" = "walk";
  const rawPose = pose || (variant === "walking" ? "walk" : variant) || "walk";
  if (rawPose === "standing") {
    activePose = "idle";
  } else if (
    rawPose === "walk" ||
    rawPose === "idle" ||
    rawPose === "sit" ||
    rawPose === "peek" ||
    rawPose === "sleep"
  ) {
    activePose = rawPose;
  }

  // Determine tail wag state class
  let tailClass = "mascot-tail-idle";
  if (activePose === "sleep" || activePose === "peek") {
    tailClass = "";
  } else if (isExcited) {
    tailClass = "mascot-tail-excited";
  } else if (activePose === "sit") {
    tailClass = "mascot-tail-sit";
  } else if (activePose === "walk" && (isWalking || isRunning)) {
    tailClass = isRunning ? "mascot-tail-run" : "mascot-tail-walk";
  } else {
    tailClass = "mascot-tail-idle";
  }

  // Dimension scaling
  const baseDim = size || (width ? Number(width) : 150);
  const compWidth = width || baseDim;
  const compHeight = height || Math.round(baseDim * 0.9);

  const isFlipped = facing === "left";

  // ==========================================
  // 1. PEEK POSE: Head, top-knot, ears & paws resting on edge
  // ==========================================
  if (activePose === "peek") {
    return (
      <div
        className={cn("relative inline-block select-none", className)}
        style={{
          transform: isFlipped ? "scaleX(-1)" : undefined,
          width: compWidth,
          height: compHeight,
        }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 170 145"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          {/* Top-Knot Pom-Pom */}
          <g>
            <circle cx="85" cy="22" r="14" fill="#E9B965" stroke="#2A1A12" strokeWidth="3" />
            <circle cx="76" cy="24" r="8" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.5" />
            <circle cx="94" cy="24" r="8" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.5" />
            <circle cx="85" cy="14" r="8" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.5" />
          </g>

          {/* Scalloped Cloud Head Base */}
          <g>
            {/* Outer Fluffy Bumps */}
            <circle cx="58" cy="48" r="15" fill="#E9B965" stroke="#2A1A12" strokeWidth="3" />
            <circle cx="112" cy="48" r="15" fill="#E9B965" stroke="#2A1A12" strokeWidth="3" />
            <circle cx="48" cy="68" r="15" fill="#E9B965" stroke="#2A1A12" strokeWidth="3" />
            <circle cx="122" cy="68" r="15" fill="#E9B965" stroke="#2A1A12" strokeWidth="3" />
            <circle cx="56" cy="90" r="15" fill="#E9B965" stroke="#2A1A12" strokeWidth="3" />
            <circle cx="114" cy="90" r="15" fill="#E9B965" stroke="#2A1A12" strokeWidth="3" />

            {/* Central Head Fill */}
            <circle cx="85" cy="72" r="38" fill="#E9B965" stroke="#2A1A12" strokeWidth="3" />
          </g>

          {/* Fluffy Scalloped Left Ear */}
          <g>
            <path
              d="M48 64 C30 64, 20 80, 22 98 C24 114, 38 122, 50 114 C58 108, 60 92, 58 78 Z"
              fill="#E9B965"
              stroke="#2A1A12"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* Ear inner shading */}
            <path
              d="M34 82 C30 92, 34 104, 42 108 C46 102, 46 92, 44 84 Z"
              fill="#D99A45"
            />
            {/* Scallop bumps on ear edge */}
            <circle cx="22" cy="85" r="7" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.5" />
            <circle cx="26" cy="102" r="8" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.5" />
            <circle cx="38" cy="116" r="7.5" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.5" />
          </g>

          {/* Fluffy Scalloped Right Ear */}
          <g>
            <path
              d="M122 64 C140 64, 150 80, 148 98 C146 114, 132 122, 120 114 C112 108, 110 92, 112 78 Z"
              fill="#E9B965"
              stroke="#2A1A12"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path
              d="M136 82 C140 92, 136 104, 128 108 C124 102, 124 92, 126 84 Z"
              fill="#D99A45"
            />
            <circle cx="148" cy="85" r="7" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.5" />
            <circle cx="144" cy="102" r="8" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.5" />
            <circle cx="132" cy="116" r="7.5" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.5" />
          </g>

          {/* Cheeks Blush */}
          <circle cx="58" cy="80" r="8.5" fill="#F2A7A0" opacity="0.95" />
          <circle cx="112" cy="80" r="8.5" fill="#F2A7A0" opacity="0.95" />

          {/* Cream Muzzle Patch */}
          <ellipse cx="85" cy="82" rx="20" ry="14" fill="#F6DDA6" stroke="#2A1A12" strokeWidth="2.5" />

          {/* Big Glossy Eyes with Twin Highlights */}
          <g>
            {/* Left Eye */}
            <circle cx="68" cy="65" r="7.5" fill="#2A1A12" />
            <circle cx="66" cy="63" r="2.8" fill="#FFFFFF" />
            <circle cx="70.5" cy="67.5" r="1.3" fill="#FFFFFF" />

            {/* Right Eye */}
            <circle cx="102" cy="65" r="7.5" fill="#2A1A12" />
            <circle cx="100" cy="63" r="2.8" fill="#FFFFFF" />
            <circle cx="104.5" cy="67.5" r="1.3" fill="#FFFFFF" />
          </g>

          {/* Dark Rounded Triangle Nose */}
          <path
            d="M80 77 C80 75, 82 74, 85 74 C88 74, 90 75, 90 77 C90 80, 87 83, 85 83 C83 83, 80 80, 80 77 Z"
            fill="#2A1A12"
          />

          {/* W-Smile Mouth */}
          <path
            d="M77 84 C79 87, 82 87, 85 85 C88 87, 91 87, 93 84"
            stroke="#2A1A12"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Brown Collar with Cream Heart Tag */}
          <path
            d="M58 108 C68 114, 102 114, 112 108"
            stroke="#7A3E22"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Heart Tag */}
          <path
            d="M85 119 C85 119, 80 114, 80 110 C80 107.5, 82.5 106, 85 108 C87.5 106, 90 107.5, 90 110 C90 114, 85 119, 85 119 Z"
            fill="#FFF1D0"
            stroke="#2A1A12"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Front Paws resting on the bottom edge */}
          <g>
            {/* Left Paw */}
            <rect x="48" y="118" width="22" height="18" rx="8" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
            <line x1="55" y1="124" x2="55" y2="133" stroke="#2A1A12" strokeWidth="2" strokeLinecap="round" />
            <line x1="63" y1="124" x2="63" y2="133" stroke="#2A1A12" strokeWidth="2" strokeLinecap="round" />

            {/* Right Paw */}
            <rect x="100" y="118" width="22" height="18" rx="8" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
            <line x1="107" y1="124" x2="107" y2="133" stroke="#2A1A12" strokeWidth="2" strokeLinecap="round" />
            <line x1="115" y1="124" x2="115" y2="133" stroke="#2A1A12" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    );
  }

  // ==========================================
  // 2. SIT POSE: Front view, sitting looking up with tilted head
  // ==========================================
  if (activePose === "sit") {
    return (
      <div
        className={cn("relative inline-block select-none", className)}
        style={{
          transform: isFlipped ? "scaleX(-1)" : undefined,
          width: compWidth,
          height: compHeight,
        }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 170 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          {/* Ground Shadow */}
          <ellipse cx="85" cy="150" rx="48" ry="7" fill="#2A1A12" opacity="0.16" />

          {/* Pom-Pom Tail peeking up */}
          <g
            className={cn("mascot-tail", tailClass)}
            style={{ transformOrigin: "128px 115px", transformBox: "fill-box" }}
          >
            <path d="M118 126 C126 122, 130 114, 128 106" stroke="#2A1A12" strokeWidth="3" strokeLinecap="round" />
            <circle cx="132" cy="100" r="11" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.6" />
            <circle cx="126" cy="96" r="6" fill="#E9B965" stroke="#2A1A12" strokeWidth="2" />
            <circle cx="138" cy="98" r="6" fill="#E9B965" stroke="#2A1A12" strokeWidth="2" />
          </g>

          {/* Hind Legs sitting on ground */}
          <ellipse cx="50" cy="138" rx="16" ry="10" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
          <ellipse cx="120" cy="138" rx="16" ry="10" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />

          {/* Plump Body with Scalloped Chest */}
          <path
            d="M58 85 C48 105, 46 132, 60 144 C72 147, 98 147, 110 144 C124 132, 122 105, 112 85 Z"
            fill="#E9B965"
            stroke="#2A1A12"
            strokeWidth="3"
          />

          {/* Two Front Legs sitting straight down */}
          <g>
            <rect x="66" y="104" width="14" height="42" rx="7" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.6" />
            <line x1="73" y1="138" x2="73" y2="144" stroke="#2A1A12" strokeWidth="1.8" strokeLinecap="round" />

            <rect x="90" y="104" width="14" height="42" rx="7" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.6" />
            <line x1="97" y1="138" x2="97" y2="144" stroke="#2A1A12" strokeWidth="1.8" strokeLinecap="round" />
          </g>

          {/* Brown Collar & Cream Heart Tag */}
          <path
            d="M60 86 C72 94, 98 94, 110 86"
            stroke="#7A3E22"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M85 99 C85 99, 80 94, 80 91 C80 88.5, 82.5 87, 85 89 C87.5 87, 90 88.5, 90 91 C90 94, 85 99, 85 99 Z"
            fill="#FFF1D0"
            stroke="#2A1A12"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Head Tilted Slightly, Looking Up */}
          <g transform="translate(0, -6)">
            {/* Top-Knot Pom-Pom */}
            <circle cx="85" cy="22" r="14" fill="#E9B965" stroke="#2A1A12" strokeWidth="3" />
            <circle cx="76" cy="24" r="8" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.5" />
            <circle cx="94" cy="24" r="8" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.5" />

            {/* Cloud Head Base */}
            <circle cx="58" cy="48" r="14" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
            <circle cx="112" cy="48" r="14" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
            <circle cx="48" cy="68" r="14" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
            <circle cx="122" cy="68" r="14" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
            <circle cx="85" cy="66" r="35" fill="#E9B965" stroke="#2A1A12" strokeWidth="3" />

            {/* Scalloped Ears */}
            <path
              d="M48 58 C30 58, 22 74, 24 92 C26 106, 38 112, 50 106 Z"
              fill="#E9B965"
              stroke="#2A1A12"
              strokeWidth="2.8"
            />
            <path
              d="M122 58 C140 58, 148 74, 146 92 C144 106, 132 112, 120 106 Z"
              fill="#E9B965"
              stroke="#2A1A12"
              strokeWidth="2.8"
            />

            {/* Blush */}
            <circle cx="60" cy="74" r="8" fill="#F2A7A0" opacity="0.95" />
            <circle cx="110" cy="74" r="8" fill="#F2A7A0" opacity="0.95" />

            {/* Cream Muzzle */}
            <ellipse cx="85" cy="75" rx="19" ry="13" fill="#F6DDA6" stroke="#2A1A12" strokeWidth="2.4" />

            {/* Eyes looking up with big highlights */}
            <circle cx="68" cy="59" r="7.5" fill="#2A1A12" />
            <circle cx="70" cy="56" r="3" fill="#FFFFFF" />
            <circle cx="66" cy="61" r="1.3" fill="#FFFFFF" />

            <circle cx="102" cy="59" r="7.5" fill="#2A1A12" />
            <circle cx="104" cy="56" r="3" fill="#FFFFFF" />
            <circle cx="100" cy="61" r="1.3" fill="#FFFFFF" />

            {/* Nose & Smile */}
            <path
              d="M81 70 C81 68, 83 67, 85 67 C87 67, 89 68, 89 70 C89 73, 87 75, 85 75 C83 75, 81 73, 81 70 Z"
              fill="#2A1A12"
            />
            <path
              d="M78 77 C80 80, 83 80, 85 78 C87 80, 90 80, 92 77"
              stroke="#2A1A12"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
    );
  }

  // ==========================================
  // 3. SLEEP POSE: Curled in woven basket with zzz bubbles
  // ==========================================
  if (activePose === "sleep") {
    return (
      <div
        className={cn("relative inline-block select-none mascot-sleeping", className)}
        style={{
          width: compWidth,
          height: compHeight,
        }}
        aria-hidden="true"
      >
        {/* Floating ZZZ bubbles */}
        <div className="absolute -top-6 right-6 font-handwriting font-black text-xl text-[#F0B955] zzz-1 select-none pointer-events-none">
          z
        </div>
        <div className="absolute -top-10 right-2 font-handwriting font-black text-2xl text-[#C98B4D] zzz-2 select-none pointer-events-none">
          Z
        </div>
        <div className="absolute -top-16 -right-2 font-handwriting font-black text-3xl text-[#FFF3D9] zzz-3 select-none pointer-events-none">
          Z
        </div>

        <svg
          viewBox="0 0 180 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          {/* Ground shadow */}
          <ellipse cx="90" cy="142" rx="65" ry="8" fill="#1A0E08" opacity="0.4" />

          {/* Woven Basket Outer Base */}
          <path
            d="M30 95 C26 122, 36 138, 90 138 C144 138, 154 122, 150 95 Z"
            fill="#8B5226"
            stroke="#2A1A12"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Basket weave criss-cross texture */}
          <g stroke="#5A3516" strokeWidth="1.8" opacity="0.65">
            <path d="M45 98 L60 136 M75 96 L90 137 M105 96 L120 136 M135 98 L144 125" />
            <path d="M135 98 L120 136 M105 96 L90 137 M75 96 L60 136 M45 98 L36 125" />
          </g>

          {/* Soft Cream Cushion Pillow inside */}
          <ellipse cx="90" cy="98" rx="55" ry="18" fill="#FFF1D0" stroke="#2A1A12" strokeWidth="2.5" />

          {/* Curled Sleeping Puppy (breathing animation) */}
          <g className="breathe">
            {/* Curled Scalloped Torso */}
            <path
              d="M55 96 C50 78, 68 62, 95 62 C122 62, 136 76, 130 96 C124 106, 65 106, 55 96 Z"
              fill="#E9B965"
              stroke="#2A1A12"
              strokeWidth="2.8"
            />

            {/* Pom-Pom Tail */}
            <circle cx="132" cy="85" r="10" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.5" />

            {/* Fluffy Sleeping Head with Top-Knot */}
            <circle cx="68" cy="84" r="23" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
            <circle cx="68" cy="65" r="10" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.2" />

            {/* Scalloped Floppy Ear draped */}
            <path
              d="M48 76 C40 82, 40 98, 46 104 C52 108, 58 104, 60 96 Z"
              fill="#E9B965"
              stroke="#2A1A12"
              strokeWidth="2.5"
            />

            {/* Cream Muzzle */}
            <ellipse cx="74" cy="89" rx="12" ry="8" fill="#F6DDA6" stroke="#2A1A12" strokeWidth="2" />

            {/* Closed Curved Arc Sleeping Eyes ◠ */}
            <path
              d="M58 84 C60 88, 65 88, 67 84"
              stroke="#2A1A12"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            {/* Blush */}
            <circle cx="58" cy="91" r="5" fill="#F2A7A0" opacity="0.9" />

            {/* Nose */}
            <ellipse cx="74" cy="87" rx="3.5" ry="2.5" fill="#2A1A12" />

            {/* Two Front Paws tucked under chin */}
            <ellipse cx="74" cy="98" rx="8" ry="5.5" fill="#E9B965" stroke="#2A1A12" strokeWidth="2" />
          </g>

          {/* Front Basket Rim */}
          <path
            d="M26 95 C26 95, 56 102, 90 102 C124 102, 154 95, 154 95"
            stroke="#2A1A12"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  // ==========================================
  // 4. WALK & IDLE POSES: Side/Three-quarter view matching reference exactly
  // ==========================================
  const shouldAnimateWalk = (isWalking || isRunning) && activePose === "walk";
  const isIdle = activePose === "idle" || (!isWalking && !isRunning && activePose === "walk");

  return (
    <div
      className={cn(
        "relative inline-block select-none",
        isRunning ? "mascot-running" : shouldAnimateWalk && "mascot-walking",
        isIdle && "mascot-idle",
        className
      )}
      style={{
        transform: isFlipped ? "scaleX(-1)" : undefined,
        width: compWidth,
        height: compHeight,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 200 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        {/* Ground shadow */}
        <ellipse cx="105" cy="154" rx="65" ry="8" fill="#2A1A12" opacity="0.16" />

        {/* 1. BACKGROUND LEGS (left side) */}
        {/* Back-left leg (leg-swing-b) */}
        <g className={shouldAnimateWalk ? "leg-swing-b" : ""} style={{ transformOrigin: "140px 115px" }}>
          <rect x="135" y="115" width="15" height="35" rx="7.5" fill="#D99A45" stroke="#2A1A12" strokeWidth="2.8" />
          <line x1="142" y1="144" x2="142" y2="150" stroke="#2A1A12" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* Front-left leg (leg-swing-b) */}
        <g className={shouldAnimateWalk ? "leg-swing-b" : ""} style={{ transformOrigin: "85px 115px" }}>
          <rect x="80" y="115" width="15" height="35" rx="7.5" fill="#D99A45" stroke="#2A1A12" strokeWidth="2.8" />
          <line x1="87" y1="144" x2="87" y2="150" stroke="#2A1A12" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* 2. POM-POM TAIL (raised up behind body with scalloped edges) */}
        <g
          className={cn("mascot-tail", tailClass)}
          style={{ transformOrigin: "148px 105px", transformBox: "fill-box" }}
        >
          {/* Stem */}
          <path d="M145 106 C150 96, 154 86, 152 78" stroke="#2A1A12" strokeWidth="3.2" strokeLinecap="round" />
          {/* Scalloped Pom-Pom Ball */}
          <circle cx="154" cy="74" r="14" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
          <circle cx="145" cy="70" r="7" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.4" />
          <circle cx="163" cy="70" r="7" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.4" />
          <circle cx="154" cy="62" r="7" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.4" />
          <circle cx="148" cy="82" r="7" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.4" />
          <circle cx="160" cy="82" r="7" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.4" />
        </g>

        {/* 3. PLUMP FLUFFY BODY (scalloped cloud curves) */}
        <g className={cn(shouldAnimateWalk && "body-bob", isIdle && "breathe-idle")}>
          <path
            d="M68 95 C62 90, 68 118, 76 128 C88 132, 142 134, 152 118 C158 108, 156 86, 138 82 C116 78, 88 84, 68 95 Z"
            fill="#E9B965"
            stroke="#2A1A12"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />

          {/* Scalloped fur bumps along bottom & rear of body */}
          <circle cx="86" cy="126" r="9" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
          <circle cx="102" cy="128" r="9.5" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
          <circle cx="118" cy="128" r="9.5" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
          <circle cx="134" cy="126" r="9" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
          <circle cx="148" cy="116" r="8.5" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
          <circle cx="152" cy="102" r="8.5" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
        </g>

        {/* 4. FOREGROUND LEGS (right side) */}
        {/* Back-right leg (leg-swing-a) with thigh curve */}
        <g className={shouldAnimateWalk ? "leg-swing-a" : ""} style={{ transformOrigin: "128px 115px" }}>
          <rect x="122" y="115" width="16" height="36" rx="8" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
          <line x1="130" y1="145" x2="130" y2="151" stroke="#2A1A12" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* Front-right leg (leg-swing-a) straight down */}
        <g className={shouldAnimateWalk ? "leg-swing-a" : ""} style={{ transformOrigin: "72px 115px" }}>
          <rect x="65" y="115" width="16" height="36" rx="8" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
          <line x1="73" y1="145" x2="73" y2="151" stroke="#2A1A12" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* 5. COLLAR (#7A3E22) & CREAM HEART TAG (#FFF1D0) */}
        <g className={cn(shouldAnimateWalk && "body-bob", isIdle && "breathe-idle")}>
          {/* Curved brown collar */}
          <path
            d="M48 94 C54 100, 84 102, 92 88"
            stroke="#7A3E22"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M48 94 C54 100, 84 102, 92 88"
            stroke="#2A1A12"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Heart Tag in Center */}
          <path
            d="M68 107 C68 107, 63 102, 63 99 C63 96.5, 65.5 95, 68 97 C70.5 95, 73 96.5, 73 99 C73 102, 68 107, 68 107 Z"
            fill="#FFF1D0"
            stroke="#2A1A12"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>

        {/* 6. HEAD & FACIAL FEATURES GROUP (bobs with walk) */}
        <g className={cn(shouldAnimateWalk && "body-bob", isIdle && "breathe-idle")}>
          {/* Background ear (left ear) */}
          <g className={shouldAnimateWalk ? "ear-bounce" : ""} style={{ transformOrigin: "42px 55px" }}>
            <circle cx="34" cy="62" r="14" fill="#D99A45" stroke="#2A1A12" strokeWidth="2.8" />
            <circle cx="28" cy="74" r="10" fill="#D99A45" stroke="#2A1A12" strokeWidth="2.8" />
          </g>

          {/* Round Cloud Head with Scalloped Curls */}
          <g>
            {/* Scalloped curls surrounding the head */}
            <circle cx="48" cy="38" r="14" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
            <circle cx="68" cy="28" r="14" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
            <circle cx="90" cy="32" r="14" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
            <circle cx="104" cy="46" r="14" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
            <circle cx="106" cy="68" r="14" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
            <circle cx="94" cy="84" r="14" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
            <circle cx="74" cy="88" r="14" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
            <circle cx="48" cy="80" r="14" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
            <circle cx="38" cy="60" r="14" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />

            {/* Main Central Head Circle */}
            <circle cx="70" cy="58" r="34" fill="#E9B965" stroke="#2A1A12" strokeWidth="3.2" />
          </g>

          {/* Top-Knot Pom-Pom on Head */}
          <g className={shouldAnimateWalk ? "topknot-bounce" : ""} style={{ transformOrigin: "66px 20px" }}>
            <circle cx="66" cy="22" r="14" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
            <circle cx="58" cy="23" r="8" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.4" />
            <circle cx="74" cy="23" r="8" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.4" />
            <circle cx="66" cy="15" r="7" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.4" />
          </g>

          {/* Fluffy Foreground Ear (right ear) */}
          <g className={shouldAnimateWalk ? "ear-bounce" : ""} style={{ transformOrigin: "102px 55px" }}>
            <circle cx="106" cy="64" r="16" fill="#E9B965" stroke="#2A1A12" strokeWidth="3" />
            <circle cx="104" cy="80" r="12" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
            <circle cx="94" cy="90" r="9" fill="#E9B965" stroke="#2A1A12" strokeWidth="2.8" />
          </g>

          {/* Rose Blush on Cheeks */}
          <circle cx="46" cy="67" r="7.5" fill="#F2A7A0" opacity="0.95" />
          <circle cx="94" cy="67" r="7.5" fill="#F2A7A0" opacity="0.95" />

          {/* Cream Muzzle Patch */}
          <ellipse cx="68" cy="69" rx="17" ry="12" fill="#F6DDA6" stroke="#2A1A12" strokeWidth="2.5" />

          {/* Big Glossy Eyes with Highlights */}
          <g className={isIdle ? "mascot-eyes" : ""}>
            {/* Left Eye */}
            <circle cx="56" cy="55" r="6.5" fill="#2A1A12" />
            <circle cx="54.5" cy="53.5" r="2.4" fill="#FFFFFF" />
            <circle cx="58" cy="57" r="1.1" fill="#FFFFFF" />

            {/* Right Eye */}
            <circle cx="82" cy="55" r="6.5" fill="#2A1A12" />
            <circle cx="80.5" cy="53.5" r="2.4" fill="#FFFFFF" />
            <circle cx="84" cy="57" r="1.1" fill="#FFFFFF" />
          </g>

          {/* Dark Nose */}
          <path
            d="M64 64 C64 62, 66 61, 68 61 C70 61, 72 62, 72 64 C72 67, 70 69, 68 69 C66 69, 64 67, 64 64 Z"
            fill="#2A1A12"
          />

          {/* W-Smile Mouth */}
          <path
            d="M62 71 C64 74, 66 74, 68 72 C70 74, 72 74, 74 71"
            stroke="#2A1A12"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
