import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ChunkyButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  variant?: "primary" | "dark" | "whatsapp" | "outline" | "gold" | "white";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  target?: string;
  rel?: string;
  ariaLabel?: string;
}

export function ChunkyButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  disabled = false,
  target,
  rel,
  ariaLabel,
}: ChunkyButtonProps) {
  const variantStyles = {
    primary:
      "bg-[#9A4F28] hover:bg-[#A9562C] text-white border-2 border-[#2A1A12] shadow-chunky active:shadow-none active:translate-y-[4px]",
    dark:
      "bg-[#2A1A12] hover:bg-[#3D251A] text-white border-2 border-[#2A1A12] shadow-chunky active:shadow-none active:translate-y-[4px]",
    whatsapp:
      "bg-[#3A7D54] hover:bg-[#438F60] text-white border-2 border-[#1E432D] shadow-chunky-green active:shadow-none active:translate-y-[4px]",
    gold:
      "bg-[#F0B955] hover:bg-[#F3C46C] text-[#2A1A12] border-2 border-[#2A1A12] shadow-chunky active:shadow-none active:translate-y-[4px]",
    outline:
      "bg-white hover:bg-[#FFF8EA] text-[#2A1A12] border-2 border-[#2A1A12] shadow-chunky active:shadow-none active:translate-y-[4px]",
    white:
      "bg-[#FFFDF8] hover:bg-white text-[#2A1A12] border-2 border-[#2A1A12] shadow-chunky active:shadow-none active:translate-y-[4px]",
  };

  const sizeStyles = {
    sm: "px-4 py-1.5 text-xs font-bold rounded-full gap-1.5",
    md: "px-6 py-2.5 text-sm md:text-base font-bold rounded-full gap-2",
    lg: "px-8 py-3.5 text-base md:text-lg font-bold rounded-full gap-2.5",
  };

  const commonClass = cn(
    "relative inline-flex items-center justify-center font-body transition-all duration-150 select-none cursor-pointer tracking-wide disabled:opacity-50 disabled:cursor-not-allowed",
    sizeStyles[size],
    variantStyles[variant],
    className
  );

  if (href) {
    const isExternal = href.startsWith("http") || href.startsWith("https") || href.startsWith("mailto:") || href.startsWith("tel:");
    return (
      <Link
        href={href}
        className={commonClass}
        target={target || (isExternal ? "_blank" : undefined)}
        rel={rel || (isExternal ? "noopener noreferrer" : undefined)}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={commonClass}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
