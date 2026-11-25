"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestimonialQuote {
  quote: string;
  author: string;
  location: string;
}

const TESTIMONIALS: TestimonialQuote[] = [
  {
    quote:
      "PuppyNest truly made our dream a reality. They supported us at every step of the import journey. Our Maltipoo arrived healthy, cheerful, and absolutely perfect. Having 24/7 support gave us complete peace of mind!",
    author: "Sarah M.",
    location: "Downtown Dubai, UAE",
  },
  {
    quote:
      "Visiting the Dubai showroom was such a warm experience. Seeing how calm, loving, and well-cared for the puppies were made choosing Milo so effortless. He is the heart of our home now.",
    author: "Rashid & Fatima Al Mansoori",
    location: "Palm Jumeirah, UAE",
  },
  {
    quote:
      "From Korea to Dubai with zero stress. The VIP nanny delivery was punctual, our Teacup Poodle had all her certified vaccinations and passport ready, and she cuddled right into our arms.",
    author: "Elena & Marcus",
    location: "Emirates Hills, UAE",
  },
];

interface HappyFamiliesHeroProps {
  totalCount: number;
}

export function HappyFamiliesHero({ totalCount }: HappyFamiliesHeroProps) {
  // Testimonial rotation state
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Count up animation for "64 moments and counting"
  const counterRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(counterRef, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = totalCount;
    const duration = 1600; // ms
    const incrementTime = 25; // ms
    const step = Math.max(1, Math.ceil(end / (duration / incrementTime)));

    const counter = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(counter);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(counter);
  }, [isInView, totalCount]);

  const current = TESTIMONIALS[activeTestimonial];

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12 sm:mb-16 select-none">
      {/* Left Column: Eyebrow, Heading with Pulsing Heart, Description, Counter */}
      <div className="lg:col-span-7 flex flex-col items-start text-left">
        {/* Handwritten Eyebrow */}
        <span className="font-handwriting text-xl sm:text-2xl text-[#9A4F28] font-bold tracking-wide mb-1">
          our wall of happy endings
        </span>

        {/* Huge Heading with Outlined Pulsing Heart */}
        <div className="flex items-center gap-3 sm:gap-4 mb-4">
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-[76px] text-[#2A1A12] tracking-tight leading-[1.05]">
            Happy families
          </h1>

          {/* Outlined heart with 1.6s gentle heartbeat loop */}
          <motion.div
            animate={{ scale: [1, 1.14, 1, 1.1, 1] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-[#9A4F28] shrink-0"
            aria-hidden="true"
          >
            <Heart className="w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 stroke-[2.4] fill-none" />
          </motion.div>
        </div>

        {/* Description */}
        <p className="font-body text-base sm:text-lg text-[#5A4030] leading-relaxed max-w-xl mb-6">
          Nothing makes us happier than seeing our puppies in loving homes! Here are some beautiful
          moments shared by our amazing clients after welcoming their furry friends.
        </p>

        {/* Animated Counter */}
        <div ref={counterRef} className="inline-flex items-center gap-2">
          <span className="font-body font-black text-lg sm:text-xl text-[#2A1A12]">
            {count}
          </span>
          <span className="font-body font-bold text-sm sm:text-base text-[#7A6355]">
            moments and counting
          </span>
          <span className="w-2 h-2 rounded-full bg-[#3A7D54] animate-pulse ml-0.5" />
        </div>
      </div>

      {/* Right Column: Tilted Paper Note Card with Rotating Testimonial */}
      <div
        className="lg:col-span-5 flex justify-center lg:justify-end"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative w-full max-w-md rotate-2 bg-[#FFFDF8] rounded-[18px] border-[2.2px] border-[#2A1A12] p-6 sm:p-7 shadow-[5px_5px_0_rgba(42,26,18,0.7)] transition-transform hover:rotate-0 hover:scale-[1.02] duration-300">
          {/* Tape strip at top center (semi-transparent beige washi tape) */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#EADECC]/85 border border-[#2A1A12]/30 shadow-xs rotate-[-1deg] backdrop-blur-xs pointer-events-none" />

          {/* Testimonial Quote Content with Soft Page-Flip Fade */}
          <div className="min-h-[140px] sm:min-h-[155px] flex flex-col justify-between" aria-live="off">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex flex-col justify-between h-full"
              >
                <p className="font-body text-xs sm:text-sm text-[#382318] leading-relaxed italic mb-4">
                  &ldquo;{current.quote}&rdquo;
                </p>

                <div className="pt-2 border-t border-[#2A1A12]/10 flex items-center justify-between">
                  <span className="font-handwriting text-base sm:text-lg text-[#9A4F28] font-bold">
                    {current.author}, {current.location}
                  </span>

                  {/* Indicator Dots */}
                  <div className="flex items-center gap-1.5">
                    {TESTIMONIALS.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveTestimonial(idx)}
                        aria-label={`View testimonial ${idx + 1}`}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all",
                          idx === activeTestimonial
                            ? "bg-[#9A4F28] w-4"
                            : "bg-[#2A1A12]/20 hover:bg-[#2A1A12]/50"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
