"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProjectEntry } from "@/lib/projects";

/**
 * Projects on a slowly turning ring. Drag it, flick it, or use the arrows.
 *
 * Physics (all in degrees, stepped once per animation frame):
 *  - idle: the ring drifts at a gentle constant speed and eases to a stop on hover or focus
 *  - drag: the ring follows the pointer and the release velocity is measured
 *  - coast: that velocity decays with friction
 *  - snap: a damped spring pulls the nearest card to the front, with a little overshoot
 * Cards are positioned straight from the angle each frame (no React re-render per frame).
 */

const AUTO_SPEED = -7; // deg/s while drifting
const FRICTION = 2.3; // 1/s, how fast a flick slows down
const STIFFNESS = 70; // spring pulling a card to the front
const DAMPING = 11; // a little under critical, so it settles with a soft overshoot
const IDLE_BEFORE_DRIFT = 2200; // ms after the last touch before drifting again

const norm = (a: number) => ((((a + 180) % 360) + 360) % 360) - 180; // -180..180

// Where each card sits before the first frame runs, so server-rendered HTML is already on the ring.
function initialStyle(i: number, n: number): React.CSSProperties {
  const th = ((i * 360) / n) * (Math.PI / 180);
  const depth = (Math.cos(th) + 1) / 2;
  return {
    transform: `translate3d(${(Math.sin(th) * 440).toFixed(1)}px, ${(-Math.cos(th) * 46 + (1 - depth) * -18).toFixed(1)}px, 0) scale(${(0.58 + 0.42 * depth).toFixed(3)})`,
    opacity: 0.55 + 0.45 * depth,
    zIndex: Math.round(depth * 100),
  };
}

type Mode = "drift" | "drag" | "coast" | "snap";

export function ProjectOrbit({
  projects,
  onOpen,
  onHoverCard,
}: {
  projects: ProjectEntry[];
  onOpen: (p: ProjectEntry) => void;
  onHoverCard?: (hovering: boolean) => void;
}) {
  const n = projects.length;
  const step = 360 / n;

  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [front, setFront] = useState(0);

  // mutable physics state, kept out of React on purpose
  const s = useRef({
    angle: 0,
    v: 0,
    mode: "drift" as Mode,
    target: 0,
    driftV: 0,
    lastTouch: 0,
    hover: false,
    visible: true,
    reduced: false,
    dragging: false,
    startX: 0,
    startAngle: 0,
    lastX: 0,
    lastT: 0,
    moved: 0,
    frontIdx: 0,
  });

  const render = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const w = stage.clientWidth;
    const compact = w < 640;
    const rx = Math.min(w * (compact ? 0.3 : 0.4), 480);
    const ry = compact ? 26 : 46;
    const st = s.current;

    let best = 0;
    let bestCos = -2;
    for (let i = 0; i < n; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;
      const th = ((i * step + st.angle) * Math.PI) / 180;
      const c = Math.cos(th); // 1 at the front, -1 at the back
      if (c > bestCos) {
        bestCos = c;
        best = i;
      }
      const depth = (c + 1) / 2; // 0..1
      const scale = 0.58 + 0.42 * depth;
      const x = Math.sin(th) * rx;
      const y = -c * ry + (1 - depth) * -18;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
      el.style.opacity = String(0.55 + 0.45 * depth);
      el.style.zIndex = String(Math.round(depth * 100));
      el.style.filter =
        depth > 0.92 ? "none" : `saturate(${0.55 + depth * 0.45}) brightness(${0.5 + depth * 0.5})`;
      el.dataset.front = c > 0.96 ? "true" : "false";
    }
    if (best !== st.frontIdx) {
      st.frontIdx = best;
      setFront(best);
    }
  }, [n, step]);

  // animation loop
  useEffect(() => {
    const st = s.current;
    st.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();

    const nearestTarget = (a: number) => Math.round(a / step) * step;

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (st.mode === "drift") {
        const wantDrift = !st.reduced && !st.hover && now - st.lastTouch > IDLE_BEFORE_DRIFT;
        // ease the drift speed in and out so it never starts or stops abruptly
        st.driftV += ((wantDrift ? AUTO_SPEED : 0) - st.driftV) * Math.min(1, dt * 2.4);
        st.angle += st.driftV * dt;
      } else if (st.mode === "coast") {
        st.v *= Math.exp(-FRICTION * dt);
        st.angle += st.v * dt;
        if (Math.abs(st.v) < 14) {
          st.mode = "snap";
          st.target = nearestTarget(st.angle);
        }
      } else if (st.mode === "snap") {
        if (st.reduced) {
          st.angle = st.target;
          st.v = 0;
        } else {
          const a = STIFFNESS * (st.target - st.angle) - DAMPING * st.v;
          st.v += a * dt;
          st.angle += st.v * dt;
        }
        if (Math.abs(st.target - st.angle) < 0.04 && Math.abs(st.v) < 0.6) {
          st.angle = st.target;
          st.v = 0;
          st.mode = "drift";
          st.driftV = 0;
          st.lastTouch = now;
        }
      }

      render();
      if (st.visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (!raf && st.visible && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        st.visible = Boolean(entry?.isIntersecting);
        if (st.visible) kick();
      },
      { threshold: 0.05 },
    );
    if (stageRef.current) io.observe(stageRef.current);
    const onVis = () => kick();
    document.addEventListener("visibilitychange", onVis);
    const ro = new ResizeObserver(() => render());
    if (stageRef.current) ro.observe(stageRef.current);

    render();
    kick();
    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [render, step]);

  const goTo = useCallback(
    (idx: number) => {
      const st = s.current;
      // shortest way round to the angle that puts card idx at the front
      const want = -idx * step;
      st.target = st.angle + norm(want - st.angle);
      st.mode = "snap";
      st.lastTouch = performance.now();
    },
    [step],
  );

  const nudge = (dir: 1 | -1) => {
    const st = s.current;
    const base = Math.round(st.angle / step) * step;
    st.target = base - dir * step;
    st.mode = "snap";
    st.lastTouch = performance.now();
  };

  // ---- pointer drag (touch-action: pan-y keeps vertical page scroll working on phones) ----
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const st = s.current;
    st.dragging = true;
    st.startX = st.lastX = e.clientX;
    st.startAngle = st.angle;
    st.lastT = performance.now();
    st.v = 0;
    st.moved = 0;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const st = s.current;
    if (!st.dragging) return;
    const dx = e.clientX - st.startX;
    st.moved = Math.max(st.moved, Math.abs(dx));
    if (st.mode !== "drag") {
      if (Math.abs(dx) < 6) return;
      st.mode = "drag";
      stageRef.current?.setPointerCapture(e.pointerId);
    }
    const width = stageRef.current?.clientWidth ?? 800;
    const degPerPx = 150 / Math.max(320, width); // dragging across the stage turns the ring about 150 degrees
    const now = performance.now();
    const dt = Math.max(1, now - st.lastT) / 1000;
    const inst = ((e.clientX - st.lastX) * degPerPx) / dt;
    st.v = st.v * 0.6 + inst * 0.4; // smoothed release velocity
    st.angle = st.startAngle + dx * degPerPx;
    st.lastX = e.clientX;
    st.lastT = now;
    st.lastTouch = now;
  };
  const endDrag = (e: React.PointerEvent) => {
    const st = s.current;
    if (!st.dragging) return;
    st.dragging = false;
    if (stageRef.current?.hasPointerCapture(e.pointerId))
      stageRef.current.releasePointerCapture(e.pointerId);
    if (st.mode === "drag") {
      const stale = performance.now() - st.lastT > 90; // finger rested before lifting: no fling
      if (stale) st.v = 0;
      st.v = Math.max(-420, Math.min(420, st.v));
      st.mode = "coast";
      st.lastTouch = performance.now();
    }
  };

  // sideways trackpad / mouse-wheel gestures spin the ring; plain vertical scrolling is left alone
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      const st = s.current;
      st.v = Math.max(-420, Math.min(420, st.v - e.deltaX * 0.9));
      st.mode = "coast";
      st.lastTouch = performance.now();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      nudge(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      nudge(-1);
    }
  };

  const open = (i: number) => {
    // a drag that ended on a card is not a click
    if (s.current.moved > 6) return;
    goTo(i);
    const p = projects[i];
    if (p) onOpen(p);
  };

  const current = projects[front];

  return (
    <div className="mt-10" role="region" aria-roledescription="carousel" aria-label="Projects">
      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerEnter={() => {
          s.current.hover = true;
        }}
        onPointerLeave={() => {
          s.current.hover = false;
          s.current.lastTouch = performance.now();
        }}
        onFocus={() => {
          s.current.hover = true;
        }}
        onBlur={() => {
          s.current.hover = false;
          s.current.lastTouch = performance.now();
        }}
        onKeyDown={onKeyDown}
        className="orbit-stage isolate relative mx-auto h-[480px] w-full max-w-6xl select-none"
        style={{ touchAction: "pan-y" }}
      >
        {/* decorative orbit: glow plus an ellipse the cards travel along */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2"
        >
          <div className="orbit-glow mx-auto h-72 w-[min(80%,720px)] rounded-full" />
        </div>
        <div
          aria-hidden="true"
          className="orbit-ring pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />

        {projects.map((p, i) => (
          <div
            key={p.slug}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="orbit-card absolute left-1/2 top-1/2 -ml-[150px] -mt-[200px] w-[300px] will-change-transform sm:-ml-[160px] sm:w-[320px]"
            style={initialStyle(i, n)}
          >
            <div className="orbit-card-face group relative flex h-[400px] flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary">
              <button
                type="button"
                onClick={() => open(i)}
                onFocus={() => goTo(i)}
                onPointerEnter={() => onHoverCard?.(true)}
                onPointerLeave={() => onHoverCard?.(false)}
                aria-label={`Open ${p.title} project preview`}
                className="flex w-full flex-1 cursor-pointer flex-col p-5 text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-mono text-xs uppercase tracking-widest text-primary">
                      {p.tag}
                    </div>
                    <h3 className="mt-2 font-display text-2xl leading-tight">{p.title}</h3>
                  </div>
                  <span
                    className="text-primary transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>
                <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
                <dl className="mt-auto grid grid-cols-3 gap-2 border-y border-border/70 py-3">
                  {p.metrics.slice(0, 3).map((m) => (
                    <div key={m.label}>
                      <dt className="sr-only">{m.label}</dt>
                      <dd className="gold-text font-display text-lg leading-none">{m.value}</dd>
                      <dd className="mt-1 font-mono text-[11px] uppercase leading-tight tracking-wide text-muted-foreground">
                        {m.label}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border px-2 py-0.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </button>
              <div className="flex items-center gap-4 px-5 pb-4 pt-1">
                <Link
                  to="/projects/$slug"
                  params={{ slug: p.slug }}
                  tabIndex={front === i ? 0 : -1}
                  className="relative z-10 font-mono text-xs uppercase tracking-widest text-accent underline underline-offset-4 hover:text-primary"
                >
                  Case study →
                </Link>
                {p.live && (
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noreferrer"
                    tabIndex={front === i ? 0 : -1}
                    className="relative z-10 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary"
                  >
                    Live site ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => nudge(-1)}
          aria-label="Previous project"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <p
          className="min-w-[11rem] text-center font-mono text-xs uppercase tracking-widest text-muted-foreground"
          aria-live="polite"
        >
          {String(front + 1).padStart(2, "0")} / {String(n).padStart(2, "0")} · {current?.title}
        </p>
        <button
          type="button"
          onClick={() => nudge(1)}
          aria-label="Next project"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Drag to spin. Click a card to open it.
      </p>
    </div>
  );
}
