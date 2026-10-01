import { useEffect, useRef } from "react";

/**
 * Soft blue glow that follows the cursor. Disabled on touch devices.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let raf = 0;
    let tx = 0, ty = 0, x = 0, y = 0;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const tick = () => {
      x += (tx - x) * 0.15;
      y += (ty - y) * 0.15;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${x - 220}px, ${y - 220}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] h-[440px] w-[440px] rounded-full opacity-40 mix-blend-screen blur-3xl hidden md:block"
      style={{
        background:
          "radial-gradient(circle at center, rgba(59,130,246,0.55), rgba(34,197,94,0.15) 45%, transparent 70%)",
      }}
    />
  );
}