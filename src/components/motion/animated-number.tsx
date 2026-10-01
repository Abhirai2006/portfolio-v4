"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export function AnimatedNumber({
  value,
  className,
  springOptions = { stiffness: 90, damping: 20 },
}: {
  value: number;
  className?: string;
  springOptions?: { stiffness: number; damping: number };
}) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, springOptions);
  const rounded = useTransform(spring, (v) => Math.round(v).toLocaleString());
  useEffect(() => {
    mv.set(value);
  }, [mv, value]);
  return <motion.span className={cn(className)}>{rounded}</motion.span>;
}