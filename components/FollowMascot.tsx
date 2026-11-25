"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { Mascot, MascotPose } from "@/components/Mascot";
import { useScrollVelocity } from "@/hooks/useScrollVelocity";
import {
  setGlobalMascotPosition,
  setGlobalFloorMode,
  subscribeExcitedMascot,
  subscribeMascotOwner,
  getMascotOwner,
  claimMascotOwnership,
  releaseMascotOwnership,
  setGlobalFooterSleeping,
  getGlobalHeroProgress,
  MascotOwner,
} from "@/hooks/useMascotPosition";
import { getWhatsAppUrl } from "@/lib/config";
import { cn } from "@/lib/utils";

/**
 * =========================================================================
 * TUNABLE CONSTANTS (Follow Mascot Spec)
 * =========================================================================
 */
const MASCOT_SIZE_DESKTOP = 115; // Mascot base size on desktop (px)
const MASCOT_SIZE_MOBILE = 64; // Mascot base size on mobile (px)
const BOTTOM_OFFSET_PERCENT = 12; // Distance from viewport bottom on desktop (% of vh)
const SPRING_STIFFNESS = 140; // Trailing follow spring stiffness
const SPRING_DAMPING = 20; // Trailing follow spring damping
const WALK_VELOCITY_THRESHOLD = 20; // px/s threshold to trigger trotting walk
const STOP_IDLE_DELAY = 300; // ms after scrolling stops to switch to idle
const IDLE_SIT_DELAY = 2500; // ms in idle before sitting
const FAQ_SIT_DELAY = 1000; // ms in idle before sitting when in FAQ section
const INACTIVE_SLEEP_DELAY = 12000; // ms of inactivity before sleeping
const PAW_PRINT_STRIDE = 70; // px of travel between stamped footprints
const PAW_PRINT_LIFETIME = 1200; // ms footprint lifetime
const MAX_PAW_PRINTS_DESKTOP = 15; // Max concurrent footprints on desktop
const MAX_PAW_PRINTS_MOBILE = 8; // Max concurrent footprints on mobile
const CYCLE_DISTANCE_PX = 700; // px of scroll travel per full screen crossing

/**
 * =========================================================================
 * HERO MASCOT HANDOFF CONSTANTS (Scrubbable Scroll Path)
 * =========================================================================
 */
const HERO_HANDOFF_CLIMB_END = 0.20;
const HERO_HANDOFF_JUMP_END = 0.45;
const HERO_HANDOFF_TROT_END = 0.70;
const HERO_HANDOFF_MERGE_END = 1.00;

const HERO_ARC_HEIGHT_DESKTOP = 90; // px
const HERO_ARC_HEIGHT_MOBILE = 60; // px
const HERO_JUMP_ROTATION_DEG = 6; // deg tilt during jump (-6 to +6)
const HERO_MASCOT_BASE_SIZE_DESKTOP = 170;
const HERO_MASCOT_BASE_SIZE_MOBILE = 120;

/**
 * =========================================================================
 * FOOTER BASKET HANDOFF CONSTANTS (Walk -> Hop In -> Settle & Sleep)
 * =========================================================================
 */
const FOOTER_WALK_END = 0.55;
const FOOTER_HOP_END = 0.80;
const FOOTER_SETTLE_END = 1.00;
const FOOTER_ARC_HEIGHT_DESKTOP = 70; // px
const FOOTER_ARC_HEIGHT_MOBILE = 45; // px
const FOOTER_PUPPY_TO_BASKET_SCALE = 0.70; // puppy width ~70% of basket width
const FOOTER_BASKET_WIDTH_DESKTOP = 190; // px (matches Footer.tsx EmptyBasket)
const FOOTER_BASKET_WIDTH_MOBILE = 140; // px
const FOOTER_FAST_SEQUENCE_MS = 900; // time-based fallback for fast scroll / End key

// Barks & Speech Bubbles on Click/Tap
const SPEECH_LINES = ["woof!", "hi friend!", "scroll more!", "adopt me?"];

interface StampedPaw {
  x: number;
  y: number;
  angle: number;
  isLeft: boolean;
  createdAt: number;
}

export function FollowMascot() {
  const pathname = usePathname();
  const isDetailPage = pathname.startsWith("/puppies/") && pathname !== "/puppies";

  const prefersReducedMotion = useReducedMotion();
  const { scrollY, velocity, isScrolling, direction: scrollDirection } = useScrollVelocity(140);

  // Responsive & viewport dimensions
  const [isMobile, setIsMobile] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Active section tracked via IntersectionObserver
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [isFloorMode, setIsFloorMode] = useState<boolean>(false);
  const wasFloorModeRef = useRef<boolean>(false);

  // State machine for mascot poses: walk -> idle -> sit -> sleep
  const [pose, setPose] = useState<MascotPose>("peek");
  const [facing, setFacing] = useState<"left" | "right">("right");
  const [speech, setSpeech] = useState<string | null>(null);
  const [isHop, setIsHop] = useState(false);
  const [isAvoiding, setIsAvoiding] = useState(false);
  const [glanceAngle, setGlanceAngle] = useState(0);
  const [isExcited, setIsExcited] = useState(false);
  const [mascotOwner, setMascotOwner] = useState<MascotOwner>("follow");

  // Subscribe to Mascot Ownership Store (yields if a section claims mascot)
  useEffect(() => {
    setMascotOwner(getMascotOwner());
    return subscribeMascotOwner(setMascotOwner);
  }, []);

  // Pop out animation state when user scrolls past 40px
  const [isPoppingOut, setIsPoppingOut] = useState(false);
  const hasPoppedOutRef = useRef(false);
  const popOutTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (scrollY < 40) {
      hasPoppedOutRef.current = false;
      setIsPoppingOut(false);
    }
  }, [scrollY]);

  // Timers
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sitTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sleepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speechTimerRef = useRef<NodeJS.Timeout | null>(null);
  const excitedTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastClickTimeRef = useRef<number>(0);

  const triggerExcited = useCallback(() => {
    setIsExcited(true);
    if (excitedTimerRef.current) clearTimeout(excitedTimerRef.current);
    excitedTimerRef.current = setTimeout(() => {
      setIsExcited(false);
    }, 1400);
  }, []);

  // Subscribe to external excited triggers (e.g. door opening)
  useEffect(() => {
    return subscribeExcitedMascot(triggerExcited);
  }, [triggerExcited]);

  // Happy moments (sit pose looking at a door in floor mode)
  useEffect(() => {
    if (isFloorMode && pose === "sit") {
      triggerExcited();
    }
  }, [isFloorMode, pose, triggerExcited]);

  // Motion Values for position, scale, and rotation
  const targetX = useMotionValue(100);
  const targetY = useMotionValue(600);
  const targetScale = useMotionValue(1);
  const targetRotate = useMotionValue(0);
  const groundShadowOpacity = useMotionValue(0);

  const springX = useSpring(targetX, { stiffness: SPRING_STIFFNESS, damping: SPRING_DAMPING });
  const springY = useSpring(targetY, { stiffness: SPRING_STIFFNESS, damping: SPRING_DAMPING });
  const springScale = useSpring(targetScale, { stiffness: 160, damping: 22 });
  const springRotate = useSpring(targetRotate, { stiffness: 220, damping: 22 });

  // Hero Handoff & Footer Basket Reactive States
  const [isAboveScallops, setIsAboveScallops] = useState(false);
  const [isInsideBasket, setIsInsideBasket] = useState(false);
  const [isSleepingInBasket, setIsSleepingInBasket] = useState(false);
  const [peekOneEye, setPeekOneEye] = useState(false);
  const [showDustPuff, setShowDustPuff] = useState(false);
  const [heroP, setHeroP] = useState(0);
  const heroAnchorRef = useRef<{ x: number; y: number } | null>(null);
  const prevFooterFRef = useRef<number>(0);
  const isInitialMountRef = useRef<boolean>(true);
  const fastFooterAnimRef = useRef<number | null>(null);
  const isFastFooterPlayingRef = useRef<boolean>(false);
  const peekEyeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to Hero Progress
  useEffect(() => {
    return getGlobalHeroProgress().on("change", (p) => {
      setHeroP(p);
    });
  }, []);

  // Skip hero handoff if page loads already scrolled down (e.g. refresh or anchor link)
  const initialScrollCheckedRef = useRef(false);
  useEffect(() => {
    if (!initialScrollCheckedRef.current) {
      initialScrollCheckedRef.current = true;
      if (typeof window !== "undefined" && window.scrollY > 150) {
        getGlobalHeroProgress().set(1.0);
      }
    }
  }, []);

  // Footprint stamping canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const printsRef = useRef<StampedPaw[]>([]);
  const lastStampPosRef = useRef({ x: 0, y: 0 });
  const isLeftFootRef = useRef(false);

  // Target anchors (Hero Peek, CTA Door, Footer Basket)
  const ctaDoorAnchorRef = useRef<{ x: number; y: number } | null>(null);
  const footerBasketAnchorRef = useRef<{ x: number; y: number } | null>(null);
  const prevSectionRef = useRef<string>("hero");
  const prevScrollYRef = useRef<number>(0);

  // =========================================================================
  // 1. Window Resize & Mobile Detection
  // =========================================================================
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setIsMobile(w < 768);
      setWindowSize({ width: w, height: h });

      if (canvasRef.current) {
        const dpr = window.devicePixelRatio || 1;
        canvasRef.current.width = w * dpr;
        canvasRef.current.height = h * dpr;
        canvasRef.current.style.width = `${w}px`;
        canvasRef.current.style.height = `${h}px`;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Listen for mobile menu state
  useEffect(() => {
    const checkMenu = () => {
      const hasMenu =
        document.body.classList.contains("mobile-menu-open") ||
        document.querySelector("[data-mobile-menu-open='true']") !== null;
      setIsMenuOpen(hasMenu);
    };

    const interval = setInterval(checkMenu, 250);
    return () => clearInterval(interval);
  }, []);

  // =========================================================================
  // 2. Section Awareness via IntersectionObserver
  // =========================================================================
  useEffect(() => {
    const sections = document.querySelectorAll("[data-mascot]");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const mascotAttr = entry.target.getAttribute("data-mascot");
            if (mascotAttr) {
              setActiveSection(mascotAttr);
            }
          }
        });
      },
      {
        rootMargin: "-20% 0px -35% 0px",
        threshold: [0.1, 0.4],
      }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  // =========================================================================
  // 3. Paw Print Footprint Trail via Canvas
  // =========================================================================
  const drawPawPrint = useCallback(
    (ctx: CanvasRenderingContext2D, print: StampedPaw, now: number) => {
      const age = now - print.createdAt;
      if (age > PAW_PRINT_LIFETIME) return false;

      const alpha = 0.4 * (1 - age / PAW_PRINT_LIFETIME);
      const size = 18;

      ctx.save();
      ctx.translate(print.x, print.y);
      ctx.rotate(print.angle);
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillStyle = "#9A4F28";

      // Main Pad
      ctx.beginPath();
      ctx.ellipse(0, 3, size * 0.38, size * 0.32, 0, 0, Math.PI * 2);
      ctx.fill();

      // 4 Toes
      const toeOffsets = [
        { x: -size * 0.32, y: -size * 0.22, r: size * 0.12 },
        { x: -size * 0.12, y: -size * 0.38, r: size * 0.14 },
        { x: size * 0.12, y: -size * 0.38, r: size * 0.14 },
        { x: size * 0.32, y: -size * 0.22, r: size * 0.12 },
      ];

      toeOffsets.forEach((toe) => {
        ctx.beginPath();
        ctx.arc(toe.x, toe.y, toe.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
      return true;
    },
    []
  );

  useEffect(() => {
    let animId: number;
    const renderPrints = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const dpr = window.devicePixelRatio || 1;
          ctx.save();
          ctx.scale(dpr, dpr);
          ctx.clearRect(0, 0, windowSize.width, windowSize.height);

          const now = performance.now();
          printsRef.current = printsRef.current.filter((print) =>
            drawPawPrint(ctx, print, now)
          );
          ctx.restore();
        }
      }
      animId = requestAnimationFrame(renderPrints);
    };

    animId = requestAnimationFrame(renderPrints);
    return () => cancelAnimationFrame(animId);
  }, [windowSize, drawPawPrint]);

  // Stamp footprint when walking
  const stampFootprint = useCallback(
    (curX: number, curY: number, angle: number) => {
      if (isDetailPage) return;
      if (pathname === "/" && getGlobalHeroProgress().get() < 0.50) return;
      isLeftFootRef.current = !isLeftFootRef.current;
      const footOffset = (isLeftFootRef.current ? -1 : 1) * 10;
      const perpAngle = angle + Math.PI / 2;
      const stampX = curX + Math.cos(perpAngle) * footOffset;
      const stampY = curY + Math.sin(perpAngle) * footOffset + 24;

      const maxPrints = isMobile ? MAX_PAW_PRINTS_MOBILE : MAX_PAW_PRINTS_DESKTOP;
      if (printsRef.current.length >= maxPrints) {
        printsRef.current.shift();
      }

      printsRef.current.push({
        x: stampX,
        y: stampY,
        angle,
        isLeft: isLeftFootRef.current,
        createdAt: performance.now(),
      });

      lastStampPosRef.current = { x: curX, y: curY };
    },
    [isMobile]
  );

  // =========================================================================
  // 4. Cursor Glance Tracker (Desktop)
  // =========================================================================
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      const curX = springX.get();
      const curY = springY.get();
      const dx = e.clientX - curX;
      const dy = e.clientY - curY;
      const dist = Math.hypot(dx, dy);

      if (dist < 220) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const clampedAngle = Math.max(-18, Math.min(18, angle * 0.25));
        setGlanceAngle(clampedAngle);
      } else {
        setGlanceAngle(0);
      }

      if (pose === "sleep" && !isSleepingInBasket) {
        setPose("sit");
        setIsHop(true);
        setTimeout(() => setIsHop(false), 450);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile, springX, springY, pose, isSleepingInBasket]);

  // =========================================================================
  // 5. Collision Avoidance with [data-mascot-avoid]
  // =========================================================================
  useEffect(() => {
    const checkAvoidance = () => {
      const curX = springX.get();
      const curY = springY.get();
      const mascotRadius = isMobile ? 36 : 58;

      const avoidElements = document.querySelectorAll("[data-mascot-avoid]");
      let shouldAvoid = false;

      avoidElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const overlaps =
          curX + mascotRadius > rect.left &&
          curX - mascotRadius < rect.right &&
          curY + mascotRadius > rect.top &&
          curY - mascotRadius < rect.bottom;

        if (overlaps) shouldAvoid = true;
      });

      setIsAvoiding(shouldAvoid);
    };

    const interval = setInterval(checkAvoidance, 120);
    return () => clearInterval(interval);
  }, [springX, springY, isMobile]);

  // =========================================================================
  // 6. Section Anchors Update (Hero Peek, CTA Door, Footer Basket)
  // =========================================================================
  useEffect(() => {
    const updateAnchors = () => {
      const heroPeek = document.querySelector('[data-mascot-anchor="hero-peek"]');
      if (heroPeek) {
        const rect = heroPeek.getBoundingClientRect();
        heroAnchorRef.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }

      const ctaDoor =
        document.getElementById("cta-door-target") ||
        document.querySelector("[data-cta-door='true']");
      if (ctaDoor) {
        const rect = ctaDoor.getBoundingClientRect();
        ctaDoorAnchorRef.current = {
          x: rect.left + rect.width / 2,
          y: rect.bottom - 40,
        };
      }

      const basket =
        document.querySelector('[data-mascot-anchor="footer-basket"]') ||
        document.getElementById("footer-mascot-basket") ||
        document.querySelector("[data-mascot-basket='true']");
      if (basket) {
        const rect = basket.getBoundingClientRect();
        footerBasketAnchorRef.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }
    };

    updateAnchors();
    window.addEventListener("scroll", updateAnchors, { passive: true });
    window.addEventListener("resize", updateAnchors, { passive: true });

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(updateAnchors);
      const footerEl = document.querySelector('footer[data-mascot="footer"]');
      if (footerEl) ro.observe(footerEl);
    }

    return () => {
      window.removeEventListener("scroll", updateAnchors);
      window.removeEventListener("resize", updateAnchors);
      if (ro) ro.disconnect();
    };
  }, [pathname]);

  // Current mascot dimension
  const currentSize = isDetailPage
    ? isMobile
      ? 54
      : 72
    : isMobile
    ? MASCOT_SIZE_MOBILE
    : isFloorMode
    ? 105
    : activeSection === "passport" || activeSection === "families"
    ? MASCOT_SIZE_DESKTOP * 0.9
    : MASCOT_SIZE_DESKTOP;

  // =========================================================================
  // 7. Core Follow & Floor Mode Motion Calculation
  // =========================================================================
  useEffect(() => {
    const { width: W, height: H } = windowSize;

    // DETAIL PAGE MODE: Docks small and idle at bottom-right corner
    if (isDetailPage) {
      targetX.set(W - (isMobile ? 56 : 80));
      targetY.set(H - (isMobile ? 68 : 80));
      setPose("idle");
      setFacing("left");
      return;
    }

    if (prefersReducedMotion) {
      const footerEl = document.querySelector('footer[data-mascot="footer"]');
      const footerRect = footerEl ? footerEl.getBoundingClientRect() : null;
      const fReduced = footerRect
        ? Math.max(0, Math.min(1, (H - footerRect.top) / Math.max(1, footerRect.height)))
        : 0;

      if (fReduced >= FOOTER_HOP_END) {
        setIsSleepingInBasket(true);
        setGlobalFooterSleeping(true);
        claimMascotOwnership("footer");
        return;
      } else {
        setIsSleepingInBasket(false);
        setGlobalFooterSleeping(false);
        releaseMascotOwnership("footer");
      }

      targetX.set(isMobile ? 30 : 60);
      targetY.set(windowSize.height - (isMobile ? 90 : 130));
      targetScale.set(isMobile ? 64 / 120 : 115 / 170);
      setIsAboveScallops(true);
      setPose(activeSection === "faq" ? "sit" : "idle");
      return;
    }

    const mascotHeight = isMobile ? HERO_MASCOT_BASE_SIZE_MOBILE : HERO_MASCOT_BASE_SIZE_DESKTOP;
    const followSize = isMobile ? MASCOT_SIZE_MOBILE : MASCOT_SIZE_DESKTOP;
    const followScale = followSize / mascotHeight;

    // Pop out transition when scrolling down past 40px from the hero
    if (pathname === "/" && !hasPoppedOutRef.current && !isPoppingOut) {
      hasPoppedOutRef.current = true;
      setIsPoppingOut(true);

      const heroEl = typeof document !== "undefined" ? document.getElementById("hero-peeking-mascot") : null;
      const rect = heroEl ? heroEl.getBoundingClientRect() : null;
      const peekX = rect ? (rect.left + rect.width / 2) : (W * 0.502);
      const peekY = rect ? (rect.top + rect.height / 2) : (H - (isMobile ? 115 : 150));

      targetX.set(peekX);
      targetY.set(peekY);
      springX.set(peekX);
      springY.set(peekY);
      targetScale.set(1.0);
      springScale.set(1.0);
      setIsAboveScallops(true);
      setShowDustPuff(true);
      setIsHop(true);
      triggerExcited();
      setPose("walk");

      // Pop UP out of the scallop notch
      targetY.set(peekY - (isMobile ? 50 : 70));
      targetRotate.set(8);

      if (popOutTimerRef.current) clearTimeout(popOutTimerRef.current);
      popOutTimerRef.current = setTimeout(() => {
        setIsPoppingOut(false);
        setIsHop(false);
        setShowDustPuff(false);
        targetRotate.set(0);
      }, 500);
      return;
    }

    if (isPoppingOut) {
      return;
    }

    setIsAboveScallops(true);
    setShowDustPuff(false);
    targetScale.set(followScale);

    // Detect if the wooden floor strip is in view
    const floorEl = document.querySelector("[data-floor-strip='true']");
    let floorRect: DOMRect | null = null;
    let floorInView = false;
    if (floorEl) {
      floorRect = floorEl.getBoundingClientRect();
      floorInView = floorRect.top > -80 && floorRect.top < H;
    }

    const inPupsFloor = activeSection === "pups" || floorInView;
    setIsFloorMode(inPupsFloor);

    // =======================================================================
    // FLOOR MODE: Pinned doors section is actively in view
    // =======================================================================
    if (inPupsFloor && floorRect) {
      // Entry jump when transitioning into floor mode
      if (!wasFloorModeRef.current) {
        setIsHop(true);
        setTimeout(() => setIsHop(false), 500);
        setGlobalFloorMode(true);
      }
      wasFloorModeRef.current = true;

      // Feet planted precisely on the top line of the wooden floor
      const floorTop = floorRect.top;
      // Mascot feet rest on the floor strip (offset by paws position in SVG)
      const targetPosY = floorTop + (isMobile ? 22 : 30) - currentSize * 0.38;

      // X stays near fixed run position (~28% desktop, ~18% mobile) + slight forward drift
      const runBaseX = isMobile ? W * 0.18 : W * 0.28;
      const forwardDrift = Math.min(W * 0.06, Math.max(0, (velocity / 200) * 40));
      const targetPosX = runBaseX + forwardDrift;

      targetX.set(targetPosX);
      targetY.set(targetPosY);

      // Facing matches travel direction
      setFacing(scrollDirection === "up" ? "left" : "right");

      // In floor mode: NEVER sit or sleep!
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (sitTimerRef.current) clearTimeout(sitTimerRef.current);
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
      idleTimerRef.current = null;
      sitTimerRef.current = null;
      sleepTimerRef.current = null;

      if (isScrolling && velocity > 15) {
        setPose("walk");

        // Stamp footprints on the floor strip
        const lastPos = lastStampPosRef.current;
        const dist = Math.hypot(targetPosX - lastPos.x, targetPosY - lastPos.y);
        if (dist >= PAW_PRINT_STRIDE) {
          const moveAngle = scrollDirection === "up" ? Math.PI : 0;
          stampFootprint(targetPosX, targetPosY, moveAngle);
        }
      } else {
        // Idle standing with tail wag when scrolling stops
        setPose("idle");
      }

      return;
    }

    // =======================================================================
    // EXITING FLOOR MODE: Walk off to the right and resume normal follow mode
    // =======================================================================
    if (wasFloorModeRef.current && !inPupsFloor) {
      wasFloorModeRef.current = false;
      setGlobalFloorMode(false);
      // Smoothly walk off to the right
      targetX.set(W * 0.88);
    }

    // Default Vertical Placement outside floor mode (stay above mobile sticky bottom bar)
    let targetPosY = isMobile
      ? H - 104
      : H - H * (BOTTOM_OFFSET_PERCENT / 100) - MASCOT_SIZE_DESKTOP / 2;

    prevSectionRef.current = activeSection;
    prevScrollYRef.current = scrollY;

    // Section 9: Footer - Walk to EmptyBasket, Hop In (arc + layer switch), Settle & Sleep
    const footerEl = document.querySelector('footer[data-mascot="footer"]');
    const footerRect = footerEl ? footerEl.getBoundingClientRect() : null;
    const footerProgress = footerRect
      ? Math.max(0, Math.min(1, (H - footerRect.top) / Math.max(1, footerRect.height)))
      : 0;

    if (footerProgress > 0 && footerBasketAnchorRef.current && (mascotOwner === "follow" || mascotOwner === "footer")) {
      claimMascotOwnership("footer");
      const anchor = footerBasketAnchorRef.current;
      const basketWidth = isMobile ? FOOTER_BASKET_WIDTH_MOBILE : FOOTER_BASKET_WIDTH_DESKTOP;
      const sleepScale = (basketWidth * FOOTER_PUPPY_TO_BASKET_SCALE) / mascotHeight;
      const arcHeight = isMobile ? FOOTER_ARC_HEIGHT_MOBILE : FOOTER_ARC_HEIGHT_DESKTOP;
      const stagingX = Math.max(isMobile ? 48 : 80, anchor.x - (isMobile ? 76 : 115));

      // Page load / refresh directly at bottom: place straight asleep in basket
      if (isInitialMountRef.current && footerProgress >= FOOTER_HOP_END) {
        isInitialMountRef.current = false;
        prevFooterFRef.current = footerProgress;
        setIsInsideBasket(true);
        setIsSleepingInBasket(true);
        setGlobalFooterSleeping(true);
        setPose("sleep");
        setFacing("right");
        targetX.set(anchor.x);
        targetY.set(anchor.y);
        springX.set(anchor.x);
        springY.set(anchor.y);
        targetScale.set(sleepScale);
        springScale.set(sleepScale);
        targetRotate.set(0);
        return;
      }
      isInitialMountRef.current = false;

      // Fast scroll / "End" key: play 0.9s time-based hop-in & settle sequence
      if (
        prevFooterFRef.current < FOOTER_WALK_END &&
        footerProgress >= FOOTER_HOP_END &&
        !isFastFooterPlayingRef.current
      ) {
        isFastFooterPlayingRef.current = true;
        const startTime = performance.now();
        const startX = springX.get();
        const startY = springY.get();

        const stepFastFooter = (now: number) => {
          const elapsed = now - startTime;
          const p = Math.min(1, elapsed / FOOTER_FAST_SEQUENCE_MS);
          const latestAnchor = footerBasketAnchorRef.current || anchor;

          if (p < 0.55) {
            // Hop arc into basket
            const tHop = p / 0.55;
            const arcY = -Math.sin(Math.PI * tHop) * arcHeight;
            targetX.set(startX + (latestAnchor.x - startX) * tHop);
            targetY.set(startY + (latestAnchor.y - startY) * tHop + arcY);
            targetRotate.set(Math.sin(Math.PI * tHop) * -10);
            targetScale.set(followScale + (sleepScale - followScale) * tHop);
            setFacing(latestAnchor.x >= startX ? "right" : "left");
            setPose("walk");
            setIsInsideBasket(tHop >= 0.5);
            if (tHop >= 0.88) setShowDustPuff(true);
          } else if (p < 0.85) {
            // Nesting circle turn
            const tNest = (p - 0.55) / 0.30;
            setShowDustPuff(false);
            setIsInsideBasket(true);
            targetX.set(latestAnchor.x);
            targetY.set(latestAnchor.y);
            targetScale.set(sleepScale);
            targetRotate.set(Math.sin(tNest * Math.PI * 2) * 14);
            setFacing(tNest < 0.5 ? "left" : "right");
            setPose("idle");
          } else {
            // Settled & asleep
            setIsInsideBasket(true);
            setIsSleepingInBasket(true);
            setGlobalFooterSleeping(true);
            targetX.set(latestAnchor.x);
            targetY.set(latestAnchor.y);
            targetScale.set(sleepScale);
            targetRotate.set(0);
            setFacing("right");
            setPose("sleep");
          }

          if (p < 1) {
            fastFooterAnimRef.current = requestAnimationFrame(stepFastFooter);
          } else {
            isFastFooterPlayingRef.current = false;
          }
        };

        if (fastFooterAnimRef.current) cancelAnimationFrame(fastFooterAnimRef.current);
        fastFooterAnimRef.current = requestAnimationFrame(stepFastFooter);
        prevFooterFRef.current = footerProgress;
        return;
      }

      if (isFastFooterPlayingRef.current) {
        if (footerProgress < FOOTER_WALK_END && fastFooterAnimRef.current) {
          cancelAnimationFrame(fastFooterAnimRef.current);
          isFastFooterPlayingRef.current = false;
        } else {
          prevFooterFRef.current = footerProgress;
          return;
        }
      }

      prevFooterFRef.current = footerProgress;

      // Phase 1: f 0.00 -> 0.55, WALK straight toward basket (or back to CTA door when scrolling up)
      if (footerProgress <= FOOTER_WALK_END) {
        const tWalk = footerProgress / FOOTER_WALK_END;
        setIsInsideBasket(false);
        setIsSleepingInBasket(false);
        setGlobalFooterSleeping(false);
        setShowDustPuff(false);
        targetRotate.set(0);
        targetScale.set(followScale);

        let startX: number;
        let startY: number;
        if (ctaDoorAnchorRef.current) {
          startX = ctaDoorAnchorRef.current.x;
          startY = Math.min(H - 90, ctaDoorAnchorRef.current.y);
        } else {
          const cycle = scrollY / CYCLE_DISTANCE_PX;
          const mod = cycle % 2;
          const pingPong = mod > 1 ? 2 - mod : mod;
          startX = (isMobile ? W * 0.15 : W * 0.08) + pingPong * ((isMobile ? W * 0.85 : W * 0.88) - (isMobile ? W * 0.15 : W * 0.08));
          startY = targetPosY;
        }

        const walkX = startX + (stagingX - startX) * tWalk;
        const walkY = startY + (targetPosY - startY) * tWalk;

        targetX.set(walkX);
        targetY.set(walkY);
        const destX = scrollDirection === "up" ? startX : anchor.x;
        setFacing(destX >= walkX ? "right" : "left");
        setPose(isScrolling ? "walk" : tWalk < 0.08 && ctaDoorAnchorRef.current ? "sit" : "idle");
        return;
      }

      // Phase 2: f 0.55 -> 0.80, HOP IN parabolic arc + layer switch at peak
      if (footerProgress <= FOOTER_HOP_END) {
        const tHop = (footerProgress - FOOTER_WALK_END) / (FOOTER_HOP_END - FOOTER_WALK_END);
        const arcY = -Math.sin(Math.PI * tHop) * arcHeight;

        setIsSleepingInBasket(false);
        setGlobalFooterSleeping(false);
        setIsInsideBasket(tHop >= 0.5);
        setShowDustPuff(tHop >= 0.85);

        const hopX = stagingX + (anchor.x - stagingX) * tHop;
        const hopBaseY = targetPosY + (anchor.y - targetPosY) * tHop;

        targetX.set(hopX);
        targetY.set(hopBaseY + arcY);
        targetRotate.set(Math.sin(Math.PI * tHop) * -10);
        targetScale.set(followScale + (sleepScale - followScale) * tHop);
        setFacing("right");
        setPose(isScrolling ? "walk" : "idle");
        return;
      }

      // Phase 3: f 0.80 -> 1.00, SETTLE (nesting turn) AND SLEEP
      const tSettle = (footerProgress - FOOTER_HOP_END) / (FOOTER_SETTLE_END - FOOTER_HOP_END);
      setIsInsideBasket(true);
      setShowDustPuff(false);
      targetX.set(anchor.x);
      targetY.set(anchor.y);
      targetScale.set(sleepScale);

      if (tSettle < 0.45) {
        const tNest = tSettle / 0.45;
        setIsSleepingInBasket(false);
        setGlobalFooterSleeping(false);
        targetRotate.set(Math.sin(tNest * Math.PI * 2) * 14);
        setFacing(tNest < 0.5 ? "left" : "right");
        setPose("idle");
      } else {
        setIsSleepingInBasket(true);
        setGlobalFooterSleeping(true);
        targetRotate.set(0);
        setFacing("right");
        setPose("sleep");
      }
      return;
    } else {
      isInitialMountRef.current = false;
      prevFooterFRef.current = 0;
      setIsInsideBasket(false);
      setIsSleepingInBasket(false);
      setGlobalFooterSleeping(false);
      if (mascotOwner === "footer") {
        releaseMascotOwnership("footer");
      }
    }

    // Section 8: CTA Door Scene - Mascot runs to the front door and sits looking up
    if (activeSection === "cta" && ctaDoorAnchorRef.current) {
      const doorAnchor = ctaDoorAnchorRef.current;
      targetX.set(doorAnchor.x);
      targetY.set(Math.min(H - 90, doorAnchor.y));
      setPose("sit");
      setFacing("right");
      return;
    }

    // Horizontal boundaries for normal ping-pong
    let minX = isMobile ? W * 0.15 : W * 0.08;
    let maxX = isMobile ? W * 0.85 : W * 0.88;

    if (activeSection === "journey" && !isMobile) {
      maxX = W * 0.58;
    }

    // Ping-Pong Triangle Wave Calculation
    const cycle = scrollY / CYCLE_DISTANCE_PX;
    const mod = cycle % 2;
    const progress = mod > 1 ? 2 - mod : mod;

    const nextX = minX + progress * (maxX - minX);
    targetX.set(nextX);
    targetY.set(targetPosY);

    let travelDirection: "left" | "right" = mod > 1 ? "left" : "right";
    if (scrollDirection === "up") {
      travelDirection = mod > 1 ? "right" : "left";
    }
    setFacing(travelDirection);

    // Walking / Trotting
    if (isScrolling && velocity > WALK_VELOCITY_THRESHOLD) {
      setPose("walk");

      const lastPos = lastStampPosRef.current;
      const dist = Math.hypot(nextX - lastPos.x, targetPosY - lastPos.y);

      if (dist >= PAW_PRINT_STRIDE) {
        const moveAngle = travelDirection === "right" ? 0 : Math.PI;
        stampFootprint(nextX, targetPosY, moveAngle);
      }

      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (sitTimerRef.current) clearTimeout(sitTimerRef.current);
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    } else if (!isScrolling) {
      if (pose === "walk") {
        if (!idleTimerRef.current) {
          idleTimerRef.current = setTimeout(() => {
            setPose("idle");
            idleTimerRef.current = null;
          }, STOP_IDLE_DELAY);
        }
      }

      const sitDelay = activeSection === "faq" ? FAQ_SIT_DELAY : IDLE_SIT_DELAY;
      if (!sitTimerRef.current && (pose === "idle" || pose === "walk")) {
        sitTimerRef.current = setTimeout(() => {
          setPose("sit");
          sitTimerRef.current = null;
        }, sitDelay);
      }

      if (!sleepTimerRef.current && pose !== "sleep") {
        sleepTimerRef.current = setTimeout(() => {
          setPose("sleep");
          sleepTimerRef.current = null;
        }, INACTIVE_SLEEP_DELAY);
      }
    }
  }, [
    scrollY,
    velocity,
    isScrolling,
    scrollDirection,
    activeSection,
    windowSize,
    isMobile,
    prefersReducedMotion,
    pose,
    targetX,
    targetY,
    currentSize,
    stampFootprint,
    heroP,
    pathname,
    isDetailPage,
  ]);

  // =========================================================================
  // 8. Publish Live Position (60fps) to Shared Store for Door Opening Logic
  // =========================================================================
  useEffect(() => {
    const updatePos = () => {
      const curX = springX.get();
      const curY = springY.get();
      const feetY = curY + currentSize * 0.38;
      setGlobalMascotPosition(curX, curY, feetY);
    };

    const unsubX = springX.on("change", updatePos);
    const unsubY = springY.on("change", updatePos);
    return () => {
      unsubX();
      unsubY();
    };
  }, [springX, springY, currentSize]);

  // Waking up if user resumes scrolling while asleep (outside footer basket)
  useEffect(() => {
    if (isScrolling && pose === "sleep" && !isSleepingInBasket) {
      setPose("walk");
      setIsHop(true);
      setTimeout(() => setIsHop(false), 450);
    }
  }, [isScrolling, pose, isSleepingInBasket]);

  // =========================================================================
  // 9. Dev-only Check: Guarantee exactly one visible mascot
  // =========================================================================
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      const checkSingle = () => {
        const list = document.querySelectorAll('[data-mascot-visible="true"]');
        if (list.length > 1) {
          console.warn(
            `[PuppyNest Warning] Detected ${list.length} visible mascots with data-mascot-visible="true"! Expected exactly 1.`
          );
        }
      };

      const timer = setTimeout(checkSingle, 800);
      return () => clearTimeout(timer);
    }
  }, [activeSection, isFloorMode]);

  // =========================================================================
  // 10. Interactive Tap / Click Handling
  // =========================================================================
  const handleMascotClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    const now = Date.now();
    if (now - lastClickTimeRef.current < 350) {
      window.open(
        getWhatsAppUrl(
          "Hi PuppyNest! I'm chatting with the mascot on your site and would love to enquire about available puppies."
        ),
        "_blank"
      );
      setSpeech("opening WhatsApp! 🐾");
      return;
    }
    lastClickTimeRef.current = now;

    // Clicking sleeping puppy in footer basket: open one eye, wag tail once, show "5 more minutes..." for 2s
    if (isSleepingInBasket && pose === "sleep") {
      triggerExcited();
      setPeekOneEye(true);
      setSpeech("5 more minutes...");
      if (peekEyeTimerRef.current) clearTimeout(peekEyeTimerRef.current);
      peekEyeTimerRef.current = setTimeout(() => {
        setPeekOneEye(false);
      }, 2000);
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
      speechTimerRef.current = setTimeout(() => {
        setSpeech(null);
      }, 2000);
      return;
    }

    setIsHop(true);
    triggerExcited();
    setTimeout(() => setIsHop(false), 500);

    const randomLine = SPEECH_LINES[Math.floor(Math.random() * SPEECH_LINES.length)];
    setSpeech(randomLine);

    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    speechTimerRef.current = setTimeout(() => {
      setSpeech(null);
    }, 2000);

    if (pose === "sleep") {
      setPose("idle");
    }
  };

  // Do not render if mobile menu is open, at top of homepage hero, reduced-motion sleeping in basket, or another section owns the mascot
  const isHeroAtTop = !isDetailPage && pathname === "/" && scrollY < 40;
  if (
    isMenuOpen ||
    isHeroAtTop ||
    (prefersReducedMotion && isSleepingInBasket) ||
    (mascotOwner !== "follow" && mascotOwner !== "footer")
  ) {
    return null;
  }

  const baseMascotRenderSize = isMobile ? HERO_MASCOT_BASE_SIZE_MOBILE : HERO_MASCOT_BASE_SIZE_DESKTOP;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden select-none"
      style={{ zIndex: isInsideBasket ? 20 : isAboveScallops ? 35 : 25 }}
      aria-hidden="true"
    >
      {/* 1. Footprint Trail Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* 2. Floating Follow Mascot Layer */}
      <motion.div
        data-mascot-visible="true"
        style={{
          x: springX,
          y: springY,
          opacity: isAvoiding ? 0.35 : 1,
        }}
        transition={{ opacity: { duration: 0.25 } }}
        className="absolute top-0 left-0 pointer-events-none"
      >
        <div className="-translate-x-1/2 -translate-y-1/2">
          <motion.div
            style={{
              scale: springScale,
              rotate: springRotate,
            }}
            className="flex flex-col items-center pointer-events-none"
          >
        {/* Interactive Speech Bubble (hidden while peeking at top) */}
        {speech && (pathname !== "/" || heroP >= 0.20) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.8 }}
            className="mb-1 pointer-events-none"
          >
            <div className="bg-[#FFFDF8] text-[#2A1A12] border-2 border-[#2A1A12] px-3 py-0.5 rounded-full font-handwriting text-xs sm:text-sm font-bold shadow-sticker tracking-wide speech-bubble-bottom whitespace-nowrap">
              {speech}
            </div>
          </motion.div>
        )}

        {/* Clickable Mascot Hit Box */}
        <motion.div
          animate={isHop ? { y: -18, scale: 1.08 } : { y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          onClick={handleMascotClick}
          onMouseEnter={triggerExcited}
          className="pointer-events-auto cursor-pointer relative group flex flex-col items-center justify-center focus:outline-none"
          role="button"
          tabIndex={0}
          aria-label="Interactive PuppyNest Mascot. Tap to bark, double tap to chat on WhatsApp."
        >
          {/* Gentle Ground Shadow */}
          <motion.div
            style={{ opacity: groundShadowOpacity }}
            className="absolute -bottom-2 w-[72%] h-3.5 bg-[#2A1A12]/20 rounded-full blur-[2px] transition-transform group-hover:scale-110 pointer-events-none"
          />

          {/* Landing Dust Puff Particles */}
          {showDustPuff && (
            <motion.div
              initial={{ opacity: 0.75, scale: 0.6 }}
              animate={{ opacity: 0, scale: 1.35, y: -6 }}
              transition={{ duration: 0.35 }}
              className="absolute -bottom-1 flex items-center justify-between w-20 pointer-events-none"
            >
              <div className="w-3 h-2 rounded-full bg-[#FFFDF8] border border-[#2A1A12]/30 opacity-70" />
              <div className="w-2.5 h-1.5 rounded-full bg-[#FFFDF8] border border-[#2A1A12]/30 opacity-60" />
            </motion.div>
          )}

          {/* Fluffy Mascot SVG */}
          <Mascot
            pose={pose}
            facing={facing}
            isWalking={pose === "walk" && isScrolling}
            isRunning={isFloorMode && pose === "walk" && isScrolling}
            isExcited={isExcited}
            peekOneEye={peekOneEye}
            size={baseMascotRenderSize}
            className="filter drop-shadow-sm transition-transform group-hover:scale-105"
          />
        </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
