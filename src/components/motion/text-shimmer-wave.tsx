"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function TextShimmerWave({
  children,
  className,
  duration = 1,
  spread = 1,
}: {
  children: string;
  className?: string;
  duration?: number;
  spread?: number;
}) {
  const chars = children.split("");
  return (
    <span className={cn("inline-flex", className)}>
      {chars.map((c, i) => (
        <motion.span
          key={i}
          className="inline-block"
          animate={{
            opacity: [0.35, 1, 0.35],
            color: [
              "var(--tw-shimmer-base, currentColor)",
              "var(--tw-shimmer-highlight, currentColor)",
              "var(--tw-shimmer-base, currentColor)",
            ],
          }}
          transition={{
            duration,
            repeat: Infinity,
            delay: (i * spread) / (chars.length || 1),
            ease: "easeInOut",
          }}
        >
          {c === " " ? "\u00A0" : c}
        </motion.span>
      ))}
    </span>
  );
}