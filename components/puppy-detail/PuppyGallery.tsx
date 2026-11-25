"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Video, X, Maximize2, Play } from "lucide-react";
import { Puppy } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PuppyGalleryProps {
  puppy: Puppy;
  className?: string;
}

export function PuppyGallery({ puppy, className }: PuppyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const images = puppy.images && puppy.images.length > 0 ? puppy.images : ["/images/placeholder-pup.jpg"];
  const total = images.length;

  const nextImage = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevImage = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Keyboard navigation: ArrowLeft, ArrowRight, Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        nextImage();
      } else if (e.key === "ArrowLeft") {
        prevImage();
      } else if (e.key === "Escape" && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextImage, prevImage, isLightboxOpen]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextImage();
      else prevImage();
    }
    setTouchStartX(null);
  };

  return (
    <div className={cn("flex flex-col gap-3.5 select-none", className)}>
      {/* 1. Main Large Image Card */}
      <div
        className="relative w-full aspect-[4/3.7] sm:aspect-[4/3.8] rounded-[20px] border-[2.5px] border-[#2A1A12] bg-[#EFEAE2] shadow-[6px_6px_0_#2A1A12] overflow-hidden group cursor-zoom-in"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => setIsLightboxOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`View full photo of ${puppy.name}. Photo ${activeIndex + 1} of ${total}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsLightboxOpen(true);
          }
        }}
      >
        {/* Animated image container with shared element layoutId */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative w-full h-full"
            layoutId={activeIndex === 0 ? `pup-photo-${puppy.slug}` : undefined}
          >
            <Image
              src={images[activeIndex]}
              alt={`${puppy.name} - ${puppy.breed} (${activeIndex + 1} of ${total})`}
              fill
              priority={activeIndex === 0}
              sizes="(max-width: 1024px) 100vw, 720px"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Video badge overlay on first image if puppy has video */}
        {puppy.hasVideo && activeIndex === 0 && (
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2A1A12]/80 backdrop-blur-sm text-white text-xs font-bold border border-white/20 shadow-md">
              <Play className="w-3 h-3 fill-current text-[#F0B955]" />
              <span>Video available</span>
            </span>
          </div>
        )}

        {/* Zoom Hint Icon on Hover */}
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <span className="w-8 h-8 rounded-full bg-[#FFFDF8]/90 border-2 border-[#2A1A12] shadow-sm flex items-center justify-center text-[#2A1A12]">
            <Maximize2 className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Bottom Bar: Prev / Next Buttons (left) & Counter Pill (right) */}
        <div
          className="absolute bottom-3.5 inset-x-3.5 flex items-center justify-between z-10 pointer-events-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Round prev / next buttons */}
          {total > 1 ? (
            <div className="flex items-center gap-1.5 pointer-events-auto">
              <button
                type="button"
                onClick={prevImage}
                aria-label="Previous photo"
                className="w-9 h-9 rounded-full bg-[#FFFDF8] border-2 border-[#2A1A12] text-[#2A1A12] flex items-center justify-center shadow-sm hover:bg-[#9A4F28] hover:text-white transition-all active:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#9A4F28]"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                aria-label="Next photo"
                className="w-9 h-9 rounded-full bg-[#FFFDF8] border-2 border-[#2A1A12] text-[#2A1A12] flex items-center justify-center shadow-sm hover:bg-[#9A4F28] hover:text-white transition-all active:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#9A4F28]"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          ) : (
            <div />
          )}

          {/* Counter pill "1 / 2" */}
          <div className="pointer-events-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-[#FFFDF8] border-2 border-[#2A1A12] text-[#2A1A12] font-body font-bold text-xs shadow-sm">
              {activeIndex + 1} / {total}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Thumbnails Row Below Main Card */}
      {total > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
          {images.map((img, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`View photo ${idx + 1} of ${total}`}
                aria-current={isActive}
                className={cn(
                  "relative w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-[10px] border-2 overflow-hidden shrink-0 transition-all focus:outline-none",
                  isActive
                    ? "border-[#9A4F28] ring-2 ring-[#9A4F28] ring-offset-2 ring-offset-[#FFF3D9] scale-102"
                    : "border-[#2A1A12] opacity-75 hover:opacity-100 hover:border-[#9A4F28]"
                )}
              >
                <Image
                  src={img}
                  alt={`${puppy.name} thumbnail ${idx + 1}`}
                  fill
                  sizes="68px"
                  className="object-cover"
                />
                {puppy.hasVideo && idx === 0 && (
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center pointer-events-none">
                    <Play className="w-3.5 h-3.5 text-white fill-current" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Click-to-Zoom Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2A1A12]/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8"
            onClick={() => setIsLightboxOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={`${puppy.name} photo gallery lightbox`}
          >
            {/* Top Bar with Close button */}
            <div className="w-full max-w-4xl flex items-center justify-between text-white py-2 z-10">
              <span className="font-display font-bold text-lg text-[#FFF3D9]">
                {puppy.name} ({activeIndex + 1} of {total})
              </span>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                aria-label="Close photo preview"
                className="w-10 h-10 rounded-full bg-[#FFFDF8] text-[#2A1A12] border-2 border-[#2A1A12] flex items-center justify-center hover:bg-[#9A4F28] hover:text-white transition-colors focus:outline-none"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Central Lightbox Image */}
            <div
              className="relative w-full max-w-3xl flex-1 my-3 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[70vh] rounded-[18px] border-2 border-white/20 overflow-hidden shadow-2xl">
                <Image
                  src={images[activeIndex]}
                  alt={`${puppy.name} - ${puppy.breed}`}
                  fill
                  sizes="100vw"
                  className="object-contain bg-black/40"
                />
              </div>

              {/* Prev / Next on Lightbox */}
              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    aria-label="Previous photo"
                    className="absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#FFFDF8] border-2 border-[#2A1A12] text-[#2A1A12] flex items-center justify-center shadow-lg hover:bg-[#9A4F28] hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next photo"
                    className="absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#FFFDF8] border-2 border-[#2A1A12] text-[#2A1A12] flex items-center justify-center shadow-lg hover:bg-[#9A4F28] hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </>
              )}
            </div>

            {/* Lightbox Thumbnails Strip */}
            {total > 1 && (
              <div
                className="flex items-center gap-2 overflow-x-auto p-2 bg-black/30 rounded-full max-w-lg z-10"
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={cn(
                      "relative w-12 h-12 rounded-lg border-2 overflow-hidden shrink-0 transition-transform",
                      idx === activeIndex
                        ? "border-[#F0B955] scale-110"
                        : "border-white/40 opacity-70 hover:opacity-100"
                    )}
                  >
                    <Image src={img} alt="" fill sizes="48px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
