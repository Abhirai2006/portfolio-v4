"use client";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Cursor({
  children,
  className,
  onPositionChange,
  visible = true,
}: {
  children: ReactNode;
  className?: string;
  onPositionChange?: (x: number, y: number) => void;
  visible?: boolean;
}) {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      onPositionChange?.(e.clientX, e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y, onPositionChange]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
          className={cn("pointer-events-none fixed left-0 top-0 z-[60]", className)}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.15 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}