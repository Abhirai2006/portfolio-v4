import { useEffect, useState } from "react";

export type Project = {
  title: string;
  tag: string;
  body: string;
  tags: string[];
  images?: string[];
  live?: string;
  repo?: string;
  snippet?: { title: string; lines: string[] };
};

export function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [i, setI] = useState(0);
  const imgs = project.images && project.images.length > 0 ? project.images : [];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && imgs.length) setI((v) => (v + 1) % imgs.length);
      if (e.key === "ArrowLeft" && imgs.length) setI((v) => (v - 1 + imgs.length) % imgs.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [imgs.length, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full bg-background/80 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
        >
          ✕
        </button>

        {/* Carousel */}
        <div className="relative aspect-[16/9] bg-muted overflow-hidden rounded-t-2xl">
          {imgs.length > 0 ? (
            <>
              <div
                className="flex h-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${i * 100}%)` }}
              >
                {imgs.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`${project.title} screenshot ${idx + 1}`}
                    className="h-full w-full object-cover shrink-0"
                  />
                ))}
              </div>
              {imgs.length > 1 && (
                <>
                  <button
                    onClick={() => setI((v) => (v - 1 + imgs.length) % imgs.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/70 border border-border hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label="Previous"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setI((v) => (v + 1) % imgs.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/70 border border-border hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label="Next"
                  >
                    ›
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {imgs.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setI(idx)}
                        aria-label={`Slide ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === i ? "w-6 bg-primary" : "w-1.5 bg-foreground/40"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : project.snippet ? (
            <div className="h-full w-full bg-black/90 p-5 sm:p-6 font-mono text-[12px] sm:text-sm overflow-auto">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground" />
                <span className="ml-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                  {project.snippet.title}
                </span>
              </div>
              <pre className="whitespace-pre-wrap leading-relaxed text-emerald-300/90">
                {project.snippet.lines.map((l, idx) => (
                  <div key={idx}>
                    {l.startsWith("$") || l.startsWith(">") ? (
                      <span className="text-primary">{l}</span>
                    ) : l.startsWith("✔") ? (
                      <span className="text-emerald-400">{l}</span>
                    ) : l.startsWith("✘") ? (
                      <span className="text-destructive">{l}</span>
                    ) : (
                      <span className="text-foreground/80">{l}</span>
                    )}
                  </div>
                ))}
              </pre>
            </div>
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground font-mono text-xs uppercase tracking-widest gap-2 bg-gradient-to-br from-primary/10 via-transparent to-accent/10">
              <div className="text-5xl font-display gold-text">{project.title[0]}</div>
              <div>screenshots coming soon</div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-5">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-primary">{project.tag}</div>
            <h3 className="mt-2 font-display text-3xl sm:text-4xl">{project.title}</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">{project.body}</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground border border-border rounded-full px-2.5 py-1"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition"
              >
                Live site →
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm hover:border-primary hover:text-primary transition"
              >
                View code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}