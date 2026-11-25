"use client";

import { motionValue, MotionValue } from "framer-motion";

/**
 * Shared MotionValues for the global FollowMascot position.
 * Allows PupsRun, FloorTrack, and DoorGate components to react
 * to the mascot's live 60fps screen coordinates without causing
 * React re-renders.
 */
const globalMascotX = motionValue<number>(100);
const globalMascotY = motionValue<number>(600);
const globalMascotFeetY = motionValue<number>(650);
const globalHeroProgress = motionValue<number>(0);

export function setGlobalHeroProgress(p: number) {
  globalHeroProgress.set(p);
}

export function getGlobalHeroProgress(): MotionValue<number> {
  return globalHeroProgress;
}

let isFloorModeState = false;
let isFooterSleepingState = false;
const floorModeListeners = new Set<(isFloor: boolean) => void>();
const footerSleepingListeners = new Set<(sleeping: boolean) => void>();
const excitedListeners = new Set<() => void>();
const globalFooterSleeping = motionValue<number>(0);

export function setGlobalFooterSleeping(sleeping: boolean) {
  globalFooterSleeping.set(sleeping ? 1 : 0);
  if (isFooterSleepingState !== sleeping) {
    isFooterSleepingState = sleeping;
    footerSleepingListeners.forEach((fn) => fn(sleeping));
  }
}

export function getGlobalFooterSleeping(): boolean {
  return isFooterSleepingState;
}

export function getGlobalFooterSleepingMV(): MotionValue<number> {
  return globalFooterSleeping;
}

export function subscribeFooterSleeping(callback: (sleeping: boolean) => void) {
  footerSleepingListeners.add(callback);
  return () => {
    footerSleepingListeners.delete(callback);
  };
}

/**
 * Mascot Ownership Store: Ensures strictly ONE active mascot on screen.
 * Default is "follow" (the global FollowMascot).
 * Dedicated section mascots (e.g. how-it-works interactive toggle or CTA card)
 * call claimMascotOwnership("how-it-works-toggle") so FollowMascot yields and hides.
 */
export type MascotOwner =
  | "follow"
  | "footer"
  | "how-it-works-toggle"
  | "cta"
  | "faq-mascot"
  | "contact-mascot"
  | "none"
  | string;
let currentMascotOwner: MascotOwner = "follow";
const mascotOwnerListeners = new Set<(owner: MascotOwner) => void>();

export function claimMascotOwnership(owner: MascotOwner) {
  if (currentMascotOwner !== owner) {
    currentMascotOwner = owner;
    mascotOwnerListeners.forEach((fn) => fn(owner));
  }
}

export function releaseMascotOwnership(owner: MascotOwner) {
  if (currentMascotOwner === owner) {
    currentMascotOwner = "follow";
    mascotOwnerListeners.forEach((fn) => fn("follow"));
  }
}

export function getMascotOwner(): MascotOwner {
  return currentMascotOwner;
}

export function subscribeMascotOwner(callback: (owner: MascotOwner) => void) {
  mascotOwnerListeners.add(callback);
  return () => {
    mascotOwnerListeners.delete(callback);
  };
}

export function setGlobalMascotPosition(x: number, y: number, feetY: number) {
  globalMascotX.set(x);
  globalMascotY.set(y);
  globalMascotFeetY.set(feetY);
}

export function setGlobalFloorMode(active: boolean) {
  if (isFloorModeState !== active) {
    isFloorModeState = active;
    floorModeListeners.forEach((fn) => fn(active));
  }
}

export function getGlobalFloorMode() {
  return isFloorModeState;
}

export function triggerExcitedMascot() {
  excitedListeners.forEach((fn) => fn());
}

export function subscribeExcitedMascot(callback: () => void) {
  excitedListeners.add(callback);
  return () => {
    excitedListeners.delete(callback);
  };
}

export function useMascotPosition() {
  return {
    mascotX: globalMascotX,
    mascotY: globalMascotY,
    mascotFeetY: globalMascotFeetY,
    getFloorMode: getGlobalFloorMode,
    subscribeFloorMode: (callback: (isFloor: boolean) => void) => {
      floorModeListeners.add(callback);
      return () => {
        floorModeListeners.delete(callback);
      };
    },
  };
}
