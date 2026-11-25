"use client";

import React from "react";
import { motion, MotionValue } from "framer-motion";
import { Puppy } from "@/lib/types";
import { DoorGate } from "./DoorGate";
import { MeetThemAllGate } from "./MeetThemAllGate";
import { ArgylePattern } from "@/components/ArgylePattern";

interface FloorTrackProps {
  puppies: Puppy[];
  trackX: MotionValue<number>;
  doorWidth: number;
  doorHeight: number;
  doorGap: number;
  openDoorIds?: Set<string>;
  pinnedDoorIds: Set<string>;
  onTogglePinDoor: (id: string) => void;
  doorThemes: readonly ("warm" | "dark" | "caramel")[];
  isMeetAllApproached?: boolean;
  isMeetAllArrived?: boolean;
  initialPadding?: number;
}

export function FloorTrack({
  puppies,
  trackX,
  doorWidth,
  doorHeight,
  doorGap,
  openDoorIds,
  pinnedDoorIds,
  onTogglePinDoor,
  doorThemes,
  isMeetAllApproached = false,
  isMeetAllArrived = false,
  initialPadding,
}: FloorTrackProps) {
  // Account for all puppy doors + 1 MeetThemAllGate + extra 40vw empty track
  const totalTrackWidth = (puppies.length + 1) * (doorWidth + doorGap) + 900;
  const paddingLeft = initialPadding ?? (doorWidth > 260 ? 96 : 48);

  return (
    <div className="relative w-full h-full flex flex-col justify-end overflow-hidden">
      {/* 1. Background Argyle Parallax Wall */}
      <motion.div
        style={{
          x: trackX,
        }}
        className="absolute inset-0 pointer-events-none select-none opacity-40 will-change-transform"
      >
        <div style={{ width: `${totalTrackWidth * 1.4}px` }} className="h-full relative">
          <ArgylePattern opacity={0.06} size={52} />
        </div>
      </motion.div>

      {/* 2. Main Horizontal Track of Doors */}
      <motion.div
        style={{
          x: trackX,
          width: `${totalTrackWidth}px`,
        }}
        className="relative z-10 flex items-end pl-12 sm:pl-24 will-change-transform pb-0 overflow-visible"
      >
        {puppies.map((pup, idx) => {
          const theme = doorThemes[idx % doorThemes.length];
          const isOpen = openDoorIds ? openDoorIds.has(pup.id) : undefined;
          const isPinned = pinnedDoorIds.has(pup.id);
          const doorOffset = paddingLeft + idx * (doorWidth + doorGap) + doorWidth / 2;

          return (
            <div
              key={pup.id}
              className="overflow-visible"
              style={{
                marginRight: `${doorGap}px`,
              }}
            >
              <DoorGate
                pup={pup}
                index={idx}
                isOpen={isOpen}
                isPinnedOpen={isPinned}
                onTogglePin={() => onTogglePinDoor(pup.id)}
                width={doorWidth}
                height={doorHeight}
                theme={theme}
                trackX={trackX}
                doorOffset={doorOffset}
              />
            </div>
          );
        })}

        {/* 4. FINAL END-CAP GATE: "Meet them all" */}
        <div
          style={{
            marginRight: "40vw", // Extra empty track length after gate for mascot arrival
          }}
        >
          <MeetThemAllGate
            isApproached={isMeetAllApproached}
            isArrived={isMeetAllArrived}
            width={doorWidth}
            height={doorHeight}
          />
        </div>
      </motion.div>

      {/* 3. CONTINUOUS WOODEN FLOOR STRIP (Moves with track) */}
      <div
        data-floor-strip="true"
        className="relative w-full h-16 sm:h-20 bg-[#A0572D] border-t-4 border-[#2A1A12] overflow-hidden shadow-inner flex items-center z-20"
      >
        {/* Moving Wooden Plank Joints (Horizontal translation with track) */}
        <motion.div
          style={{
            x: trackX,
            width: `${totalTrackWidth}px`,
          }}
          className="absolute inset-0 flex items-center will-change-transform pointer-events-none"
        >
          {/* Horizontal Woodgrain Highlights */}
          <div className="absolute inset-0 flex flex-col justify-between opacity-30">
            <div className="w-full h-[1.5px] bg-black/40" />
            <div className="w-full h-[1px] bg-white/35" />
            <div className="w-full h-[1.5px] bg-black/40" />
          </div>

          {/* Vertical Plank Joints every 240px */}
          <div className="flex justify-between w-full opacity-35 px-4">
            {Array.from({ length: Math.ceil(totalTrackWidth / 220) }).map((_, i) => (
              <div key={i} className="w-[2px] h-20 bg-black/50" />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
