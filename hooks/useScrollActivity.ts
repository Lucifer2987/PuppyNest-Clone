"use client";

import { useState, useEffect, useRef } from "react";
import { useScroll, useVelocity, useSpring, useTransform } from "framer-motion";

/**
 * Hook to detect scroll velocity and whether user is currently scrolling
 */
export function useScrollActivity() {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"down" | "up">("down");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return scrollVelocity.on("change", (latestVelocity) => {
      if (Math.abs(latestVelocity) > 15) {
        setIsScrolling(true);
        setScrollDirection(latestVelocity > 0 ? "down" : "up");

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 120);
      }
    });
  }, [scrollVelocity]);

  return { isScrolling, scrollDirection, scrollVelocity };
}

/**
 * Reusable hook to track a section's scroll progress [0, 1]
 */
export function useSectionProgress(
  targetRef: React.RefObject<HTMLElement>,
  offset: ["start end" | "start start" | "start center", "end start" | "end end" | "end center"] = [
    "start end",
    "end start",
  ]
) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset,
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return { scrollYProgress, smoothProgress };
}
