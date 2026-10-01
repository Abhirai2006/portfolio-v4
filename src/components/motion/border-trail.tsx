"use client";
import { motion, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

export function BorderTrail({
  className,
  size = 80,
  transition,
  delay,
}: {
  className?: string;
  size?: number;
  transition?: Transition;
  delay?: number;
}) {
  const t: Transition = transition ?? {
    repeat: Infinity,
    duration: 6,
    ease: "linear",
  };
  return (
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] [mask-image:linear-gradient(#000,#000)] [mask-composite:exclude] overflow-hidden">
      <motion.div
        className={cn("absolute aspect-square rounded-full", className)}
        style={{ width: size, offsetPath: `rect(0 auto auto 0 round ${size}px)` }}
        animate={{ offsetDistance: ["0%", "100%"] }}
        transition={{ ...t, delay }}
      />
    </div>
  );
}