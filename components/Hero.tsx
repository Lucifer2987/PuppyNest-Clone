"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { WavyUnderline } from "@/components/WavyUnderline";
import { Mascot } from "@/components/Mascot";
import { ScallopDivider } from "@/components/ScallopDivider";
import { ArgylePattern } from "@/components/ArgylePattern";
import { ArchFrame } from "@/components/ArchFrame";
import { getWhatsAppUrl } from "@/lib/config";
import { setGlobalHeroProgress } from "@/hooks/useMascotPosition";

// Puppy frames matching Screenshot 1 tone & composition
const HERO_ARCHES = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&w=600&q=80",
    alt: "Teacup Maltipoo puppy looking forward",
    width: "clamp(100px, 8.9vw, 142px)",
    height: 135,
    visibleHeight: 92,
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80",
    alt: "Pomeranian puppy sitting outdoors",
    width: "clamp(120px, 10.9vw, 172px)",
    height: 195,
    visibleHeight: 152,
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80",
    alt: "Dark masked teacup puppy",
    width: "clamp(110px, 9.6vw, 152px)",
    height: 160,
    visibleHeight: 115,
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80",
    alt: "Maltipoo puppy with greenery background",
    width: "clamp(115px, 9.8vw, 155px)",
    height: 170,
    visibleHeight: 125,
    speechTag: "Maltipoo",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=600&q=80",
    alt: "Twin red teacup poodles on cushion",
    width: "clamp(125px, 11.1vw, 175px)",
    height: 205,
    visibleHeight: 160,
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?auto=format&fit=crop&w=600&q=80",
    alt: "Teacup puppy peeking from green leaves",
    width: "clamp(100px, 8.7vw, 140px)",
    height: 130,
    visibleHeight: 87,
  },
];

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [isMobile, setIsMobile] = useState(false);
  const [isIdle, setIsIdle] = useState(true);
  const [isPast40, setIsPast40] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsPast40(window.scrollY >= 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 1. Scroll Range for pop down / pop up
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: isMobile ? ["start start", "45% start"] : ["start start", "35% start"],
  });

  // Soft spring smoothing: stiffness 120, damping 22, mass 0.6
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 22,
    mass: 0.6,
  });

  // Detect idle state at scroll 0 and broadcast hero progress to global FollowMascot
  useEffect(() => {
    return smoothProgress.on("change", (p) => {
      setIsIdle(p < 0.015);
      setGlobalHeroProgress(p);
    });
  }, [smoothProgress]);

  // =========================================================================
  // 2. STAGGERED MOTION VALUES: Outer frames first, center mascot last
  // =========================================================================

  // Frame 1 (center 8.8%, far left) - Sinks first
  const y0 = useTransform(smoothProgress, [0.0, 0.58], [0, 160]);
  const rot0 = useTransform(smoothProgress, [0.0, 0.28, 0.58], [0, -2.2, 0]);
  const scale0 = useTransform(smoothProgress, [0.0, 0.58], [1, 0.96]);

  // Frame 7 (center 90.2%, far right) - Sinks first
  const y5 = useTransform(smoothProgress, [0.0, 0.58], [0, 160]);
  const rot5 = useTransform(smoothProgress, [0.0, 0.28, 0.58], [0, 2.0, 0]);
  const scale5 = useTransform(smoothProgress, [0.0, 0.58], [1, 0.96]);

  // Frame 2 (center 22.3%, mid left) - Sinks second
  const y1 = useTransform(smoothProgress, [0.08, 0.70], [0, 220]);
  const rot1 = useTransform(smoothProgress, [0.08, 0.38, 0.70], [0, -1.6, 0]);
  const scale1 = useTransform(smoothProgress, [0.08, 0.70], [1, 0.96]);

  // Frame 6 (center 76.7%, mid right) - Sinks second
  const y4 = useTransform(smoothProgress, [0.08, 0.70], [0, 230]);
  const rot4 = useTransform(smoothProgress, [0.08, 0.38, 0.70], [0, 1.6, 0]);
  const scale4 = useTransform(smoothProgress, [0.08, 0.70], [1, 0.96]);

  // Frame 3 (center 34.6%, inner left) - Sinks third
  const y2 = useTransform(smoothProgress, [0.18, 0.82], [0, 185]);
  const rot2 = useTransform(smoothProgress, [0.18, 0.48, 0.82], [0, -0.9, 0]);
  const scale2 = useTransform(smoothProgress, [0.18, 0.82], [1, 0.96]);

  // Frame 5 (center 64.5%, inner right, Maltipoo) - Sinks third
  const y3 = useTransform(smoothProgress, [0.18, 0.82], [0, 195]);
  const rot3 = useTransform(smoothProgress, [0.18, 0.48, 0.82], [0, 0.9, 0]);
  const scale3 = useTransform(smoothProgress, [0.18, 0.82], [1, 0.96]);
  // Tag fades out rapidly in first 30% of frame motion (0.18 -> 0.38)
  const tagOpacity3 = useTransform(smoothProgress, [0.18, 0.38], [1, 0]);

  // Center Mascot (Peeking, height ~160) - Ducks down with the scroll
  const mascotY = useTransform(smoothProgress, [0.30, 0.88, 1.0], [0, 180, 230]);
  const mascotRot = useTransform(smoothProgress, [0.30, 0.60, 0.88], [0, 1.2, 0]);
  const mascotScale = useTransform(smoothProgress, [0.30, 0.88], [1, 0.94]);
  const mascotOpacity = useTransform(smoothProgress, [0.85, 0.98], [1, 0]);

  return (
    <section
      ref={heroRef}
      data-mascot="hero"
      className="relative w-full overflow-hidden select-none min-h-[calc(100svh-3px)] flex flex-col justify-between"
      style={{
        background: "linear-gradient(180deg, #FFFDF8 0%, #FFF7E6 55%, #FDEBC8 100%)",
      }}
    >
      {/* Soft radial peach glow behind mascot at bottom-center */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at 50% 88%, rgba(250, 205, 140, 0.55), transparent 60%)",
        }}
        aria-hidden="true"
      />

      {/* ============================================================
          TOP / MIDDLE CONTENT: Tagline, Headline, Subtitle, Buttons
          ============================================================ */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center z-10 pt-4 sm:pt-7 md:pt-9">
        {/* Tagline: Patrick Hand 28px, #9A4F28, ~48px below header */}
        <div className="inline-flex flex-col items-center select-none">
          <span className="font-handwriting text-[28px] text-[#9A4F28] font-bold tracking-wide">
            every puppy is family
          </span>
          <WavyUnderline className="w-[250px] mt-1" />
        </div>

        {/* Headline: Fraunces 900, ~82px at 1536px, line-height 0.92, letter-spacing -0.03em */}
        <h1 className="mt-3 md:mt-4 font-display font-black text-[clamp(2.1rem,6.2vw,5.2rem)] leading-[0.94] sm:leading-[0.92] tracking-[-0.03em] text-[#2A1A12] select-none text-center whitespace-pre-line max-w-4xl mx-auto px-2">
          {"Premium teacup\npuppies in Dubai"}
        </h1>

        {/* Subtitle: Figtree 400, 19px, line-height 1.5, #5A4030, max-width 560px, mt 20px */}
        <p className="mt-3.5 sm:mt-5 font-body font-normal text-base sm:text-[19px] leading-[1.45] sm:leading-[1.5] text-[#5A4030] max-w-[560px] mx-auto text-center px-4 sm:px-0 select-none">
          Meet your new best friend in our Dubai showroom, or order a rare miniature breed from trusted breeders worldwide.
        </p>

        {/* Buttons Row: mt 28px, gap 12px, height 54px, padding 0 28px, Figtree 700, 18px, pill */}
        <div
          data-mascot-avoid="true"
          className="mt-5 sm:mt-7 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 w-full max-w-xs sm:max-w-none mx-auto select-none"
        >
          {/* Primary Button */}
          <Link
            href="/puppies"
            className="w-full sm:w-auto h-[48px] sm:h-[54px] px-6 sm:px-7 font-body font-bold text-[16px] sm:text-[18px] text-white bg-[#9A4F28] rounded-full shadow-[0_4px_0_#5E2F14] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_6px_0_#5E2F14] active:translate-y-0.5 active:shadow-[0_2px_0_#5E2F14] inline-flex items-center justify-center"
          >
            View available puppies
          </Link>

          {/* Secondary WhatsApp Outline Button */}
          <a
            href={getWhatsAppUrl("Hi PuppyNest! I'd like to enquire about your available teacup puppies in Dubai.")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto h-[48px] sm:h-[54px] px-6 sm:px-7 font-body font-bold text-[16px] sm:text-[18px] text-[#2A1A12] bg-[#FFFBF2] border-2 border-[#2A1A12] rounded-full shadow-[0_4px_0_#2A1A12] transition-all duration-150 hover:bg-[#2A1A12] hover:text-[#FFF8EA] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#2A1A12] active:translate-y-0.5 active:shadow-[0_2px_0_#2A1A12] inline-flex items-center justify-center"
          >
            Enquire on WhatsApp
          </a>
        </div>
      </div>

      {/* ============================================================
          HERO BOTTOM: Arch Frames Peeking & Sinking Behind Scallops
          Scallop line is at bottom 125px with 125px of argyle below it.
          ============================================================ */}
      <div className="relative w-full h-[230px] sm:h-[260px] md:h-[290px] overflow-hidden mt-6">
        {/* Layer 1 (z-10): Arch Frames & Mascot anchored behind scallop line */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Frame 1: Center 8.8%, width 8.9vw, visible height 92px */}
          <div
            className="absolute hidden lg:block pointer-events-auto"
            style={{
              left: "8.8%",
              bottom: "85px",
              transform: "translateX(-50%)",
            }}
          >
            <ArchFrame
              {...HERO_ARCHES[0]}
              priority
              y={y0}
              rotate={rot0}
              scale={scale0}
              isIdle={isIdle}
              idleClass="hero-frame-bob-1"
              loadInDelay={0.0}
            />
          </div>

          {/* Frame 2: Center 22.3%, width 10.9vw, visible height 152px */}
          <div
            className="absolute hidden md:block pointer-events-auto"
            style={{
              left: "22.3%",
              bottom: "85px",
              transform: "translateX(-50%)",
            }}
          >
            <ArchFrame
              {...HERO_ARCHES[1]}
              priority
              y={y1}
              rotate={rot1}
              scale={scale1}
              isIdle={isIdle}
              idleClass="hero-frame-bob-2"
              loadInDelay={0.08}
            />
          </div>

          {/* Frame 3: Center 34.6% on desktop (16% on mobile), width 9.6vw, visible height 115px */}
          <div
            className="absolute pointer-events-auto left-[16%] sm:left-[22%] md:left-[34.6%]"
            style={{
              bottom: "85px",
              transform: "translateX(-50%)",
            }}
          >
            <ArchFrame
              {...HERO_ARCHES[2]}
              priority
              y={y2}
              rotate={rot2}
              scale={scale2}
              isIdle={isIdle}
              idleClass="hero-frame-bob-3"
              loadInDelay={0.16}
            />
          </div>

          {/* Center Mascot: Center 50.2%, width ~170px desktop, ~120px mobile, resting on scallop edge */}
          <div
            id="hero-peeking-mascot"
            data-mascot-anchor="hero-peek"
            className="absolute pointer-events-auto left-[50%] md:left-[50.2%]"
            style={{
              bottom: isMobile ? "90px" : "98px",
              transform: "translateX(-50%)",
              opacity: isPast40 ? 0 : 1,
              transition: "opacity 0.12s ease-out",
            }}
          >
            <motion.div
              initial={prefersReducedMotion ? false : { y: 190, opacity: 0 }}
              animate={prefersReducedMotion ? {} : { y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 140,
                damping: 18,
                delay: 0.24,
              }}
              style={
                prefersReducedMotion
                  ? {}
                  : {
                      y: mascotY,
                      rotate: mascotRot,
                      scale: mascotScale,
                      opacity: mascotOpacity,
                    }
              }
              className="relative cursor-pointer will-change-transform"
            >
              <div className={isIdle && !prefersReducedMotion ? "hero-frame-bob-4" : ""}>
                <Mascot
                  pose="peek"
                  size={isMobile ? 120 : 170}
                  className="drop-shadow-sm"
                />
              </div>
            </motion.div>
          </div>

          {/* Frame 5: Center 64.5% on desktop (84% on mobile), width 9.8vw, visible height 125px with Maltipoo tag */}
          <div
            className="absolute pointer-events-auto left-[84%] sm:left-[78%] md:left-[64.5%]"
            style={{
              bottom: "85px",
              transform: "translateX(-50%)",
            }}
          >
            <ArchFrame
              {...HERO_ARCHES[3]}
              priority
              y={y3}
              rotate={rot3}
              scale={scale3}
              tagOpacity={tagOpacity3}
              isIdle={isIdle}
              idleClass="hero-frame-bob-5"
              loadInDelay={0.32}
            />
          </div>

          {/* Frame 6: Center 76.7%, width 11.1vw, visible height 160px */}
          <div
            className="absolute hidden md:block pointer-events-auto"
            style={{
              left: "76.7%",
              bottom: "85px",
              transform: "translateX(-50%)",
            }}
          >
            <ArchFrame
              {...HERO_ARCHES[4]}
              priority
              y={y4}
              rotate={rot4}
              scale={scale4}
              isIdle={isIdle}
              idleClass="hero-frame-bob-6"
              loadInDelay={0.4}
            />
          </div>

          {/* Frame 7: Center 90.2%, width 8.7vw, visible height 87px */}
          <div
            className="absolute hidden lg:block pointer-events-auto"
            style={{
              left: "90.2%",
              bottom: "85px",
              transform: "translateX(-50%)",
            }}
          >
            <ArchFrame
              {...HERO_ARCHES[5]}
              priority
              y={y5}
              rotate={rot5}
              scale={scale5}
              isIdle={isIdle}
              idleClass="hero-frame-bob-1"
              loadInDelay={0.48}
            />
          </div>
        </div>

        {/* Layer 2 (z-20): Scallop border divider right above the argyle strip */}
        <div className="absolute bottom-[118px] left-0 right-0 z-20 pointer-events-none select-none">
          <ScallopDivider
            fillColor="#FFF3D9"
            strokeColor="#2A1A12"
            dashColor="rgba(201, 139, 77, 0.6)"
          />
        </div>

        {/* Layer 3 (z-20): Argyle pattern strip (~125px tall, thin brown lines at 8% opacity) */}
        <div className="absolute bottom-0 left-0 right-0 h-[125px] bg-[#FFF3D9] z-20 overflow-hidden border-b border-[#2A1A12]/15">
          <ArgylePattern opacity={0.08} size={42} />
        </div>
      </div>
    </section>
  );
}
