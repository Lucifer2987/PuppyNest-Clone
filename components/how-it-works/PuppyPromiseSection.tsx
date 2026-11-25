"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, FileCheck2, ShieldCheck, Sparkles, Plane, Award } from "lucide-react";

export function PuppyPromiseSection() {
  const stamps = [
    {
      id: "vet",
      title: "Hand-selected breeders",
      desc: "We work only with licensed ethical breeders who adhere to the highest veterinary health and welfare standards.",
      color: "#9A4F28",
      tilt: -4,
      stampShape: "circle",
      icon: Heart,
      subtext: "100% HEALTHY",
    },
    {
      id: "docs",
      title: "Full transparency",
      desc: "Pedigree, vaccine, and health certificates are shared before your puppy leaves.",
      color: "#3E6B5C",
      tilt: 2.5,
      stampShape: "rect",
      icon: FileCheck2,
      subtext: "OFFICIAL PASSPORT",
    },
    {
      id: "delivery",
      title: "Safe, stress-free delivery",
      desc: "Special temperature-controlled travel guarantees your puppy arrives happy, healthy, and ready to love you.",
      color: "#8A4B29",
      tilt: -2,
      stampShape: "scallop",
      icon: Award,
      subtext: "FIRST CLASS CARE",
    },
  ];

  return (
    <section id="promise" className="w-full pt-16 sm:pt-20 pb-12 select-none">
      {/* Outer Card with Argyle Texture and Chunky Border */}
      <div className="relative rounded-[28px] sm:rounded-[36px] border-[2.5px] border-[#2A1A12] bg-[#FFFBF3] shadow-[4px_4px_0_#2A1A12] overflow-hidden p-6 sm:p-10 md:p-14">
        {/* Faint Argyle Diamond Pattern Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #2A1A12 0, #2A1A12 1px, transparent 0, transparent 50%),
                              repeating-linear-gradient(-45deg, #2A1A12 0, #2A1A12 1px, transparent 0, transparent 50%)`,
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />

        {/* Dashed Inner Passport Frame */}
        <div className="relative z-10 rounded-2xl sm:rounded-3xl border-2 border-dashed border-[#2A1A12]/30 p-5 sm:p-8 md:p-10 bg-[#FFFDF8]/80 backdrop-blur-sm">
          {/* Eyebrow & Main Title */}
          <div className="text-left mb-10 sm:mb-14">
            <span className="font-handwriting text-xl sm:text-2xl text-[#9A4F28] font-bold block mb-1">
              puppy passport
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-[#2A1A12] tracking-tight">
              Our premium puppy promise
            </h2>
          </div>

          {/* 3 Ink Stamps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 items-start">
            {stamps.map((stamp, idx) => {
              const Icon = stamp.icon;
              return (
                <div key={stamp.id} className="flex flex-col items-center text-center">
                  {/* Ink Stamp Graphic with Slam-in Scroll Animation */}
                  <div className="h-36 sm:h-40 flex items-center justify-center mb-5">
                    <motion.div
                      initial={{ scale: 1.55, opacity: 0, rotate: stamp.tilt * 2 }}
                      whileInView={{
                        scale: [1.55, 0.96, 1],
                        opacity: 1,
                        rotate: [stamp.tilt * 2, stamp.tilt - 2, stamp.tilt],
                      }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{
                        duration: 0.5,
                        delay: idx * 0.18,
                        type: "spring",
                        stiffness: 240,
                        damping: 14,
                      }}
                      className="cursor-default select-none transition-transform hover:scale-105"
                      style={{
                        color: stamp.color,
                      }}
                    >
                      {stamp.stampShape === "circle" && (
                        <div
                          className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-[3px] border-dashed p-1.5 flex flex-col items-center justify-center relative shadow-sm"
                          style={{ borderColor: stamp.color }}
                        >
                          <div
                            className="w-full h-full rounded-full border-2 flex flex-col items-center justify-center p-2 text-center"
                            style={{ borderColor: stamp.color }}
                          >
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1 opacity-90 stroke-[2.5]" />
                            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider leading-tight">
                              {stamp.title}
                            </span>
                            <span className="text-[8px] font-bold uppercase tracking-widest mt-1 opacity-75">
                              {stamp.subtext}
                            </span>
                          </div>
                        </div>
                      )}

                      {stamp.stampShape === "rect" && (
                        <div
                          className="w-36 h-24 sm:w-40 sm:h-28 rounded-xl border-[3px] border-double p-1.5 flex flex-col items-center justify-center shadow-sm"
                          style={{ borderColor: stamp.color }}
                        >
                          <div
                            className="w-full h-full rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-2 text-center"
                            style={{ borderColor: stamp.color }}
                          >
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1 opacity-90 stroke-[2.5]" />
                            <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-wider leading-tight">
                              {stamp.title}
                            </span>
                            <span className="text-[8px] font-bold uppercase tracking-widest mt-1 opacity-75">
                              {stamp.subtext}
                            </span>
                          </div>
                        </div>
                      )}

                      {stamp.stampShape === "scallop" && (
                        <div
                          className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-[3px] border-double p-1.5 flex flex-col items-center justify-center relative shadow-sm"
                          style={{ borderColor: stamp.color }}
                        >
                          <div
                            className="w-full h-full rounded-full border-2 border-dashed flex flex-col items-center justify-center p-2 text-center"
                            style={{ borderColor: stamp.color }}
                          >
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1 opacity-90 stroke-[2.5]" />
                            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider leading-tight">
                              {stamp.title}
                            </span>
                            <span className="text-[8px] font-bold uppercase tracking-widest mt-1 opacity-75">
                              {stamp.subtext}
                            </span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* Stamp Description */}
                  <p className="font-body text-xs sm:text-sm text-[#5A4030] leading-relaxed max-w-xs">
                    {stamp.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
