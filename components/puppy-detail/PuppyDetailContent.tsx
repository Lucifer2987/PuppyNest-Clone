"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Puppy } from "@/lib/types";
import { PuppyGallery } from "./PuppyGallery";
import { PuppyInfoCard } from "./PuppyInfoCard";
import { TheWayHomeSection } from "./TheWayHomeSection";
import { EnquiryFormCard } from "./EnquiryFormCard";
import { PrevNextPuppyNav } from "./PrevNextPuppyNav";
import { MobileStickyBottomBar } from "./MobileStickyBottomBar";
import { ArgylePattern } from "@/components/ArgylePattern";

interface PuppyDetailContentProps {
  puppy: Puppy;
  prevPuppy: Puppy;
  nextPuppy: Puppy;
}

export function PuppyDetailContent({
  puppy,
  prevPuppy,
  nextPuppy,
}: PuppyDetailContentProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.06, // 60ms stagger per specification
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 18,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.25, 1, 0.5, 1],
      },
    },
  };

  return (
    <div className="relative w-full min-h-screen bg-[#FFFDF8] text-[#5A4030] overflow-x-hidden selection:bg-[#F0B955] selection:text-[#2A1A12]">
      {/* 1. Top Faint Argyle Diamond Lattice Pattern */}
      <div className="absolute top-0 inset-x-0 h-[480px] pointer-events-none overflow-hidden">
        <ArgylePattern opacity={0.05} size={42} />
      </div>

      {/* 2. Main Content Container (desktop ~1200px max width, centered) */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20 sm:pb-28"
      >
        {/* A) Breadcrumb Row & Numbered Label "1 hello, it's me" */}
        <motion.div variants={itemVariants} className="mb-6 sm:mb-8 select-none">
          {/* Breadcrumb: "Available puppies / {name}" in small Figtree (13px, rust links, last item dark) */}
          <nav aria-label="Breadcrumb" className="font-body text-[13px] font-semibold mb-3">
            <ol className="flex items-center gap-1.5 text-[#9A4F28]">
              <li>
                <Link href="/puppies" className="hover:underline hover:text-[#2A1A12] transition-colors">
                  Available puppies
                </Link>
              </li>
              <li className="text-[#5A4030]/60">/</li>
              <li className="text-[#2A1A12] font-bold" aria-current="page">
                {puppy.name}
              </li>
            </ol>
          </nav>

          {/* Numbered Section Label: Small round badge "1" + handwritten "hello, it's me!" */}
          <div className="inline-flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#FFF3D9] border-2 border-[#2A1A12] text-[#2A1A12] font-body text-xs font-black flex items-center justify-center shadow-xs">
              1
            </span>
            <span className="font-handwriting text-base sm:text-lg text-[#9A4F28] font-bold tracking-wide">
              hello, it&apos;s me!
            </span>
          </div>
        </motion.div>

        {/* B) Two-Column Hero (about 62% / 38%, gap 24px) */}
        <motion.section
          variants={itemVariants}
          aria-label={`${puppy.name} profile and details`}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-start mb-10 sm:mb-14"
        >
          {/* LEFT, Gallery: 62% column (~7-8 of 12) */}
          <div className="lg:col-span-7 xl:col-span-7 w-full">
            <PuppyGallery puppy={puppy} />
          </div>

          {/* RIGHT, Info Card & Checklist: 38% column (~5 of 12) */}
          <div className="lg:col-span-5 xl:col-span-5 w-full">
            <PuppyInfoCard puppy={puppy} />
          </div>
        </motion.section>

        {/* C) "The way home" Section */}
        <motion.div variants={itemVariants} className="mb-10 sm:mb-14">
          <TheWayHomeSection origin={puppy.origin} />
        </motion.div>

        {/* D) Enquiry Form Card (id="enquire") */}
        <motion.div variants={itemVariants} className="mb-10 sm:mb-14">
          <EnquiryFormCard puppy={puppy} />
        </motion.div>

        {/* E) Previous / Next Puppy Cards */}
        <motion.div variants={itemVariants}>
          <PrevNextPuppyNav prevPuppy={prevPuppy} nextPuppy={nextPuppy} />
        </motion.div>
      </motion.main>

      {/* Mobile Sticky Bottom Bar (appears below 640px) */}
      <MobileStickyBottomBar puppy={puppy} />
    </div>
  );
}
