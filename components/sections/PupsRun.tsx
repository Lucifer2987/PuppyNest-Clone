"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Puppy } from "@/lib/types";
import { ChunkyButton } from "@/components/ChunkyButton";
import { ScrollRevealText, ScrollFadeUp } from "@/components/ScrollRevealText";
import { usePinnedProgress } from "@/hooks/usePinnedProgress";
import { useMascotPosition } from "@/hooks/useMascotPosition";
import { FloorTrack } from "./FloorTrack";
import { DoorGate } from "./DoorGate";
import { MeetThemAllGate } from "./MeetThemAllGate";
import { cn } from "@/lib/utils";

/**
 * =========================================================================
 * TUNABLE CONSTANTS (PupsRun Spec)
 * =========================================================================
 */
const DOOR_WIDTH_DESKTOP = 290; // px
const DOOR_HEIGHT_DESKTOP = 390; // px
const DOOR_GAP_DESKTOP = 48; // px

const DOOR_WIDTH_MOBILE = 250; // px (~72vw on phones)
const DOOR_HEIGHT_MOBILE = 350; // px
const DOOR_GAP_MOBILE = 24; // px

const MASCOT_X_DESKTOP_PERCENT = 0.28; // 28% from viewport left
const MASCOT_X_MOBILE_PERCENT = 0.18; // 18% from viewport left
const MAX_DRIFT_VW = 6; // up to +6vw forward drift

const OPEN_AHEAD_RATIO = 1.2; // 1.2 door widths ahead to open
const CLOSE_BEHIND_RATIO = 1.25; // 1.25 door widths past to close

const TRACK_SPRING_STIFFNESS = 90;
const TRACK_SPRING_DAMPING = 24;

const SCROLL_VH_PER_DOOR_DESKTOP = 55; // vh per door
const SCROLL_VH_PER_DOOR_MOBILE = 45; // vh per door

const DOOR_THEMES = ["warm", "dark", "caramel"] as const;

interface PupsRunProps {
  puppies: Puppy[];
}

export function PupsRun({ puppies }: PupsRunProps) {
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const scrollRowRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);

  // Filter available puppies
  const displayPuppies = useMemo(
    () => puppies.filter((p) => p.status === "available").slice(0, 7),
    [puppies]
  );

  // Pinned scroll hook
  const { scrollYProgress, isPinned, isScrolling, scrollDirection, velocity } =
    usePinnedProgress(containerRef);

  // Responsive sizing
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setWindowWidth(w);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const doorWidth = isMobile ? DOOR_WIDTH_MOBILE : DOOR_WIDTH_DESKTOP;
  const doorHeight = isMobile ? DOOR_HEIGHT_MOBILE : DOOR_HEIGHT_DESKTOP;
  const doorGap = isMobile ? DOOR_GAP_MOBILE : DOOR_GAP_DESKTOP;
  const doorTotalSpan = doorWidth + doorGap;

  // Mascot screen X anchor
  const mascotAnchorPercent = isMobile ? MASCOT_X_MOBILE_PERCENT : MASCOT_X_DESKTOP_PERCENT;
  const mascotBaseX = windowWidth * mascotAnchorPercent;

  // Track Start & End Translation
  // Progress = 0 -> First door is aligned with mascot
  // Progress = 1 -> Final "Meet them all" gate is aligned with mascot and puppy stops in front of it
  const initialPadding = isMobile ? 48 : 96;
  const trackXStart = mascotBaseX - initialPadding;
  const totalDoorsDistance = displayPuppies.length * doorTotalSpan;
  const trackXEnd = trackXStart - totalDoorsDistance - doorWidth * 0.4;

  // Framer Motion transforms
  const rawTrackX = useTransform(scrollYProgress, [0, 1], [trackXStart, trackXEnd]);
  const smoothTrackX = useSpring(rawTrackX, {
    stiffness: TRACK_SPRING_STIFFNESS,
    damping: TRACK_SPRING_DAMPING,
  });

  const { mascotX } = useMascotPosition();
  const [pinnedDoorIds, setPinnedDoorIds] = useState<Set<string>>(new Set());
  const [isMeetAllApproached, setIsMeetAllApproached] = useState(false);
  const [isMeetAllArrived, setIsMeetAllArrived] = useState(false);

  // Monitor mascot arrival at final "Meet them all" gate
  useEffect(() => {
    if (prefersReducedMotion) return;

    const checkMascotAndGates = () => {
      const currentTrackX = smoothTrackX.get();
      const currentMascotX = mascotX.get();

      // Check distance to the final "Meet them all" end-cap gate
      const meetAllCenterInTrack =
        initialPadding + displayPuppies.length * doorTotalSpan + doorWidth / 2;
      const meetAllScreenX = currentTrackX + meetAllCenterInTrack;
      const distToMeetAll = currentMascotX - meetAllScreenX;

      const isApproachingMeetAll =
        distToMeetAll >= -OPEN_AHEAD_RATIO * doorWidth &&
        distToMeetAll <= CLOSE_BEHIND_RATIO * doorWidth;
      const isArrivingMeetAll = Math.abs(distToMeetAll) < doorWidth * 0.45;

      setIsMeetAllApproached(isApproachingMeetAll);
      setIsMeetAllArrived(isArrivingMeetAll);
    };

    const unsubTrack = smoothTrackX.on("change", checkMascotAndGates);
    const unsubMascot = mascotX.on("change", checkMascotAndGates);
    checkMascotAndGates();

    return () => {
      unsubTrack();
      unsubMascot();
    };
  }, [
    smoothTrackX,
    mascotX,
    initialPadding,
    displayPuppies.length,
    doorTotalSpan,
    doorWidth,
    prefersReducedMotion,
  ]);

  // Toggle user-pinned open state
  const handleTogglePinDoor = (id: string) => {
    setPinnedDoorIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Nav buttons for reduced motion or accessible manual scroll
  const handleManualNav = (dir: "left" | "right") => {
    if (scrollRowRef.current) {
      const amount = dir === "left" ? -300 : 300;
      scrollRowRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  // =========================================================================
  // 1. PREFERS-REDUCED-MOTION FALLBACK
  // Normal horizontal scroll-snap row with all cards open, static sitting puppy
  // =========================================================================
  if (prefersReducedMotion) {
    return (
      <section
        data-mascot="pups"
        className="relative w-full pt-16 sm:pt-20 pb-12 overflow-hidden bg-transparent"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-[#2A1A12]">
                Meet the pups
              </h2>
              <p className="text-base text-[#5A4030] mt-2">
                Real puppies, real photos, looking for their families right now.
              </p>
            </div>
            <ChunkyButton href="/puppies" variant="primary" size="md">
              See all available puppies
            </ChunkyButton>
          </div>
        </div>

        {/* Scrollable Doors with All Cards Open */}
        <div
          ref={scrollRowRef}
          className="flex items-end gap-6 overflow-x-auto px-6 pt-4 pb-8 snap-x snap-mandatory overflow-y-visible"
        >
          {displayPuppies.map((pup, idx) => (
            <div key={pup.id} className="snap-start shrink-0 overflow-visible">
              <DoorGate
                pup={pup}
                index={idx}
                isOpen={true}
                isPinnedOpen={true}
                onTogglePin={() => {}}
                width={doorWidth}
                height={doorHeight}
                theme={DOOR_THEMES[idx % DOOR_THEMES.length]}
              />
            </div>
          ))}

          {/* End-Cap Gate in Reduced Motion */}
          <div className="snap-start shrink-0">
            <MeetThemAllGate
              isApproached={true}
              isArrived={false}
              width={doorWidth}
              height={doorHeight}
            />
          </div>
        </div>
      </section>
    );
  }

  // Calculate container height for pinned vertical scroll
  const vhPerDoor = isMobile ? SCROLL_VH_PER_DOOR_MOBILE : SCROLL_VH_PER_DOOR_DESKTOP;
  const containerHeightStyle = `${100 + (displayPuppies.length + 1) * vhPerDoor}vh`;

  return (
    <section
      ref={containerRef}
      data-mascot="pups"
      style={{ height: containerHeightStyle }}
      className="relative w-full bg-transparent"
    >
      {/* ============================================================
          STICKY 100VH STAGE (Remains pinned while scrolling through container)
          ============================================================ */}
      <div
        ref={stageRef}
        className="sticky top-0 w-full h-screen h-[100svh] overflow-hidden flex flex-col justify-between pt-16 sm:pt-20 pb-0 z-10"
      >
        {/* Stage Header: Title & Direct CTAs */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 z-30 select-none">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3A7D54] animate-pulse" />
                <span className="font-handwriting text-base sm:text-lg text-[#9A4F28] font-bold tracking-wide">
                  trotting down the street
                </span>
              </div>
              <ScrollRevealText
                as="h2"
                className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#2A1A12] tracking-tight"
              >
                Meet the pups
              </ScrollRevealText>
              <ScrollFadeUp
                delay={0.15}
                className="text-sm sm:text-base text-[#5A4030] mt-1.5 font-normal max-w-xl"
              >
                Watch the puppy run and open each gateway, revealing real photos and details.
              </ScrollFadeUp>
            </div>

            <ScrollFadeUp delay={0.2} className="flex items-center gap-3">
              <ChunkyButton
                href="/puppies"
                variant="primary"
                size="md"
                className="w-full sm:w-auto shadow-chunky"
              >
                See all available puppies
              </ChunkyButton>
            </ScrollFadeUp>
          </div>
        </div>

        {/* ============================================================
            MAIN STAGE: Wide Track of Doors (Mascot driven by global FollowMascot)
            ============================================================ */}
        <div className="relative w-full flex-1 flex flex-col justify-end overflow-hidden pb-0">
          {/* Horizontal Doors Track & Moving Wooden Floor */}
          <FloorTrack
            puppies={displayPuppies}
            trackX={smoothTrackX}
            doorWidth={doorWidth}
            doorHeight={doorHeight}
            doorGap={doorGap}
            pinnedDoorIds={pinnedDoorIds}
            onTogglePinDoor={handleTogglePinDoor}
            doorThemes={DOOR_THEMES}
            isMeetAllApproached={isMeetAllApproached}
            isMeetAllArrived={isMeetAllArrived}
            initialPadding={initialPadding}
          />
        </div>
      </div>
    </section>
  );
}
