"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Puppy } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PrevNextPuppyNavProps {
  prevPuppy: Puppy;
  nextPuppy: Puppy;
  className?: string;
}

export function PrevNextPuppyNav({ prevPuppy, nextPuppy, className }: PrevNextPuppyNavProps) {
  return (
    <div className={cn("w-full grid grid-cols-1 sm:grid-cols-2 gap-4 select-none pb-12", className)}>
      {/* 1. Previous Puppy Card */}
      <Link
        href={`/puppies/${prevPuppy.slug}`}
        className="group relative flex items-center gap-3.5 p-3.5 sm:p-4 rounded-[18px] border-[2.5px] border-[#2A1A12] bg-[#FFFDF8] shadow-[4px_4px_0_#2A1A12] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_0_#2A1A12] active:translate-y-0.5 active:shadow-[0_2px_0_#2A1A12] focus:outline-none focus:ring-2 focus:ring-[#9A4F28]"
      >
        {/* Round Thumbnail */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#2A1A12] overflow-hidden shrink-0 bg-[#EFEAE2]">
          <Image
            src={prevPuppy.images[0] || "/images/placeholder-pup.jpg"}
            alt={prevPuppy.name}
            fill
            sizes="56px"
            className="object-cover group-hover:scale-105 transition-transform"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#7A6355] uppercase tracking-wider mb-0.5">
            <ChevronLeft className="w-3 h-3 stroke-[2.5]" />
            <span>Previous pup</span>
          </div>
          <h4 className="font-display font-extrabold text-base sm:text-lg text-[#2A1A12] group-hover:text-[#9A4F28] transition-colors truncate">
            {prevPuppy.name}
          </h4>
          <p className="font-body text-xs text-[#5A4030] truncate">
            {prevPuppy.breed}
          </p>
        </div>
      </Link>

      {/* 2. Next Puppy Card */}
      <Link
        href={`/puppies/${nextPuppy.slug}`}
        className="group relative flex items-center justify-between gap-3.5 p-3.5 sm:p-4 rounded-[18px] border-[2.5px] border-[#2A1A12] bg-[#FFFDF8] shadow-[4px_4px_0_#2A1A12] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_0_#2A1A12] active:translate-y-0.5 active:shadow-[0_2px_0_#2A1A12] focus:outline-none focus:ring-2 focus:ring-[#9A4F28]"
      >
        {/* Info */}
        <div className="flex-1 min-w-0 text-left sm:text-right order-2 sm:order-1">
          <div className="flex items-center sm:justify-end gap-1 text-[11px] font-bold text-[#7A6355] uppercase tracking-wider mb-0.5">
            <span>Next pup</span>
            <ChevronRight className="w-3 h-3 stroke-[2.5]" />
          </div>
          <h4 className="font-display font-extrabold text-base sm:text-lg text-[#2A1A12] group-hover:text-[#9A4F28] transition-colors truncate">
            {nextPuppy.name}
          </h4>
          <p className="font-body text-xs text-[#5A4030] truncate">
            {nextPuppy.breed}
          </p>
        </div>

        {/* Round Thumbnail */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#2A1A12] overflow-hidden shrink-0 bg-[#EFEAE2] order-1 sm:order-2">
          <Image
            src={nextPuppy.images[0] || "/images/placeholder-pup.jpg"}
            alt={nextPuppy.name}
            fill
            sizes="56px"
            className="object-cover group-hover:scale-105 transition-transform"
          />
        </div>
      </Link>
    </div>
  );
}
