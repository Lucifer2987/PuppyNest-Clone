"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollRevealTextProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  delay?: number;
  stagger?: number;
}

/**
 * Headings reveal line by line (mask rise + slight blur-to-sharp, 0.6s ease-out, 0.08s stagger).
 * All reveals trigger once at ~25% in view.
 */
export function ScrollRevealText({
  children,
  className,
  as: Component = "h2",
  delay = 0,
}: ScrollRevealTextProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  // If text is a string with potential newlines or spans, split into lines
  const content = typeof children === "string" ? children.split("\n") : [children];

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      {content.map((line, idx) => (
        <motion.div
          key={idx}
          initial={{ y: "100%", opacity: 0, filter: "blur(4px)" }}
          animate={
            isInView
              ? { y: 0, opacity: 1, filter: "blur(0px)" }
              : { y: "100%", opacity: 0, filter: "blur(4px)" }
          }
          transition={{
            duration: 0.65,
            ease: [0.16, 1, 0.3, 1],
            delay: delay + idx * 0.08,
          }}
          className="inline-block w-full leading-tight"
        >
          {line}
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Body text fade up once at ~25% in view
 */
export function ScrollFadeUp({
  children,
  className,
  delay = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 24, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
