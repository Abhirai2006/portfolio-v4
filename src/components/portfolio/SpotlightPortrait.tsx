"use client";
import { useRef, useState } from "react";

/**
 * Portrait with a spotlight mask: a desaturated base layer, and a full-colour
 * copy revealed only inside a soft circle that follows the cursor.
 */
export function SpotlightPortrait({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 40 });
  const [on, setOn] = useState(false);

  const mask = `radial-gradient(circle 150px at ${pos.x}% ${pos.y}%, #000 40%, transparent 72%)`;

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
      }}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      className="relative h-[420px] w-[320px] rounded-[2rem] overflow-hidden border border-border shadow-2xl"
    >
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover grayscale contrast-[1.05] brightness-95 transition-all duration-500"
      />
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
        style={{
          opacity: on ? 1 : 0,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: on ? 1 : 0,
          background: `radial-gradient(circle 160px at ${pos.x}% ${pos.y}%, color-mix(in oklab, var(--primary) 20%, transparent), transparent 70%)`,
        }}
      />
    </div>
  );
}