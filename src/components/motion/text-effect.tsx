"use client";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const defaultContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const defaultItem: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5 } },
};

export function TextEffect({
  children,
  per = "word",
  as: Tag = "p",
  className,
  delay = 0,
}: {
  children: string;
  per?: "word" | "char";
  as?: any;
  className?: string;
  delay?: number;
}) {
  const units = per === "word" ? children.split(" ") : children.split("");
  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={defaultContainer}
        transition={{ delayChildren: delay }}
        className={cn("inline-block", className)}
      >
        <Tag>
          {units.map((u, i) => (
            <motion.span key={i} variants={defaultItem} className="inline-block">
              {u}
              {per === "word" && i < units.length - 1 ? "\u00A0" : ""}
            </motion.span>
          ))}
        </Tag>
      </motion.div>
    </AnimatePresence>
  );
}