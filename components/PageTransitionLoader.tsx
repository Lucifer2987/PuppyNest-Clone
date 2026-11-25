"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Mascot } from "@/components/Mascot";
import { PawIcon } from "@/components/PawTrail";

export function PageTransitionLoader() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  const [isLoading, setIsLoading] = useState(false);
  const prevPathnameRef = useRef(pathname);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
  };

  // Intercept internal link clicks to show the curtain immediately on navigation start
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const targetAttr = anchor.getAttribute("target");
      if (!href || targetAttr === "_blank") return;
      if (!href.startsWith("/") || href.startsWith("//")) return;

      // Ignore same-page hash links or clicking the exact current route
      const nextPath = href.split("#")[0].split("?")[0] || "/";
      if (nextPath === pathname) return;

      clearTimers();
      setIsLoading(true);

      // Safety fallback in case navigation is aborted
      safetyTimerRef.current = setTimeout(() => {
        setIsLoading(false);
      }, 2500);
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [pathname]);

  // When pathname changes (including browser back/forward), show briefly then reveal
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      clearTimers();
      setIsLoading(true);

      hideTimerRef.current = setTimeout(() => {
        setIsLoading(false);
      }, prefersReducedMotion ? 180 : 480);
    }

    return () => clearTimers();
  }, [pathname, prefersReducedMotion]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="page-transition-curtain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={
            prefersReducedMotion
              ? { opacity: 0, transition: { duration: 0.2 } }
              : {
                  y: "-100%",
                  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                }
          }
          transition={{ duration: 0.16 }}
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center pointer-events-auto select-none"
          style={{
            background:
              "radial-gradient(circle at 50% 48%, #FFFDF8 0%, #FFF5DE 45%, #F4DFB8 100%)",
          }}
          role="status"
          aria-live="polite"
          aria-label="Loading page"
        >
          {/* Subtle diagonal argyle diamond grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-45"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='%23C98B4D' stroke-opacity='0.22' stroke-width='1'/%3E%3C/svg%3E")`,
              backgroundSize: "40px 40px",
              backgroundPosition: "center center",
            }}
            aria-hidden="true"
          />

          {/* Centerpiece: trailing paw prints + walking puppy + tagline */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-end gap-2.5">
              {/* 3 fading paw prints behind the puppy */}
              <div className="flex items-center gap-2.5 pb-2 text-[#C98B4D]" aria-hidden="true">
                <span className="opacity-30 -rotate-12">
                  <PawIcon size={10} fill="currentColor" />
                </span>
                <span className="opacity-55 -rotate-6 translate-y-1">
                  <PawIcon size={11} fill="currentColor" />
                </span>
                <span className="opacity-85 -rotate-12">
                  <PawIcon size={12} fill="currentColor" />
                </span>
              </div>

              {/* Walking Mascot */}
              <div className="shrink-0">
                <Mascot pose="walk" size={60} />
              </div>
            </div>

            <p className="mt-1 font-handwriting text-[16px] text-[#7A4B2E] tracking-wide">
              every puppy is family
            </p>
          </div>

          {/* Dark-outlined Scalloped Bottom Edge */}
          <div
            className="absolute -bottom-[17px] inset-x-0 w-full pointer-events-none"
            style={{ height: 18 }}
            aria-hidden="true"
          >
            <svg
              className="w-full h-full block"
              preserveAspectRatio="none"
              viewBox="0 0 1440 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="curtain-scallop"
                  x="0"
                  y="0"
                  width="40"
                  height="18"
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M0 0 A20 15.5 0 0 0 40 0 Z" fill="#F4DFB8" />
                  <path
                    d="M0 0 A20 15.5 0 0 0 40 0"
                    fill="none"
                    stroke="#2A1A12"
                    strokeWidth="2.2"
                  />
                </pattern>
              </defs>
              <rect width="1440" height="18" fill="url(#curtain-scallop)" />
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
