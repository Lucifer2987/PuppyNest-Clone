"use client";

import React, { useEffect, useRef } from "react";

/**
 * Paw Cursor & Trail Tunable Constants (matching reference image)
 */
const CURSOR_SIZE = 34; // Cursor size in px on desktop
const PRINT_SIZE = 22; // Stamped footprint size in px
const STRIDE_DISTANCE = 60; // Pixels between stamped prints
const FADE_DURATION = 1200; // Print lifespan in ms
const MAX_PRINTS = 25; // Maximum prints visible at once
const STEP_OFFSET = 11; // Alternating left/right foot offset in px
const INITIAL_OPACITY = 0.55; // Footprint starting opacity

// Color Palette
const COLOR_MAIN = "#C8502A"; // Warm rust orange-brown
const COLOR_HIGHLIGHT = "#E07A4A"; // Subtle lighter highlight (top-left)
const COLOR_DEEP = "#B6431E"; // Subtle shade for bottom-right depth
const OUTLINE_COLOR = "#2A1A12"; // Thick dark brown outline
const OUTLINE_WIDTH = 2.5; // Outline stroke width at base 34px size
const DEFAULT_TILT = (18 * Math.PI) / 180; // 18 degrees clockwise tilt

// Physics & Animation
const LERP_POS = 0.32; // Position follow speed
const LERP_ROT = 0.22; // Trajectory rotation speed
const LERP_SCALE = 0.25; // Scale transition speed

interface StampedPrint {
  x: number; // Document X
  y: number; // Document Y
  angle: number; // Movement direction
  isLeft: boolean; // Alternating foot
  createdAt: number; // Stamped timestamp
}

// 4 distinct toe beans arranged in an arc above the main pad (local units)
const TOES = [
  // Outer left: smaller, angled outward
  { x: -7.2, y: -6.2, rx: 2.6, ry: 3.5, rot: -0.68 },
  // Middle left: larger, slight tilt
  { x: -2.6, y: -10.2, rx: 2.8, ry: 4.0, rot: -0.18 },
  // Middle right: larger, slight tilt
  { x: 2.6, y: -10.2, rx: 2.8, ry: 4.0, rot: 0.18 },
  // Outer right: smaller, angled outward
  { x: 7.2, y: -6.2, rx: 2.6, ry: 3.5, rot: 0.68 },
];

/**
 * Draws the rounded heart/bean main pad path with center at (0, 0)
 */
function traceMainPad(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  // Start at top indentation
  ctx.moveTo(0, -2.2);
  // Top-right lobe
  ctx.bezierCurveTo(2.8, -4.2, 6.8, -3.8, 8.2, -0.5);
  // Right side down to bottom-right
  ctx.bezierCurveTo(9.4, 3.2, 6.8, 6.8, 3.2, 7.2);
  // Bottom center
  ctx.bezierCurveTo(1.2, 7.4, -1.2, 7.4, -3.2, 7.2);
  // Bottom-left up to left side
  ctx.bezierCurveTo(-6.8, 6.8, -9.4, 3.2, -8.2, -0.5);
  // Top-left lobe back to indentation
  ctx.bezierCurveTo(-6.8, -3.8, -2.8, -4.2, 0, -2.2);
  ctx.closePath();
}

/**
 * Draws the full paw shape (main pad + 4 toe beans)
 */
function drawPaw(
  ctx: CanvasRenderingContext2D,
  fill: string | CanvasGradient,
  hasOutline: boolean = false,
  outlineWidth: number = 2.5
) {
  // Set stroke properties if outline enabled
  if (hasOutline) {
    ctx.strokeStyle = OUTLINE_COLOR;
    ctx.lineWidth = outlineWidth;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
  }

  // 1. Draw Main Pad
  traceMainPad(ctx);
  ctx.fillStyle = fill;
  ctx.fill();
  if (hasOutline) {
    ctx.stroke();
  }

  // 2. Draw Four Toe Beans
  for (const toe of TOES) {
    ctx.beginPath();
    ctx.ellipse(toe.x, toe.y, toe.rx, toe.ry, toe.rot, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    if (hasOutline) {
      ctx.stroke();
    }
  }
}

export function PawCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Only run on desktop with a fine pointer (skip touch/mobile)
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const isReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!isFinePointer || isReducedMotion) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Enable custom cursor mode on root html
    document.documentElement.classList.add("has-custom-cursor");

    let animationFrameId: number;
    let dpr = window.devicePixelRatio || 1;

    // Viewport resize handling
    const resizeCanvas = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    // Pointer state
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    let targetAngle = 0;
    let currentAngle = 0;

    let targetScale = 1;
    let currentScale = 1;

    let isInsideWindow = false;
    let isHoveringInput = false;
    let isHoveringInteractive = false;
    let isMouseDown = false;

    // Distance tracking for footprint stamping
    let lastStampPageX = 0;
    let lastStampPageY = 0;
    let isLeftFoot = false;
    let hasMoved = false;

    const prints: StampedPrint[] = [];

    const stampPrint = (pageX: number, pageY: number, angle: number) => {
      isLeftFoot = !isLeftFoot;
      const footSign = isLeftFoot ? -1 : 1;

      // Perpendicular direction to movement
      const perpAngle = angle + Math.PI / 2;
      const offsetX = Math.cos(perpAngle) * STEP_OFFSET * footSign;
      const offsetY = Math.sin(perpAngle) * STEP_OFFSET * footSign;

      prints.push({
        x: pageX + offsetX,
        y: pageY + offsetY,
        angle,
        isLeft: isLeftFoot,
        createdAt: performance.now(),
      });

      // Maintain max print buffer
      if (prints.length > MAX_PRINTS) {
        prints.shift();
      }
    };

    const onPointerMove = (e: MouseEvent) => {
      isInsideWindow = true;
      targetX = e.clientX;
      targetY = e.clientY;

      const pageX = e.pageX;
      const pageY = e.pageY;

      // Element under cursor check
      const target = e.target as HTMLElement | null;
      if (target) {
        const isTextInput = !!target.closest(
          'input, textarea, select, [contenteditable="true"]'
        );
        isHoveringInput = isTextInput;

        const isInteractive =
          !isTextInput &&
          !!target.closest(
            'a, button, [role="button"], .door-card, input[type="submit"], input[type="button"], label, [tabindex]:not([tabindex="-1"])'
          );
        isHoveringInteractive = isInteractive;

        if (isMouseDown) {
          targetScale = 0.85;
        } else if (isInteractive) {
          targetScale = 1.3;
        } else {
          targetScale = 1;
        }
      }

      // First initialization
      if (!hasMoved) {
        currentX = targetX;
        currentY = targetY;
        lastStampPageX = pageX;
        lastStampPageY = pageY;
        hasMoved = true;
        return;
      }

      // Check distance moved from last footprint stamp
      const dist = Math.hypot(pageX - lastStampPageX, pageY - lastStampPageY);

      if (dist >= STRIDE_DISTANCE) {
        const dx = pageX - lastStampPageX;
        const dy = pageY - lastStampPageY;
        // Direction angle (paw faces along trajectory)
        const moveAngle = Math.atan2(dy, dx) + Math.PI / 2;
        targetAngle = moveAngle;

        stampPrint(pageX, pageY, moveAngle);
        lastStampPageX = pageX;
        lastStampPageY = pageY;
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return; // Primary click only
      isMouseDown = true;
      targetScale = 0.85;

      // Stamp one extra print on click
      const pageX = e.pageX;
      const pageY = e.pageY;
      stampPrint(pageX, pageY, currentAngle);
    };

    const onMouseUp = () => {
      isMouseDown = false;
      targetScale = isHoveringInteractive ? 1.3 : 1;
    };

    const onMouseLeave = () => {
      isInsideWindow = false;
    };

    const onMouseEnter = () => {
      isInsideWindow = true;
    };

    window.addEventListener("mousemove", onPointerMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // Animation Loop (60fps canvas render)
    const render = () => {
      const now = performance.now();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Render all active stamped prints (fixed to document coordinates)
      // Flat in rust brown #C8502A at ~0.55 opacity, size 22px
      const printBaseScale = PRINT_SIZE / 22;

      for (let i = prints.length - 1; i >= 0; i--) {
        const p = prints[i];
        const age = now - p.createdAt;

        if (age > FADE_DURATION) {
          prints.splice(i, 1);
          continue;
        }

        const progress = age / FADE_DURATION; // 0 to 1
        const opacity = INITIAL_OPACITY * Math.pow(1 - progress, 1.4);

        // Tiny pop scale in the first 120ms
        let pop = 1;
        if (progress < 0.1) {
          pop = 0.85 + Math.sin((progress / 0.1) * Math.PI * 0.5) * 0.2;
        }

        const renderX = p.x - scrollX;
        const renderY = p.y - scrollY;

        // Skip if outside viewport bounds
        if (
          renderX < -40 ||
          renderX > window.innerWidth + 40 ||
          renderY < -40 ||
          renderY > window.innerHeight + 40
        ) {
          continue;
        }

        const scale = printBaseScale * pop;

        ctx.save();
        ctx.translate(renderX, renderY);
        // Match movement direction
        ctx.rotate(p.angle);
        ctx.scale(scale, scale);
        ctx.globalAlpha = Math.max(0, opacity);

        // Flat rust brown fill without outline or highlight
        drawPaw(ctx, COLOR_MAIN, false);

        ctx.restore();
      }

      // 2. Render smooth following cursor paw (34px, glossy highlight, 2.5px dark outline)
      if (isInsideWindow && !isHoveringInput && hasMoved) {
        // Lerp position
        currentX += (targetX - currentX) * LERP_POS;
        currentY += (targetY - currentY) * LERP_POS;

        // Lerp angle with wrapping
        let diff = targetAngle - currentAngle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        currentAngle += diff * LERP_ROT;

        // Lerp scale
        currentScale += (targetScale - currentScale) * LERP_SCALE;

        const cursorBaseScale = (CURSOR_SIZE / 22) * currentScale;

        ctx.save();
        // The click point (hotspot) is the center of the main pad (0, 0)
        ctx.translate(currentX, currentY);
        // Tilt 18 degrees clockwise by default + movement direction rotation
        ctx.rotate(currentAngle + DEFAULT_TILT);
        ctx.scale(cursorBaseScale, cursorBaseScale);
        ctx.globalAlpha = 1;

        // Soft drop shadow (0 2px 0 rgba(42, 26, 18, 0.35))
        ctx.shadowColor = "rgba(42, 26, 18, 0.35)";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 1;

        // Subtle lighter highlight gradient (top-left #E07A4A to #C8502A to #B6431E)
        const gradient = ctx.createLinearGradient(-7, -12, 6, 7);
        gradient.addColorStop(0, COLOR_HIGHLIGHT);
        gradient.addColorStop(0.35, COLOR_MAIN);
        gradient.addColorStop(1, COLOR_DEEP);

        // Draw paw with 2.5px dark outline
        const scaledOutlineWidth = OUTLINE_WIDTH / cursorBaseScale;
        drawPaw(ctx, gradient, true, scaledOutlineWidth);

        ctx.restore();
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Cleanup listeners on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none select-none z-[9999]"
      aria-hidden="true"
    />
  );
}
