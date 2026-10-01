"use client";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  Children,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type DockContextValue = {
  mouseX: MotionValue<number>;
  spring: { mass: number; stiffness: number; damping: number };
  magnification: number;
  distance: number;
};
const DockContext = createContext<DockContextValue | null>(null);
const useDock = () => {
  const ctx = useContext(DockContext);
  if (!ctx) throw new Error("Dock components must live inside <Dock>");
  return ctx;
};

export function Dock({
  children,
  className,
  magnification = 70,
  distance = 140,
  panelHeight = 64,
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
}: {
  children: ReactNode;
  className?: string;
  magnification?: number;
  distance?: number;
  panelHeight?: number;
  spring?: { mass: number; stiffness: number; damping: number };
}) {
  const mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto flex items-end gap-3 rounded-2xl border border-border bg-background/70 px-3 pb-2 pt-2 backdrop-blur-xl shadow-2xl",
        className,
      )}
      style={{ height: panelHeight }}
    >
      <DockContext.Provider value={{ mouseX, spring, magnification, distance }}>
        {children}
      </DockContext.Provider>
    </motion.div>
  );
}

export function DockItem({
  children,
  className,
  onClick,
  href,
  label,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { mouseX, spring, magnification, distance } = useDock();
  const [hovered, setHovered] = useState(false);

  const dist = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - rect.x - rect.width / 2;
  });
  const width = useTransform(dist, [-distance, 0, distance], [40, magnification, 40]);
  const w = useSpring(width, spring);

  const content = (
    <motion.div
      ref={ref}
      style={{ width: w, height: w }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={onClick}
      className={cn(
        "relative flex aspect-square items-center justify-center rounded-full bg-secondary/60 border border-border cursor-pointer",
        className,
      )}
    >
      {Children.map(children, (child) =>
        cloneElement(child as ReactElement<any>, { hovered } as any),
      )}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} aria-label={label} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full">
        {content}
      </a>
    );
  }
  return content;
}

export function DockLabel({
  children,
  className,
  hovered,
}: {
  children: ReactNode;
  className?: string;
  hovered?: boolean;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: hovered ? 1 : 0, y: hovered ? -6 : 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-background/90 px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-foreground backdrop-blur",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

export function DockIcon({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  hovered?: boolean;
}) {
  return (
    <div className={cn("flex h-full w-full items-center justify-center text-primary", className)}>
      {children}
    </div>
  );
}

// helper hook consumed by nothing external but kept for parity
export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return useMemo(() => m, [m]);
}