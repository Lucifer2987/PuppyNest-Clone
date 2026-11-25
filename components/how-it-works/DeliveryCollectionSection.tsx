"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function DeliveryCollectionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth scroll transform for the plane flying along arc
  const planeProgress = useTransform(scrollYProgress, [0.15, 0.75], [0, 1]);
  const planeX = useTransform(planeProgress, [0, 1], [40, 360]);
  const planeY = useTransform(planeProgress, [0, 0.5, 1], [150, 40, 120]);
  const planeRotate = useTransform(planeProgress, [0, 0.5, 1], [-20, 5, 25]);

  const deliveryBlocks = [
    {
      title: "Take your puppy home the same day",
      desc: "Local puppies are available immediately — visit, fall in love and go home together.",
    },
    {
      title: "Delivery within Dubai",
      desc: "Prefer to stay home? We deliver your puppy to your door within Dubai, safely and comfortably.",
    },
    {
      title: "Safe international cargo",
      desc: "We handle all the paperwork and ensure comfortable travel so your puppy arrives happy and stress-free.",
    },
    {
      title: "Worldwide delivery",
      desc: "We safely deliver puppies to loving homes all around the world. Our trusted international cargo partners ensure your new furry friend travels comfortably and arrives safely, no matter the distance.",
    },
  ];

  return (
    <section id="delivery" ref={containerRef} className="w-full pt-16 sm:pt-24 pb-14 select-none">
      {/* Heading & Subtitle */}
      <div className="mb-10 sm:mb-14">
        <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-[#2A1A12] tracking-tight leading-[1.05]">
          Delivery <span className="font-serif italic font-normal text-[#9A4F28]">&</span> collection
        </h2>
        <p className="font-body text-base sm:text-lg text-[#5A4030] mt-3 max-w-2xl leading-relaxed">
          From a same day visit in Downtown Dubai to a flight from Korea, every puppy travels
          comfortably and arrives safely.
        </p>
      </div>

      {/* 2-Column Grid: Left 2x2 cards / Right Flight Map Illustration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column: 2x2 Grid of Delivery Blocks */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {deliveryBlocks.map((block, i) => (
            <motion.div
              key={block.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex flex-col"
            >
              <h3 className="font-display font-black text-lg sm:text-xl text-[#2A1A12] mb-2 leading-snug">
                {block.title}
              </h3>
              <p className="font-body text-xs sm:text-sm text-[#5A4030] leading-relaxed">
                {block.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Right Column: Flight Path SVG Map Illustration */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[440px] aspect-[4/3] rounded-3xl bg-[#FFFDF8]/70 border-[2px] border-[#2A1A12]/15 p-4 shadow-sm overflow-hidden flex items-end">
            <svg
              viewBox="0 0 420 280"
              className="w-full h-full overflow-visible"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Sun gradient glow */}
                <radialGradient id="sunGlow2" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F5B342" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#F5B342" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Gentle Sun in the background */}
              <circle cx="330" cy="70" r="45" fill="url(#sunGlow2)" />
              <circle cx="330" cy="70" r="28" fill="#F7CA68" />

              {/* Dashed Flight Trajectory Arc */}
              <path
                id="flightPath"
                d="M 60 210 C 120 70, 280 50, 360 210"
                stroke="#9A4F28"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                fill="none"
                opacity="0.75"
              />

              {/* Waypoint 1: Korea (Left bottom) */}
              <g transform="translate(60, 210)">
                <circle cx="0" cy="0" r="6" fill="#9A4F28" />
                <circle cx="0" cy="0" r="10" stroke="#9A4F28" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="0" y1="0" x2="0" y2="24" stroke="#2A1A12" strokeWidth="2" />
                <circle cx="0" cy="24" r="3" fill="#2A1A12" />
                <text
                  x="-4"
                  y="42"
                  fontFamily="system-ui, sans-serif"
                  fontWeight="bold"
                  fontSize="12"
                  fill="#5A4030"
                  textAnchor="middle"
                >
                  Korea
                </text>
              </g>

              {/* Waypoint 2: Dubai (Right bottom) */}
              <g transform="translate(360, 210)">
                <circle cx="0" cy="0" r="6" fill="#9A4F28" />
                <circle cx="0" cy="0" r="10" stroke="#9A4F28" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="0" y1="0" x2="0" y2="24" stroke="#2A1A12" strokeWidth="2" />
                <circle cx="0" cy="24" r="3" fill="#2A1A12" />
                <text
                  x="0"
                  y="42"
                  fontFamily="system-ui, sans-serif"
                  fontWeight="bold"
                  fontSize="12"
                  fill="#5A4030"
                  textAnchor="middle"
                >
                  Dubai
                </text>
              </g>

              {/* Line Art Skyline Silhouettes at the bottom */}
              <g stroke="#2A1A12" strokeWidth="1.5" strokeLinecap="round" opacity="0.35">
                {/* Korea side buildings */}
                <rect x="25" y="225" width="22" height="35" fill="none" />
                <rect x="35" y="235" width="20" height="25" fill="none" />
                <path d="M 22 225 L 36 215 L 50 225" />

                {/* Ground Line */}
                <line x1="10" y1="260" x2="410" y2="260" strokeWidth="2" />

                {/* Dubai side towers: Burj Khalifa & Frame silhouettes */}
                <rect x="230" y="228" width="18" height="32" fill="none" />
                <rect x="254" y="210" width="24" height="50" fill="none" />
                <rect x="284" y="222" width="20" height="38" fill="none" />
                {/* Burj Khalifa silhouette */}
                <path d="M 314 260 L 314 190 L 318 175 L 320 150 L 321 130 L 322 150 L 324 175 L 328 190 L 328 260" />
                <line x1="321" y1="130" x2="321" y2="105" strokeWidth="1.5" />
                {/* Dubai Frame */}
                <rect x="340" y="215" width="28" height="45" fill="none" />
                <rect x="346" y="222" width="16" height="32" fill="none" />
                <rect x="375" y="230" width="22" height="30" fill="none" />
              </g>

              {/* Animated Airplane flying along the arc */}
              <motion.g
                style={{
                  x: planeX,
                  y: planeY,
                  rotate: planeRotate,
                }}
              >
                {/* Stylized Airplane SVG */}
                <g transform="translate(-20, -18) scale(1.1)">
                  {/* Wing shadow */}
                  <path
                    d="M 12 18 L 4 28 L 8 28 L 18 20 Z"
                    fill="#2A1A12"
                    opacity="0.2"
                  />
                  {/* Plane Body */}
                  <path
                    d="M 34 16 C 36 17, 36 19, 34 20 L 12 24 C 9 24.5, 6 23, 6 18 C 6 13, 9 11.5, 12 12 Z"
                    fill="#FFFDF8"
                    stroke="#2A1A12"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  {/* Tail Fin */}
                  <path
                    d="M 11 12 L 6 3 L 12 3 L 17 12 Z"
                    fill="#9A4F28"
                    stroke="#2A1A12"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  {/* Main Wing */}
                  <path
                    d="M 23 18 L 12 34 L 18 34 L 29 19 Z"
                    fill="#F7CA68"
                    stroke="#2A1A12"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  {/* Cockpit Window */}
                  <path
                    d="M 28 15 C 31 16, 31 17, 28 18 Z"
                    fill="#2A1A12"
                  />
                </g>
              </motion.g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
