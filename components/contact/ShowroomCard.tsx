"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { ChunkyButton } from "@/components/ChunkyButton";

export function ShowroomCard() {
  const [signSway, setSignSway] = useState(false);

  return (
    <div className="w-full relative pt-6 select-none">
      {/* Striped Awning on Top with Scalloped Edge */}
      <motion.div
        initial={{ rotate: -2, y: -6, opacity: 0 }}
        whileInView={{ rotate: 0, y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 180, damping: 14 }}
        className="relative z-20 w-[94%] mx-auto -mb-3 drop-shadow-md"
      >
        {/* Awning Fabric with Rust & Cream Stripes */}
        <div
          className="h-11 sm:h-12 w-full rounded-t-lg border-[2.5px] border-[#2A1A12] border-b-0 shadow-inner"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg,
              #9A4F28 0px, #9A4F28 28px,
              #FFFDF8 28px, #FFFDF8 56px)`,
          }}
        />

        {/* Scalloped Awning Valance */}
        <div className="relative w-full h-4 overflow-hidden -mt-[1px]">
          <svg
            className="w-full h-full text-[#2A1A12]"
            viewBox="0 0 600 20"
            preserveAspectRatio="none"
            fill="none"
          >
            {/* Scallop Curves */}
            <path
              d="M0,0 
                 Q25,18 50,0 Q75,18 100,0 Q125,18 150,0 Q175,18 200,0 
                 Q225,18 250,0 Q275,18 300,0 Q325,18 350,0 Q375,18 400,0 
                 Q425,18 450,0 Q475,18 500,0 Q525,18 550,0 Q575,18 600,0"
              fill="#9A4F28"
              stroke="#2A1A12"
              strokeWidth="2.5"
            />
          </svg>
        </div>

        {/* Little Hanging "Open daily" Sign */}
        <motion.div
          animate={
            signSway
              ? { rotate: [-6, 6, -3, 3, 0] }
              : { rotate: [-1, 1, -1] }
          }
          transition={
            signSway
              ? { duration: 1.2, ease: "easeInOut" }
              : { repeat: Infinity, duration: 3, ease: "easeInOut" }
          }
          onMouseEnter={() => setSignSway(true)}
          onAnimationComplete={() => setSignSway(false)}
          className="absolute left-6 -bottom-5 z-30 cursor-pointer origin-top flex flex-col items-center"
        >
          {/* Two tiny hanging cords */}
          <div className="w-10 flex justify-between px-1">
            <div className="w-[1.5px] h-3 bg-[#2A1A12]" />
            <div className="w-[1.5px] h-3 bg-[#2A1A12]" />
          </div>
          {/* Signboard */}
          <div className="px-2.5 py-0.5 rounded-full bg-[#FFFDF8] border-[1.8px] border-[#2A1A12] shadow-sm flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3A7D54] animate-pulse" />
            <span className="text-[10px] font-handwriting font-bold text-[#2A1A12] leading-none">
              Open daily
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Showroom Card */}
      <div className="relative rounded-[24px] sm:rounded-[28px] border-[2.5px] border-[#2A1A12] bg-[#FFFDF8] p-5 sm:p-7 shadow-[4px_4px_0_#2A1A12] overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
          {/* Left Details */}
          <div className="sm:col-span-7 space-y-3 pt-2">
            <h2 className="font-display font-black text-xl sm:text-2xl text-[#2A1A12] leading-snug">
              Visit us in Downtown Dubai
            </h2>

            <p className="font-body text-xs sm:text-sm text-[#5A4030] leading-relaxed">
              Step into our Downtown Dubai showroom and spend time cuddling with the puppies before you make your decision.
            </p>

            <div className="flex items-center gap-2 text-xs sm:text-[13px] text-[#2A1A12] font-semibold">
              <MapPin className="w-4 h-4 text-[#9A4F28] shrink-0 stroke-[2.5]" />
              <span>Downtown Dubai, United Arab Emirates</span>
            </div>

            <div className="pt-2">
              <ChunkyButton
                href={siteConfig.address.mapUrl}
                variant="outline"
                size="sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </ChunkyButton>
            </div>
          </div>

          {/* Right: Arched Shop Window with Puppy Art & Dubai Skyline */}
          <div className="sm:col-span-5 flex justify-center sm:justify-end">
            <div className="relative w-36 h-44 sm:w-40 sm:h-48 rounded-t-full border-[2.5px] border-[#2A1A12] bg-[#FFF4DC] overflow-hidden shadow-sm flex flex-col justify-end">
              {/* Thin line-art Dubai Skyline background in window */}
              <svg
                viewBox="0 0 160 120"
                className="absolute inset-x-0 bottom-0 w-full h-28 pointer-events-none opacity-40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 120 L10 80 L25 80 L25 65 L40 65 L40 120
                     M50 120 L50 45 L65 45 L65 120
                     M75 120 L75 25 L80 15 L85 25 L85 120
                     M95 120 L95 70 L110 70 L110 120
                     M120 120 L120 50 L135 50 L135 120"
                  stroke="#2A1A12"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>

              {/* Puppy in Window Art Placeholder */}
              <div className="relative z-10 flex flex-col items-center pb-2">
                <svg
                  width="88"
                  height="88"
                  viewBox="0 0 88 88"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-xs"
                >
                  {/* Fluffy Puppy Head in Window */}
                  {/* Ears */}
                  <ellipse cx="20" cy="40" rx="10" ry="16" fill="#F4D399" stroke="#2A1A12" strokeWidth="2.2" />
                  <ellipse cx="68" cy="40" rx="10" ry="16" fill="#F4D399" stroke="#2A1A12" strokeWidth="2.2" />
                  {/* Head */}
                  <circle cx="44" cy="44" r="28" fill="#FCE9C2" stroke="#2A1A12" strokeWidth="2.5" />
                  {/* Top-knot Pom-pom */}
                  <circle cx="44" cy="18" r="9" fill="#F4D399" stroke="#2A1A12" strokeWidth="2" />
                  {/* Muzzle */}
                  <ellipse cx="44" cy="50" rx="14" ry="10" fill="#FFFDF8" stroke="#2A1A12" strokeWidth="1.8" />
                  {/* Nose */}
                  <path d="M41 45 C41 44, 47 44, 47 45 L45 48 C44.5 49, 43.5 49, 43 48 Z" fill="#2A1A12" />
                  {/* Eyes */}
                  <circle cx="35" cy="38" r="3.5" fill="#2A1A12" />
                  <circle cx="34" cy="37" r="1.2" fill="white" />
                  <circle cx="53" cy="38" r="3.5" fill="#2A1A12" />
                  <circle cx="52" cy="37" r="1.2" fill="white" />
                  {/* Cheeks */}
                  <circle cx="28" cy="45" r="3.5" fill="#F4A29A" fillOpacity="0.6" />
                  <circle cx="60" cy="45" r="3.5" fill="#F4A29A" fillOpacity="0.6" />
                  {/* Smile */}
                  <path d="M41 52 Q44 54 47 52" stroke="#2A1A12" strokeWidth="1.6" strokeLinecap="round" />
                  {/* Paws on Window Sill */}
                  <rect x="22" y="72" width="16" height="10" rx="5" fill="#FFFDF8" stroke="#2A1A12" strokeWidth="2" />
                  <rect x="50" y="72" width="16" height="10" rx="5" fill="#FFFDF8" stroke="#2A1A12" strokeWidth="2" />
                </svg>
              </div>

              {/* Wooden Window Sill */}
              <div className="w-full h-3 bg-[#8D5B3A] border-t-2 border-[#2A1A12]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
