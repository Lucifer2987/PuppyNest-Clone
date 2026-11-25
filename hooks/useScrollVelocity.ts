"use client";

import { useEffect, useRef, useState } from "react";

export interface ScrollVelocityData {
  scrollY: number;
  velocity: number; // Pixels per second (or per frame)
  isScrolling: boolean;
  direction: "down" | "up" | "idle";
}

/**
 * useScrollVelocity
 * High-performance scroll velocity tracker using passive window scroll listeners
 * and requestAnimationFrame. Computes real-time scroll velocity and direction without layout thrash.
 */
export function useScrollVelocity(idleThresholdMs: number = 180): ScrollVelocityData {
  const [data, setData] = useState<ScrollVelocityData>({
    scrollY: 0,
    velocity: 0,
    isScrolling: false,
    direction: "idle",
  });

  const lastScrollY = useRef(0);
  const lastTimestamp = useRef(0);
  const rafId = useRef<number | null>(null);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    lastScrollY.current = window.scrollY;
    lastTimestamp.current = performance.now();

    const updateScroll = () => {
      const now = performance.now();
      const currentScrollY = window.scrollY;
      const dt = Math.max(1, now - lastTimestamp.current);
      const dy = currentScrollY - lastScrollY.current;

      // Pixels per ms * 1000 = pixels per second
      const instantVelocity = (dy / dt) * 1000;

      const direction: "down" | "up" | "idle" =
        Math.abs(dy) < 0.5 ? "idle" : dy > 0 ? "down" : "up";

      setData({
        scrollY: currentScrollY,
        velocity: Math.abs(instantVelocity),
        isScrolling: Math.abs(dy) > 0.5,
        direction,
      });

      lastScrollY.current = currentScrollY;
      lastTimestamp.current = now;

      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        setData((prev) => ({
          ...prev,
          velocity: 0,
          isScrolling: false,
          direction: "idle",
        }));
      }, idleThresholdMs);
    };

    const handleScroll = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(updateScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [idleThresholdMs]);

  return data;
}
