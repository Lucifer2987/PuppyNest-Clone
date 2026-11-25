"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ChunkyButton } from "@/components/ChunkyButton";
import { WavyUnderline } from "@/components/WavyUnderline";
import { ScrollRevealText, ScrollFadeUp } from "@/components/ScrollRevealText";
import { PawIcon } from "@/components/PawTrail";

const POLAROIDS = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80",
    caption: "Max first day in his Palm villa! 🌴🐾",
    rot: -3,
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?auto=format&fit=crop&w=600&q=80",
    caption: "Chloe admiring Burj Khalifa 🏙️💖",
    rot: 2,
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=600&q=80",
    caption: "Coco snug in luxury carrier 🚗💕",
    rot: -2,
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80",
    caption: "Bella's first garden stroll 🌼🐶",
    rot: 4,
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&w=600&q=80",
    caption: "Mimi enjoying weekend cuddles 🛋️🤍",
    rot: -4,
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80",
    caption: "Oliver fluffy as a marshmallow ☁️✨",
    rot: 3,
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80",
    caption: "Leo king of the cushions 👑🧸",
    rot: -1,
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80",
    caption: "Waffles sunny balcony nap ☀️🐾",
    rot: 2,
  },
];

export function PolaroidWall() {
  const sectionRef = useRef<HTMLElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(wallRef, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      ref={sectionRef}
      data-mascot="families"
      className="relative w-full py-20 sm:py-28 overflow-hidden bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Header & Testimonial Speech Bubble */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          {/* Outlined cream heading on left */}
          <div className="lg:col-span-6">
            <div className="inline-flex flex-col items-start mb-2">
              <span className="font-handwriting text-2xl text-[#FFF3D9] font-bold">
                heartwarming moments
              </span>
              <WavyUnderline className="w-40 mt-0.5" color="#FFF3D9" />
            </div>
            <ScrollRevealText
              as="h2"
              className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#FFF3D9] tracking-tight drop-shadow-sm"
            >
              {"Happy families\n& puppies"}
            </ScrollRevealText>
          </div>

          {/* Speech-bubble Testimonial on right */}
          <div className="lg:col-span-6">
            <ScrollFadeUp
              delay={0.2}
              className="relative bg-[#FFFDF8] rounded-3xl border-[3px] border-[#2A1A12] p-6 sm:p-7 shadow-chunky speech-bubble-bottom"
            >
              <p className="font-display text-base sm:text-lg text-[#2A1A12] font-extrabold italic leading-relaxed">
                &ldquo;PuppyNest made welcoming our teacup Maltipoo so seamless. From the microchip confirmation in Seoul to door delivery in Palm Jumeirah, everything was pure luxury!&rdquo;
              </p>
              <div className="mt-4 pt-3 border-t border-[#2A1A12]/15 flex items-center justify-between text-xs font-bold">
                <span className="text-[#2A1A12]">The Al Mansoori Family</span>
                <span className="text-[#C8502A]">Palm Jumeirah, Dubai</span>
              </div>
            </ScrollFadeUp>
          </div>
        </div>

        {/* THE WOODEN WALL WITH TAPED POLAROIDS */}
        <div
          ref={wallRef}
          className="relative rounded-[36px] border-[4px] border-[#2A1A12] bg-[#753E1E] p-6 sm:p-10 shadow-chunky-lg overflow-hidden"
        >
          {/* Vertical wood planks pattern */}
          <div className="absolute inset-0 opacity-20 pointer-events-none flex justify-between">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-[1.5px] h-full bg-black/60" />
            ))}
          </div>

          {/* STREET LAMP with warm yellow glow on left */}
          <div className="hidden lg:block absolute left-4 top-6 z-20 pointer-events-none select-none">
            {/* Warm glow halo */}
            <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-[#F0B955]/30 blur-xl animate-pulse" />

            <svg width="45" height="120" viewBox="0 0 45 120" fill="none">
              {/* Lamp head */}
              <path d="M10 20L22 5L34 20L30 35H14L10 20Z" fill="#2A1A12" stroke="#2A1A12" strokeWidth="2" />
              <polygon points="15,22 29,22 27,33 17,33" fill="#F0B955" opacity="0.9" />
              {/* Curved lamp arm */}
              <path d="M22 35V115 M15 115H30" stroke="#2A1A12" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>

          {/* Small Orange Arched Door on the wall */}
          <div className="hidden lg:block absolute right-6 bottom-4 z-10 pointer-events-none">
            <div className="w-16 h-28 rounded-t-[32px] border-2 border-[#2A1A12] bg-[#C8502A] shadow-sm flex flex-col justify-between p-1.5">
              <div className="w-full h-1/2 border border-dashed border-black/20 rounded-t-[26px]" />
              <div className="w-2 h-2 rounded-full bg-[#F0B955] border border-[#2A1A12] self-end mr-1" />
            </div>
          </div>

          {/* 8 POLAROIDS (2 rows of 4 on desktop, 2 cols on mobile) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 relative z-20">
            {POLAROIDS.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={
                  prefersReducedMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 40 }
                }
                animate={
                  isInView
                    ? { opacity: 1, y: 0 }
                    : prefersReducedMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 40 }
                }
                transition={{
                  duration: 0.55,
                  ease: [0.175, 0.885, 0.32, 1.2],
                  delay: idx * 0.07,
                }}
                whileHover={{
                  scale: 1.07,
                  rotate: 0,
                  zIndex: 30,
                  transition: { duration: 0.2 },
                }}
                style={{ rotate: item.rot }}
                className="bg-white rounded-xl border-[2.5px] border-[#2A1A12] p-2.5 pb-3.5 shadow-chunky relative group cursor-pointer transition-shadow"
              >
                {/* Washi Tape piece at top corner */}
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-10 h-4 bg-[#FFF3D9]/90 border border-[#2A1A12]/30 shadow-xs transform -rotate-2 select-none pointer-events-none" />

                <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200 mb-2 bg-gray-100">
                  <Image
                    src={item.url}
                    alt={item.caption}
                    fill
                    sizes="(max-width: 768px) 50vw, 250px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <p className="font-handwriting text-xs text-[#2A1A12] font-bold text-center leading-tight">
                  {item.caption}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Action Button */}
          <div className="mt-10 text-center relative z-20">
            <ChunkyButton href="/happy-families" variant="gold" size="lg">
              See every happy family
            </ChunkyButton>
          </div>
        </div>


      </div>
    </section>
  );
}
