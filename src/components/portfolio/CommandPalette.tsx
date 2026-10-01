import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { PROJECTS } from "@/lib/projects";
import { MAIL_INTENTS } from "@/lib/contact";
import { track } from "@/lib/analytics";

type Item = {
  id: string;
  label: string;
  group: string;
  hint?: string;
  run: () => void;
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const items = useMemo<Item[]>(() => {
    const go = (hash: string) => () => {
      void navigate({ to: "/", hash });
      requestAnimationFrame(() =>
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    };
    const open_ = (href: string) => () => window.open(href, "_blank", "noopener");
    return [
      { id: "top", label: "Top of page", group: "Chapters", hint: "00", run: go("top") },
      { id: "origin", label: "Origin Story", group: "Chapters", hint: "01", run: go("origin") },
      { id: "arsenal", label: "Power Levels", group: "Chapters", hint: "02", run: go("arsenal") },
      { id: "github", label: "Live Code Activity", group: "Chapters", hint: "03", run: go("github") },
      { id: "projects", label: "The Arsenal", group: "Chapters", hint: "04", run: go("projects") },
      { id: "ask", label: "Ask Abhishek", group: "Chapters", hint: "05", run: go("ask") },
      { id: "shelf", label: "Anime Shelf", group: "Chapters", hint: "06", run: go("shelf") },
      { id: "contact", label: "Contact", group: "Chapters", hint: "07", run: go("contact") },
      {
        id: "resume",
        label: "Résumé page",
        group: "Pages",
        hint: "/resume",
        run: () => void navigate({ to: "/resume" }),
      },
        {
          id: "reviews",
          label: "Leave a review",
          group: "Pages",
          hint: "/reviews",
          run: () => void navigate({ to: "/reviews" }),
        },
      ...PROJECTS.map((p) => ({
        id: `case-${p.slug}`,
        label: `${p.title} — case study`,
        group: "Case studies",
        hint: `/projects/${p.slug}`,
        run: () => void navigate({ to: "/projects/$slug", params: { slug: p.slug } }),
      })),
      ...MAIL_INTENTS.map((m) => ({
        id: `mail-${m.intent}`,
        label: `Email me — ${m.label}`,
        group: "Contact",
        hint: "mailto",
        run: () => {
          track("cta_click", `mail_${m.intent}`);
          window.location.href = m.href;
        },
      })),
      { id: "gh", label: "GitHub profile", group: "Links", hint: "↗", run: open_("https://github.com/Abhirai2006") },
      {
        id: "li",
        label: "LinkedIn",
        group: "Links",
        hint: "↗",
        run: open_("https://www.linkedin.com/in/abhishek-rai-a-00067238b/"),
      },
    ];
  }, [navigate]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((i) => `${i.label} ${i.group}`.toLowerCase().includes(s));
  }, [q, items]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setQ("");
        setActive(0);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      track("cta_click", "command_palette_open");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        className="fixed bottom-4 right-4 z-40 hidden md:flex items-center gap-2 rounded-full border border-border bg-background/80 backdrop-blur px-3 py-2 text-[11px] font-mono uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary transition-colors"
      >
        <kbd className="rounded border border-border px-1.5 py-0.5">⌘K</kbd> jump
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh] bg-background/80 backdrop-blur-md"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
      >
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((i) => Math.min(i + 1, filtered.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              const item = filtered[active];
              if (item) {
                setOpen(false);
                item.run();
              }
            }
          }}
          placeholder="Jump to a chapter, case study, or email me…"
          aria-label="Search commands"
          className="w-full bg-transparent px-5 py-4 text-sm outline-none placeholder:text-muted-foreground border-b border-border"
        />
        <ul className="max-h-[50vh] overflow-y-auto py-2">
          {filtered.length === 0 && (
            <li className="px-5 py-6 text-center text-sm text-muted-foreground font-mono">no matches</li>
          )}
          {filtered.map((item, idx) => (
            <li key={item.id}>
              <button
                onMouseEnter={() => setActive(idx)}
                onClick={() => {
                  setOpen(false);
                  item.run();
                }}
                className={`flex w-full items-center justify-between gap-4 px-5 py-2.5 text-left text-sm transition-colors ${
                  idx === active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/50"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground w-24 shrink-0">
                    {item.group}
                  </span>
                  {item.label}
                </span>
                {item.hint && <span className="text-[10px] font-mono text-muted-foreground">{item.hint}</span>}
              </button>
            </li>
          ))}
        </ul>
        <div className="border-t border-border px-5 py-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground flex gap-4">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
