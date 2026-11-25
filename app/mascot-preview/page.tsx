"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mascot, MascotPose } from "@/components/Mascot";
import { ChunkyButton } from "@/components/ChunkyButton";

const POSES: { id: MascotPose; title: string; desc: string }[] = [
  { id: "walk", title: "Walk (Moving)", desc: "4-leg swing, body bob, ear & top-knot bounce, tail wag" },
  { id: "idle", title: "Idle (Standing)", desc: "Standing pose with natural eye blink every ~4s & breathing" },
  { id: "sit", title: "Sit (Looking Up)", desc: "Front/three-quarter view sitting on haunches with tilted head" },
  { id: "peek", title: "Peek (Curtain/Border)", desc: "Head, ears, top-knot and paws resting on scalloped edge" },
  { id: "sleep", title: "Sleep (Woven Basket)", desc: "Curled up in woven basket with pillow, gentle breathing & ZZZ bubbles" },
];

const SIZES = [80, 160, 320];

export default function MascotPreviewPage() {
  const [selectedBg, setSelectedBg] = useState<"cream" | "dark">("cream");
  const [simulateWalking, setSimulateWalking] = useState(true);
  const [facing, setFacing] = useState<"left" | "right">("right");

  const bgColor = selectedBg === "cream" ? "#FFF3D9" : "#2B1810";
  const textColor = selectedBg === "cream" ? "#2A1A12" : "#FFF3D9";
  const subtextColor = selectedBg === "cream" ? "#5A4030" : "#D4C3B3";
  const cardBg = selectedBg === "cream" ? "#FFFDF8" : "#1A0E08";
  const borderColor = selectedBg === "cream" ? "#2A1A12" : "#FFF3D9";

  return (
    <div
      style={{ backgroundColor: bgColor }}
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        {/* Navigation & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-black/15 mb-10">
          <div>
            <Link
              href="/"
              className="text-xs font-bold uppercase tracking-wider text-[#9A4F28] hover:underline mb-2 inline-block"
            >
              ← Back to PuppyNest Home
            </Link>
            <h1
              style={{ color: textColor }}
              className="font-display font-black text-3xl sm:text-4xl tracking-tight"
            >
              Mascot Character Studio
            </h1>
            <p style={{ color: subtextColor }} className="text-sm mt-1">
              Fluffy Toy Poodle / Maltipoo original vector artwork in all 5 poses across multiple responsive scales.
            </p>
          </div>

          {/* Interactive Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Background toggle */}
            <div className="flex items-center gap-1 bg-black/10 p-1 rounded-full border border-black/20">
              <button
                type="button"
                onClick={() => setSelectedBg("cream")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedBg === "cream"
                    ? "bg-[#FFF3D9] text-[#2A1A12] shadow-sm"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                Cream (#FFF3D9)
              </button>
              <button
                type="button"
                onClick={() => setSelectedBg("dark")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedBg === "dark"
                    ? "bg-[#2B1810] text-[#FFF3D9] shadow-sm"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                Dark Brown (#2B1810)
              </button>
            </div>

            {/* Facing direction toggle */}
            <ChunkyButton
              onClick={() => setFacing(facing === "right" ? "left" : "right")}
              variant="outline"
              size="sm"
            >
              Facing: {facing.toUpperCase()} 🔄
            </ChunkyButton>

            {/* Walk animation toggle */}
            <ChunkyButton
              onClick={() => setSimulateWalking(!simulateWalking)}
              variant={simulateWalking ? "primary" : "outline"}
              size="sm"
            >
              {simulateWalking ? "Walk Cycle: ON 🐾" : "Walk Cycle: PAUSED ⏸"}
            </ChunkyButton>
          </div>
        </div>

        {/* 5 Poses Showcase */}
        <div className="space-y-16">
          {POSES.map((poseItem) => (
            <div
              key={poseItem.id}
              style={{ backgroundColor: cardBg, borderColor }}
              className="rounded-3xl border-[3px] p-6 sm:p-8 shadow-chunky transition-transform"
            >
              {/* Pose Header */}
              <div className="mb-8 pb-4 border-b border-black/10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <h2
                    style={{ color: textColor }}
                    className="font-display font-black text-2xl tracking-tight"
                  >
                    {poseItem.title}
                  </h2>
                  <p style={{ color: subtextColor }} className="text-xs sm:text-sm mt-0.5">
                    {poseItem.desc}
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-[#9A4F28] uppercase">
                  pose=&quot;{poseItem.id}&quot;
                </span>
              </div>

              {/* Responsive Size Grid: 80px, 160px, 320px */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end justify-items-center">
                {SIZES.map((sizePx) => (
                  <div
                    key={sizePx}
                    className="flex flex-col items-center justify-end w-full"
                  >
                    <div className="flex items-center justify-center p-4 min-h-[140px] md:min-h-[340px]">
                      <Mascot
                        pose={poseItem.id}
                        isWalking={simulateWalking}
                        facing={facing}
                        size={sizePx}
                      />
                    </div>
                    <span
                      style={{ color: subtextColor }}
                      className="font-mono text-xs font-bold mt-2"
                    >
                      {sizePx}px Width
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
