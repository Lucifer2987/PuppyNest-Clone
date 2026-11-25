"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { PolaroidCard, FamilyItem } from "./PolaroidCard";
import { ChunkyButton } from "@/components/ChunkyButton";
import { cn } from "@/lib/utils";

interface PolaroidWallProps {
  items: FamilyItem[];
}

export function PolaroidWall({ items }: PolaroidWallProps) {
  const [visibleCount, setVisibleCount] = useState(24);
  const [activeLightboxItem, setActiveLightboxItem] = useState<FamilyItem | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const displayedItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount]
  );

  const hasMore = visibleCount < items.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 16, items.length));
  };

  // Lightbox navigation
  const currentIndex = activeLightboxItem
    ? items.findIndex((i) => i.id === activeLightboxItem.id)
    : -1;

  const handleNext = useCallback(() => {
    if (currentIndex >= 0) {
      const nextIdx = (currentIndex + 1) % items.length;
      setActiveLightboxItem(items[nextIdx]);
    }
  }, [currentIndex, items]);

  const handlePrev = useCallback(() => {
    if (currentIndex >= 0) {
      const prevIdx = (currentIndex - 1 + items.length) % items.length;
      setActiveLightboxItem(items[prevIdx]);
    }
  }, [currentIndex, items]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!activeLightboxItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveLightboxItem(null);
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLightboxItem, handleNext, handlePrev]);

  // Distribute displayed items into 4 columns with vertical offsets for masonry look
  const columns = useMemo(() => {
    const colCount = 4;
    const cols: FamilyItem[][] = [[], [], [], []];
    displayedItems.forEach((item, idx) => {
      cols[idx % colCount].push(item);
    });
    return cols;
  }, [displayedItems]);

  return (
    <div className="w-full">
      {/* Mobile & Tablet: 2-Column Masonry (shown on < lg so no photos are lost) */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:hidden items-start">
        {/* Column 1 */}
        <div className="flex flex-col gap-4 sm:gap-6 pt-0">
          {displayedItems
            .filter((_, idx) => idx % 2 === 0)
            .map((item, idx) => (
              <PolaroidCard
                key={item.id}
                item={item}
                index={idx * 2}
                onOpenLightbox={setActiveLightboxItem}
              />
            ))}
        </div>

        {/* Column 2 (slight offset for natural feel) */}
        <div className="flex flex-col gap-4 sm:gap-6 pt-3 sm:pt-5">
          {displayedItems
            .filter((_, idx) => idx % 2 === 1)
            .map((item, idx) => (
              <PolaroidCard
                key={item.id}
                item={item}
                index={idx * 2 + 1}
                onOpenLightbox={setActiveLightboxItem}
              />
            ))}
        </div>
      </div>

      {/* Desktop: 3 to 4 Column Masonry Grid with Offset Columns */}
      <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
        {/* Column 0: standard top */}
        <div className="flex flex-col gap-6 sm:gap-8 pt-0">
          {columns[0].map((item, idx) => (
            <PolaroidCard
              key={item.id}
              item={item}
              index={idx * 4}
              onOpenLightbox={setActiveLightboxItem}
            />
          ))}
        </div>

        {/* Column 1: offset +24px */}
        <div className="flex flex-col gap-6 sm:gap-8 pt-6">
          {columns[1].map((item, idx) => (
            <PolaroidCard
              key={item.id}
              item={item}
              index={idx * 4 + 1}
              onOpenLightbox={setActiveLightboxItem}
            />
          ))}
        </div>

        {/* Column 2: offset +12px */}
        <div className="flex flex-col gap-6 sm:gap-8 pt-3">
          {columns[2].map((item, idx) => (
            <PolaroidCard
              key={item.id}
              item={item}
              index={idx * 4 + 2}
              onOpenLightbox={setActiveLightboxItem}
            />
          ))}
        </div>

        {/* Column 3: offset +32px (xl only) */}
        <div className="hidden xl:flex flex-col gap-6 sm:gap-8 pt-8">
          {columns[3].map((item, idx) => (
            <PolaroidCard
              key={item.id}
              item={item}
              index={idx * 4 + 3}
              onOpenLightbox={setActiveLightboxItem}
            />
          ))}
        </div>
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="w-full flex flex-col items-center justify-center mt-12 sm:mt-16 gap-2">
          <button
            type="button"
            onClick={handleLoadMore}
            className="h-12 px-8 rounded-full bg-[#FFFDF8] text-[#2A1A12] border-2 border-[#2A1A12] font-body font-bold text-sm sm:text-base shadow-[0_4px_0_#2A1A12] transition-all hover:bg-[#FFF3D9] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#2A1A12] active:translate-y-0.5 active:shadow-[0_2px_0_#2A1A12] focus:outline-none focus:ring-2 focus:ring-[#9A4F28]"
          >
            <span>Load more happy moments ({items.length - visibleCount} remaining)</span>
          </button>
          <span className="font-handwriting text-xs text-[#7A6355]">
            showing {visibleCount} of {items.length} moments
          </span>
        </div>
      )}

      {/* Lightbox Dialog Modal */}
      <AnimatePresence>
        {activeLightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2A1A12]/92 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8"
            onClick={() => setActiveLightboxItem(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`Enlarged photo of ${activeLightboxItem.alt}`}
            onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchStartX === null) return;
              const diff = touchStartX - e.changedTouches[0].clientX;
              if (Math.abs(diff) > 40) {
                if (diff > 0) handleNext();
                else handlePrev();
              }
              setTouchStartX(null);
            }}
          >
            {/* Top Bar with Close button */}
            <div className="w-full max-w-2xl flex items-center justify-between text-white py-2 z-10">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 fill-[#F0B955] text-[#F0B955]" />
                <span className="font-handwriting text-lg text-[#FFF3D9]">
                  {activeLightboxItem.owner} • {activeLightboxItem.location}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveLightboxItem(null)}
                aria-label="Close enlarged preview"
                className="w-10 h-10 rounded-full bg-[#FFFDF8] text-[#2A1A12] border-2 border-[#2A1A12] flex items-center justify-center hover:bg-[#9A4F28] hover:text-white transition-colors focus:outline-none"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Central Polaroid Container */}
            <div
              className="relative max-w-md w-full my-auto bg-[#FFFDF8] rounded-[8px] border-2 border-[#2A1A12] p-3 sm:p-4 pb-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full aspect-[4/4.5] bg-[#E8DDD0] rounded-[4px] overflow-hidden border border-[#2A1A12]/15">
                <Image
                  src={activeLightboxItem.image}
                  alt={activeLightboxItem.alt}
                  fill
                  sizes="(max-width: 640px) 90vw, 480px"
                  className="object-cover"
                />
              </div>

              {/* Caption & Metadata below photo */}
              <div className="mt-4 px-2 text-center">
                <p className="font-handwriting text-lg sm:text-xl text-[#2A1A12] font-bold leading-snug mb-1">
                  {activeLightboxItem.caption}
                </p>
                <p className="font-body text-xs text-[#7A6355]">
                  {activeLightboxItem.breed} with {activeLightboxItem.owner}
                </p>
              </div>

              {/* Previous / Next Arrow Controls */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous photo"
                className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#FFFDF8] border-2 border-[#2A1A12] text-[#2A1A12] flex items-center justify-center shadow-lg hover:bg-[#9A4F28] hover:text-white transition-colors focus:outline-none"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next photo"
                className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#FFFDF8] border-2 border-[#2A1A12] text-[#2A1A12] flex items-center justify-center shadow-lg hover:bg-[#9A4F28] hover:text-white transition-colors focus:outline-none"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Bottom Counter */}
            <div className="text-white/70 font-body text-xs py-2">
              {currentIndex + 1} of {items.length} moments
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
