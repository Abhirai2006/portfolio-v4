"use client";
import { AnimatePresence, motion } from "framer-motion";
import { cloneElement, Children, useState, type ReactElement } from "react";
import { cn } from "@/lib/utils";

export function AnimatedBackground({
  children,
  defaultValue,
  className,
  transition = { type: "spring" as const, bounce: 0.2, duration: 0.5 },
  enableHover = false,
}: {
  children: ReactElement<{ "data-id": string }>[];
  defaultValue?: string;
  className?: string;
  transition?: any;
  enableHover?: boolean;
}) {
  const [active, setActive] = useState<string | null>(defaultValue ?? null);
  return (
    <>
      {Children.map(children, (child) => {
        const id = child.props["data-id"];
        const isActive = active === id;
        const handlers = enableHover
          ? { onMouseEnter: () => setActive(id), onMouseLeave: () => setActive(null) }
          : { onClick: () => setActive(id) };
        return cloneElement(child, {
          ...(child.props as any),
          ...handlers,
          className: cn("relative", (child.props as any).className),
          children: (
            <>
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    layoutId="animated-bg"
                    className={cn("absolute inset-0 -z-10", className)}
                    transition={transition}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>
              <span className="relative z-10">{(child.props as any).children}</span>
            </>
          ),
        });
      })}
    </>
  );
}