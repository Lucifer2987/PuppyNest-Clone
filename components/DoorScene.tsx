"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { MessageCircle, MapPin } from "lucide-react";
import { ChunkyButton } from "@/components/ChunkyButton";
import { WavyUnderline } from "@/components/WavyUnderline";
import { ScrollRevealText, ScrollFadeUp } from "@/components/ScrollRevealText";
import { PawIcon } from "@/components/PawTrail";
import { getWhatsAppUrl } from "@/lib/config";

export function DoorScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const doorRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(doorRef, { amount: 0.35, once: true });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      ref={sectionRef}
      data-mascot="cta"
      className="relative w-full py-20 sm:py-28 overflow-hidden bg-transparent text-[#FFF3D9]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Eyebrow & Heading */}
        <div className="inline-flex flex-col items-center mb-3">
          <span className="font-handwriting text-2xl sm:text-3xl text-[#F0B955] font-bold">
            welcome home
          </span>
          <WavyUnderline className="w-36 mt-0.5" color="#F0B955" />
        </div>

        <ScrollRevealText
          as="h2"
          className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FFF3D9] tracking-tight leading-tight max-w-2xl mx-auto"
        >
          {"Ready to meet your\nnew best friend?"}
        </ScrollRevealText>

        <ScrollFadeUp
          delay={0.15}
          className="mt-4 text-base sm:text-lg text-[#D4C3B3] max-w-xl mx-auto leading-relaxed"
        >
          Visit our private Downtown Dubai showroom for an unhurried cuddle session, or chat with our puppy concierges directly on WhatsApp.
        </ScrollFadeUp>

        {/* COZY HOME SCENE: Arched door, glowing lamps, potted plants */}
        <div ref={doorRef} className="relative mt-12 sm:mt-16 flex justify-center items-end">
          {/* LEFT WARM WALL LAMP */}
          <div className="relative mr-4 sm:mr-8 mb-16 hidden sm:block">
            <div className="w-20 h-20 rounded-full bg-[#F0B955]/25 blur-lg absolute -top-4 -left-4 animate-pulse" />
            <svg width="40" height="70" viewBox="0 0 40 70" fill="none">
              <path d="M10 20L20 8L30 20L26 32H14L10 20Z" fill="#2A1A12" stroke="#FFF3D9" strokeWidth="2" />
              <polygon points="14,21 26,21 24,30 16,30" fill="#F0B955" />
              <path d="M20 32V65 M12 65H28" stroke="#FFF3D9" strokeWidth="2.5" />
            </svg>
          </div>

          {/* LEFT POTTED PLANT */}
          <div className="relative mr-2 sm:mr-4 mb-2 hidden sm:block">
            <svg width="55" height="75" viewBox="0 0 55 75" fill="none">
              {/* Leaves */}
              <ellipse cx="27" cy="22" rx="14" ry="20" fill="#3A7D54" stroke="#2A1A12" strokeWidth="2" />
              <ellipse cx="16" cy="28" rx="12" ry="16" fill="#4B9B6A" stroke="#2A1A12" strokeWidth="2" />
              <ellipse cx="38" cy="28" rx="12" ry="16" fill="#4B9B6A" stroke="#2A1A12" strokeWidth="2" />
              {/* Terracotta Pot */}
              <path d="M14 45L18 72H36L40 45H14Z" fill="#C8502A" stroke="#2A1A12" strokeWidth="2.5" />
              <rect x="11" y="40" width="32" height="6" rx="2" fill="#BA7C3E" stroke="#2A1A12" strokeWidth="2" />
            </svg>
          </div>

          {/* CENTER: BIG ARCHED FRONT DOOR THAT SWINGS OPEN ON SCROLL */}
          <div
            id="cta-door-target"
            data-cta-door="true"
            className="door-perspective relative w-[240px] sm:w-[280px] h-[360px] sm:h-[400px] rounded-t-[140px] border-[3.5px] border-[#FFF3D9] shadow-chunky-lg bg-[#2A1A12] overflow-hidden"
          >
            {/* INNER ARCHED WINDOW (Puppy Photo with Radiating Light) */}
            <div className="absolute inset-0 bg-[#FFF8EA] flex flex-col justify-between overflow-hidden">
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&w=600&q=80"
                  alt="Puppy welcoming home inside open door"
                  fill
                  sizes="300px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 inset-x-0 text-center font-display font-black text-sm text-white drop-shadow-md">
                  Welcome Home 🐾
                </div>
              </div>
            </div>

            {/* 3D WOODEN DOOR LEAF THAT SWINGS OPEN */}
            <motion.div
              initial={{ rotateY: 0 }}
              animate={isInView ? { rotateY: -82 } : { rotateY: 0 }}
              transition={{
                duration: 0.9,
                ease: [0.34, 1.56, 0.64, 1],
                delay: 0.2,
              }}
              style={{
                transformOrigin: "left center",
              }}
              className="absolute inset-0 rounded-t-[136px] bg-[#9A4F28] border-2 border-[#2A1A12] p-4 flex flex-col justify-between cursor-pointer z-20 shadow-lg"
            >
              {/* Inner arch outline */}
              <div className="relative w-full h-[55%] flex flex-col items-center justify-start pt-6">
                <div className="absolute inset-x-3 top-2 bottom-0 rounded-t-[120px] border-2 border-dashed border-white/30 pointer-events-none" />
                <div className="relative z-10 opacity-40 text-white mt-4">
                  <PawIcon size={42} fill="currentColor" />
                </div>
              </div>

              {/* Vertical planks */}
              <div className="absolute inset-0 flex justify-evenly pointer-events-none opacity-25">
                <div className="w-[1.5px] h-full bg-black" />
                <div className="w-[1.5px] h-full bg-black" />
              </div>

              {/* Gold Door Knob */}
              <div className="absolute right-4 top-[58%] -translate-y-1/2 z-30">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#FCE7BE] via-[#F0B955] to-[#B88528] border-2 border-[#2A1A12] shadow-sm flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/70 -translate-x-0.5 -translate-y-0.5" />
                </div>
              </div>

              <div className="relative z-10 w-full pt-4 pb-2 border-t border-black/20 text-center">
                <span className="font-handwriting text-xs text-white/80 tracking-widest font-bold uppercase">
                  Home is here •
                </span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT POTTED PLANT */}
          <div className="relative ml-2 sm:ml-4 mb-2 hidden sm:block">
            <svg width="55" height="75" viewBox="0 0 55 75" fill="none">
              <ellipse cx="27" cy="22" rx="14" ry="20" fill="#3A7D54" stroke="#2A1A12" strokeWidth="2" />
              <ellipse cx="16" cy="28" rx="12" ry="16" fill="#4B9B6A" stroke="#2A1A12" strokeWidth="2" />
              <ellipse cx="38" cy="28" rx="12" ry="16" fill="#4B9B6A" stroke="#2A1A12" strokeWidth="2" />
              <path d="M14 45L18 72H36L40 45H14Z" fill="#C8502A" stroke="#2A1A12" strokeWidth="2.5" />
              <rect x="11" y="40" width="32" height="6" rx="2" fill="#BA7C3E" stroke="#2A1A12" strokeWidth="2" />
            </svg>
          </div>

          {/* RIGHT WARM WALL LAMP */}
          <div className="relative ml-4 sm:ml-8 mb-16 hidden sm:block">
            <div className="w-20 h-20 rounded-full bg-[#F0B955]/25 blur-lg absolute -top-4 -left-4 animate-pulse" />
            <svg width="40" height="70" viewBox="0 0 40 70" fill="none">
              <path d="M10 20L20 8L30 20L26 32H14L10 20Z" fill="#2A1A12" stroke="#FFF3D9" strokeWidth="2" />
              <polygon points="14,21 26,21 24,30 16,30" fill="#F0B955" />
              <path d="M20 32V65 M12 65H28" stroke="#FFF3D9" strokeWidth="2.5" />
            </svg>
          </div>
        </div>

        {/* TWO CHUNKY ACTION BUTTONS UNDER SCENE */}
        <ScrollFadeUp
          delay={0.25}
          data-mascot-avoid="true"
          className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <ChunkyButton
            href={getWhatsAppUrl("Hi PuppyNest! I'm ready to meet your available teacup puppies.")}
            variant="whatsapp"
            size="lg"
            className="w-full sm:w-auto min-w-[220px]"
          >
            <MessageCircle className="w-5 h-5 fill-current stroke-none" />
            <span>Enquire on WhatsApp</span>
          </ChunkyButton>

          <ChunkyButton
            href="/contact"
            variant="outline"
            size="lg"
            className="w-full sm:w-auto min-w-[220px]"
          >
            <MapPin className="w-5 h-5" />
            <span>Visit & contact</span>
          </ChunkyButton>
        </ScrollFadeUp>
      </div>
    </section>
  );
}
