"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

export function Magnetic({
  children,
  intensity = 0.3,
  range = 100,
  spring = { stiffness: 150, damping: 15, mass: 0.1 },
}: {
  children: ReactNode;
  intensity?: number;
  range?: number;
  spring?: { stiffness: number; damping: number; mass: number };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < range) {
        x.set(dx * intensity);
        y.set(dy * intensity);
      } else {
        x.set(0);
        y.set(0);
      }
    };
    const reset = () => {
      x.set(0);
      y.set(0);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", reset);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", reset);
    };
  }, [x, y, intensity, range]);

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} className="inline-block">
      {children}
    </motion.div>
  );
}