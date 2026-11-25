"use client";

import { useEffect, useState, useRef } from "react";
import { useScroll, useVelocity, MotionValue } from "framer-motion";

export interface PinnedProgressResult {
  scrollYProgress: MotionValue<number>;
  isPinned: boolean;
  isScrolling: boolean;
  scrollDirection: "down" | "up" | "idle";
  velocity: number;
}

/**
 * usePinnedProgress
 * Tracks scroll progress within a tall pinned container.
 * Computes whether the sticky container is currently active/pinned on screen,
 * along with scroll velocity and travel direction.
 */
export function usePinnedProgress(
  containerRef: React.RefObject<HTMLElement>
): PinnedProgressResult {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progressVelocity = useVelocity(scrollYProgress);

  const [isPinned, setIsPinned] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"down" | "up" | "idle">("idle");
  const [velocity, setVelocity] = useState(0);

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const unsubProgress = scrollYProgress.on("change", (p) => {
      // Container is pinned when progress is strictly between 0 and 1
      setIsPinned(p > 0.005 && p < 0.995);
    });

    const unsubVel = progressVelocity.on("change", (v) => {
      const absV = Math.abs(v);
      setVelocity(absV);

      if (absV > 0.01) {
        setIsScrolling(true);
        setScrollDirection(v > 0 ? "down" : "up");

        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => {
          setIsScrolling(false);
          setScrollDirection("idle");
          setVelocity(0);
        }, 120);
      }
    });

    return () => {
      unsubProgress();
      unsubVel();
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [scrollYProgress, progressVelocity]);

  return {
    scrollYProgress,
    isPinned,
    isScrolling,
    scrollDirection,
    velocity,
  };
}
