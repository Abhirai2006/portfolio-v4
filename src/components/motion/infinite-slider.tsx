"use client";
import { motion, useAnimationControls } from "framer-motion";
import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  speedOnHover,
  direction = "horizontal",
  reverse = false,
  className,
}: {
  children: ReactNode;
  gap?: number;
  duration?: number;
  speedOnHover?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  className?: string;
}) {
  const [ref, { width, height }] = useMeasure();
  const translation = direction === "horizontal" ? -width : -height;
  const controls = useAnimationControls();
  const [dur, setDur] = useState(duration);
  const isFirst = useRef(true);

  useEffect(() => {
    if (!width && !height) return;
    const from = reverse ? translation - gap : 0;
    const to = reverse ? 0 : translation - gap;
    const key = direction === "horizontal" ? "x" : "y";
    controls.start({
      [key]: [from, to],
      transition: {
        ease: "linear",
        duration: dur,
        repeat: Infinity,
        ...(isFirst.current ? {} : { from: (from + to) / 2 }),
      },
    } as any);
    isFirst.current = false;
  }, [dur, width, height, gap, translation, direction, reverse, controls]);

  const hoverProps = speedOnHover
    ? {
        onMouseEnter: () => setDur(speedOnHover),
        onMouseLeave: () => setDur(duration),
      }
    : {};

  return (
    <div className={cn("overflow-hidden", className)} {...hoverProps}>
      <motion.div
        className="flex w-max"
        style={{ gap, flexDirection: direction === "horizontal" ? "row" : "column" }}
        animate={controls}
      >
        <div ref={ref} className="flex" style={{ gap, flexDirection: direction === "horizontal" ? "row" : "column" }}>
          {children}
        </div>
        <div className="flex" style={{ gap, flexDirection: direction === "horizontal" ? "row" : "column" }} aria-hidden>
          {Children.map(children, (c) => c)}
        </div>
      </motion.div>
    </div>
  );
}

function useMeasure() {
  const ref = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => {
      const r = e.contentRect;
      setRect({ width: r.width, height: r.height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, rect] as const;
}