"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X, ChevronDown } from "lucide-react";

import narutoFull from "@/assets/anime/naruto.mp4.asset.json";
import narutoLoop from "@/assets/anime/naruto-loop.mp4.asset.json";
import narutoPoster from "@/assets/anime/naruto.jpg.asset.json";
import aotFull from "@/assets/anime/aot.mp4.asset.json";
import aotLoop from "@/assets/anime/aot-loop.mp4.asset.json";
import aotPoster from "@/assets/anime/aot.jpg.asset.json";
import astaFull from "@/assets/anime/asta.mp4.asset.json";
import astaLoop from "@/assets/anime/asta-loop.mp4.asset.json";
import astaPoster from "@/assets/anime/asta.jpg.asset.json";
import aceFull from "@/assets/anime/ace.mp4.asset.json";
import aceLoop from "@/assets/anime/ace-loop.mp4.asset.json";
import acePoster from "@/assets/anime/ace.jpg.asset.json";
import dsFull from "@/assets/anime/demonslayer.mp4.asset.json";
import dsLoop from "@/assets/anime/demonslayer-loop.mp4.asset.json";
import dsPoster from "@/assets/anime/demonslayer.jpg.asset.json";

type Clip = {
  id: string;
  title: string;
  series: string;
  kanji: string;
  line: string;
  video: string;
  loop: string;
  poster: string;
};

const CLIPS: Clip[] = [
  {
    id: "ace",
    title: "Ace's Sacrifice",
    series: "One Piece · Marineford",
    kanji: "頂上戦争",
    line: "The arc that taught me a system can fail even when everyone does their best. Still my S-tier.",
    video: aceFull.url,
    loop: aceLoop.url,
    poster: acePoster.url,
  },
  {
    id: "naruto",
    title: "Naruto vs Sasuke",
    series: "Naruto Shippuden · Final Valley",
    kanji: "終末の谷",
    line: "Two people who refuse to give up an argument. Basically me and a failing build at 3am.",
    video: narutoFull.url,
    loop: narutoLoop.url,
    poster: narutoPoster.url,
  },
  {
    id: "demonslayer",
    title: "Infinity Castle",
    series: "Demon Slayer",
    kanji: "無限城",
    line: "Total concentration breathing — the exact energy a long debugging night needs.",
    video: dsFull.url,
    loop: dsLoop.url,
    poster: dsPoster.url,
  },
  {
    id: "aot",
    title: "Let the World Burn",
    series: "Attack on Titan",
    kanji: "自由の翼",
    line: "Every reveal rewrites the previous ten episodes. Best-engineered plot I've watched.",
    video: aotFull.url,
    loop: aotLoop.url,
    poster: aotPoster.url,
  },
  {
    id: "asta",
    title: "Demonic Angel Form",
    series: "Black Clover · Sword of the Wizard King",
    kanji: "魔神",
    line: "No magic, all grind. The patron saint of everyone who started from zero.",
    video: astaFull.url,
    loop: astaLoop.url,
    poster: astaPoster.url,
  },
];

function ReelCard({ clip, onOpen }: { clip: Clip; onOpen: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => void ref.current?.play().catch(() => {})}
      onMouseLeave={() => {
        ref.current?.pause();
        if (ref.current) ref.current.currentTime = 0;
      }}
      aria-label={`Play ${clip.title} from ${clip.series}`}
      className="reel-card group relative overflow-hidden rounded-xl border border-border bg-card text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <motion.div layoutId={`reel-${clip.id}`} className="relative aspect-video w-full overflow-hidden">
        <img
          src={clip.poster}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        <video
          ref={ref}
          src={clip.loop}
          poster={clip.poster}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <span className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/60 bg-background/70 backdrop-blur text-primary transition-transform duration-300 group-hover:scale-110">
          <Play className="h-4 w-4" aria-hidden="true" />
        </span>
      </motion.div>
      <div className="relative p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h4 className="font-display text-lg leading-tight">{clip.title}</h4>
          <span className="font-mono text-xs text-primary">{clip.kanji}</span>
        </div>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{clip.series}</p>
      </div>
    </motion.button>
  );
}

function Stage({ clip, onClose }: { clip: Clip; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-background/95 backdrop-blur-md p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={clip.title}
    >
      <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <motion.div
          layoutId={`reel-${clip.id}`}
          className="overflow-hidden rounded-xl border border-border bg-black shadow-2xl"
        >
          <video
            src={clip.video}
            poster={clip.poster}
            controls
            autoPlay
            playsInline
            className="aspect-video w-full"
          />
        </motion.div>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl">
              {clip.title} <span className="ml-2 font-mono text-sm text-primary">{clip.kanji}</span>
            </h3>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{clip.series}</p>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">{clip.line}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close clip"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" /> close
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/** Opt-in anime reel: real clips, hover-preview, click to play full screen. */
export function TechniqueVault() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Clip | null>(null);

  return (
    <div className="mt-14">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-card/50 px-5 py-4 text-left transition-colors hover:border-primary"
      >
        <span>
          <span className="font-display text-lg">The Reel</span>
          <span className="ml-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            5 clips · optional · not required reading
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="reel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
              {CLIPS.map((c) => (
                <ReelCard key={c.id} clip={c} onOpen={() => setActive(c)} />
              ))}
            </div>
            <p className="pt-4 font-mono text-[11px] text-muted-foreground">
              Fan edits sourced from my own watchlist — hover to preview, click to play.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{active && <Stage clip={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </div>
  );
}
