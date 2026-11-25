"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ChunkyButton } from "@/components/ChunkyButton";
import { WavyUnderline } from "@/components/WavyUnderline";
import { ScrollRevealText, ScrollFadeUp } from "@/components/ScrollRevealText";
import { cn } from "@/lib/utils";

export function TwoWaysSignpost() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Airplane flight path progress (0% to 100%)
  const planeProgress = useTransform(scrollYProgress, [0.2, 0.75], [0, 1]);

  // Plane positions along the curved arc
  // Parametric curve: x from 40 to 320, y from 120 to 30 to 110
  const planeX = useTransform(planeProgress, (v) => 40 + v * 280);
  const planeY = useTransform(planeProgress, (v) => 120 - Math.sin(v * Math.PI) * 90);
  const planeRot = useTransform(planeProgress, (v) => -25 + v * 50);

  return (
    <section
      ref={sectionRef}
      data-mascot="ways"
      className="relative w-full py-20 sm:py-28 overflow-hidden bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex flex-col items-center mb-2">
            <span className="font-handwriting text-2xl text-[#9A4F28] font-bold">
              simple & transparent
            </span>
            <WavyUnderline className="w-36 mt-0.5" />
          </div>
          <ScrollRevealText
            as="h2"
            className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#2A1A12] tracking-tight"
          >
            Two ways to meet your puppy
          </ScrollRevealText>
          <ScrollFadeUp
            delay={0.15}
            className="mt-3 text-base sm:text-lg text-[#5A4030]"
          >
            Whether you want to cuddle today in Downtown Dubai or reserve a rare teacup lineage from Seoul, we ensure complete comfort.
          </ScrollFadeUp>
        </div>

        {/* CENTER TALL WOODEN SIGNPOST with swaying wooden arrow signs */}
        <div className="flex justify-center mb-12 sm:mb-16">
          <div className="relative flex flex-col items-center">
            {/* Wooden signs at the top */}
            <div className="relative flex items-center justify-center -space-x-2 z-20">
              {/* Left Arrow Sign: "Puppies in Dubai" */}
              <div
                className="relative bg-[#BA7C3E] text-white border-[2.5px] border-[#2A1A12] py-2 px-5 sm:px-7 rounded-l-2xl shadow-chunky transition-transform origin-right animate-wiggle"
                style={{
                  clipPath: "polygon(15% 0%, 100% 0%, 100% 100%, 15% 100%, 0% 50%)",
                }}
              >
                <span className="font-display font-black text-xs sm:text-sm tracking-wide ml-3">
                  ◀ Puppies in Dubai
                </span>
              </div>

              {/* Wooden pole cap */}
              <div className="w-6 h-6 rounded-full bg-[#8E4420] border-2 border-[#2A1A12] z-30 shadow-sm" />

              {/* Right Arrow Sign: "Imported for you" */}
              <div
                className="relative bg-[#8E4420] text-white border-[2.5px] border-[#2A1A12] py-2 px-5 sm:px-7 rounded-r-2xl shadow-chunky transition-transform origin-left animate-wiggle"
                style={{
                  clipPath: "polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%)",
                  animationDelay: "0.5s",
                }}
              >
                <span className="font-display font-black text-xs sm:text-sm tracking-wide mr-3">
                  Imported for you ▶
                </span>
              </div>
            </div>

            {/* Wooden Pole */}
            <div className="w-4 h-16 bg-[#6E3316] border-x-2 border-b-2 border-[#2A1A12] shadow-sm -mt-1" />
          </div>
        </div>

        {/* 2 Main Story Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-stretch">
          {/* LEFT: Dubai Storefront with Red-White Awning & Line-art Skyline */}
          <div className="relative rounded-3xl border-[3px] border-[#2A1A12] bg-[#FFFDF8] p-6 sm:p-8 shadow-chunky flex flex-col justify-between overflow-hidden group">
            {/* Line-art Dubai Skyline Background (Burj Khalifa silhouette) */}
            <div className="absolute right-4 bottom-20 w-44 h-48 opacity-15 pointer-events-none select-none">
              <svg viewBox="0 0 200 220" fill="none" stroke="#2A1A12" strokeWidth="2">
                {/* Burj Khalifa spire */}
                <path d="M100 10V220 M96 40H104 M92 70H108 M88 100H112 M84 130H116 M78 170H122 M70 220H130" />
                {/* Adjacent tower silhouettes */}
                <path d="M40 120V220 M25 150V220 M150 110V220 M175 140V220" />
              </svg>
            </div>

            <div>
              {/* Storefront with Red & White Striped Awning */}
              <div className="relative w-full rounded-2xl overflow-hidden border-2 border-[#2A1A12] bg-[#FFF8EA] mb-6 shadow-sm">
                {/* Striped Awning */}
                <div className="w-full h-8 flex shadow-sm border-b-2 border-[#2A1A12]">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex-1 h-full",
                        i % 2 === 0 ? "bg-[#C8502A]" : "bg-[#FFFDF8]"
                      )}
                    />
                  ))}
                </div>

                {/* Puppy in boutique photo */}
                <div className="relative w-full h-52 sm:h-60 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80"
                    alt="Puppies in Dubai Showroom"
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#2A1A12] text-white px-3 py-0.5 rounded-full font-handwriting text-xs font-bold shadow-sticker">
                    In our Dubai showroom
                  </div>
                </div>
              </div>

              <h3 className="font-display font-black text-2xl sm:text-3xl text-[#2A1A12]">
                Puppies in Dubai
              </h3>
              <p className="mt-2.5 text-sm sm:text-base text-[#5A4030] leading-relaxed">
                Meet charming miniature companions already in our Downtown Dubai showroom suite. Book a private cuddle session, review official municipality health certifications in person, and welcome your puppy home the very same day.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#2A1A12]/15 flex items-center justify-between">
              <span className="text-xs font-bold text-[#9A4F28] uppercase tracking-wider">
                Same-Day Welcome
              </span>
              <ChunkyButton href="/puppies?origin=local" variant="primary" size="md">
                Meet local puppies
              </ChunkyButton>
            </div>
          </div>

          {/* RIGHT: Cartoon Airplane along Dashed Curved Flight Path (Korea to Dubai) */}
          <div className="relative rounded-3xl border-[3px] border-[#2A1A12] bg-[#FFFDF8] p-6 sm:p-8 shadow-chunky flex flex-col justify-between overflow-hidden group">
            <div>
              {/* Flight Path Graphic Container */}
              <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border-2 border-[#2A1A12] bg-[#EFEAE2] mb-6 p-4">
                {/* SVG Dashed Curved Flight Path */}
                <svg
                  viewBox="0 0 360 180"
                  className="w-full h-full overflow-visible"
                  fill="none"
                >
                  {/* Flight Curve */}
                  <path
                    d="M 40 140 Q 180 20 320 130"
                    stroke="#9A4F28"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                  />
                  {/* Korea Map Pin */}
                  <circle cx="40" cy="140" r="8" fill="#C8502A" stroke="#2A1A12" strokeWidth="2.5" />
                  <text x="25" y="165" fill="#2A1A12" fontSize="13" fontWeight="bold" fontFamily="var(--font-fraunces)">
                    Seoul 🇰🇷
                  </text>

                  {/* Dubai Map Pin */}
                  <circle cx="320" cy="130" r="8" fill="#3A7D54" stroke="#2A1A12" strokeWidth="2.5" />
                  <text x="300" y="155" fill="#2A1A12" fontSize="13" fontWeight="bold" fontFamily="var(--font-fraunces)">
                    Dubai 🇦🇪
                  </text>
                </svg>

                {/* Animated Flying Cartoon Airplane */}
                {!prefersReducedMotion ? (
                  <motion.div
                    style={{
                      left: planeX,
                      top: planeY,
                      rotate: planeRot,
                    }}
                    className="absolute -ml-5 -mt-5 z-20 pointer-events-none"
                  >
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      {/* Airplane Body */}
                      <path
                        d="M6 20L34 10L24 22L32 30L26 31L18 24L12 26L12 21L6 20Z"
                        fill="#FFFDF8"
                        stroke="#2A1A12"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                      />
                      <circle cx="28" cy="14" r="2" fill="#C8502A" />
                    </svg>
                  </motion.div>
                ) : (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="text-3xl">✈️</span>
                  </div>
                )}

                {/* Badge inside box */}
                <div className="absolute top-3 left-3 bg-[#9A4F28] text-white px-3 py-0.5 rounded-full font-handwriting text-xs font-bold shadow-sticker">
                  Korea to Dubai VIP Nanny
                </div>
              </div>

              <h3 className="font-display font-black text-2xl sm:text-3xl text-[#2A1A12]">
                Imported for you
              </h3>
              <p className="mt-2.5 text-sm sm:text-base text-[#5A4030] leading-relaxed">
                Directly from premier certified boutique breeders in Seoul, South Korea. Known worldwide for true micro teacup sizing, teddy-bear genetics, and dense hypoallergenic coats. Accompanied by a dedicated pet nanny in-cabin.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#2A1A12]/15 flex items-center justify-between">
              <span className="text-xs font-bold text-[#9A4F28] uppercase tracking-wider">
                VIP Nanny Travel
              </span>
              <ChunkyButton href="/puppies?origin=imported" variant="dark" size="md">
                See imported puppies
              </ChunkyButton>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}
