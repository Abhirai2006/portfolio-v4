import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Nav } from "@/components/portfolio/Nav";
import { TechniqueVault } from "@/components/portfolio/TechniqueVault";
import { AskAbhishek } from "@/components/portfolio/AskAbhishek";
import { GithubLive } from "@/components/portfolio/GithubLive";
import { ProjectModal, type Project } from "@/components/portfolio/ProjectModal";
import { CursorGlow } from "@/components/portfolio/CursorGlow";
import { MagicCard } from "@/components/portfolio/MagicCard";
import { SpotlightPortrait } from "@/components/portfolio/SpotlightPortrait";
import { WordReveal } from "@/components/motion/word-reveal";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/motion/dock";
import { Magnetic } from "@/components/motion/magnetic";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { hireMailto } from "@/lib/contact";
import { PROJECTS } from "@/lib/projects";
import { CommandPalette } from "@/components/portfolio/CommandPalette";
import { track, observeSections, recordVisit } from "@/lib/analytics";
import { InfiniteSlider } from "@/components/motion/infinite-slider";
import { Home, User, Github, FolderGit2, Sparkles, Clapperboard, Mail } from "lucide-react";
import portrait from "@/assets/abhishek-portrait.jpg.asset.json";
import { SITE } from "@/lib/site";


const HeroScene = lazy(() =>
  import("@/components/portfolio/HeroScene").then((m) => ({ default: m.HeroScene })),
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Abhishek Rai A - ML Engineer · Live Projects" },
      {
        name: "description",
        content:
          "Portfolio of Abhishek Rai A — B.E. AI & ML student and Bluemind Solutions intern. Explore his Customer Churn Intelligence capstone, projects, and live GitHub activity.",
      },
      { property: "og:title", content: "Abhishek Rai A - ML Engineer · Live Projects" },
      {
        property: "og:description",
        content:
          "Portfolio of Abhishek Rai A — B.E. AI & ML student and Bluemind Solutions intern. Explore his Customer Churn Intelligence capstone, projects, and live GitHub activity.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: `${SITE}/` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/` }],
  }),
  component: Index,
});

const SECTION_IDS = ["origin", "arsenal", "github", "projects", "ask", "shelf", "contact"];

function Index() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    track("page_view", "home");
    void recordVisit().then(setVisitorCount);
    return observeSections(SECTION_IDS);
  }, []);
  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <div className="film-grain" aria-hidden="true" />
      <CursorGlow />
      <Nav />
      <Hero visitorCount={visitorCount} />
      <Origin />
      <NowBuilding />
      <Arsenal />
      <GithubSection />
      <Projects />
      <AskSection />
      <AnimeShelf />
      <Contact />
      <Footer />
      <FloatingDock />
      <CommandPalette />
    </div>
  );
}


/* ---------- FLOATING DOCK ---------- */
function FloatingDock() {
  const items = [
    { title: "Top", icon: <Home className="h-5 w-5" />, href: "#top" },
    { title: "Origin", icon: <User className="h-5 w-5" />, href: "#origin" },
    { title: "GitHub", icon: <Github className="h-5 w-5" />, href: "#github" },
    { title: "Arsenal", icon: <FolderGit2 className="h-5 w-5" />, href: "#projects" },
    { title: "Ask", icon: <Sparkles className="h-5 w-5" />, href: "#ask" },
    { title: "Anime", icon: <Clapperboard className="h-5 w-5" />, href: "#shelf" },
    { title: "Contact", icon: <Mail className="h-5 w-5" />, href: "#contact" },
  ];
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 hidden md:block">
      <Dock magnification={64} distance={140} panelHeight={64}>
        {items.map((it) => (
          <DockItem key={it.title} href={it.href} label={it.title}>
            <DockLabel>{it.title}</DockLabel>
            <DockIcon>{it.icon}</DockIcon>
          </DockItem>
        ))}
      </Dock>
    </div>
  );
}

/* ---------- HERO ---------- */
function Hero({ visitorCount }: { visitorCount: number | null }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0 light:opacity-25">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-background pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 pt-32 pb-20 grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground">
            <span className="h-px w-8 bg-primary" />
            Chapter 00 · Portfolio / 2026
          </div>
          <h1 className="mt-6 font-display text-5xl sm:text-7xl lg:text-8xl font-semibold leading-[0.95] tracking-tight">
            <span className="block">ABHISHEK</span>
             <span className="block gold-text">RAI A</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
             Aspiring{" "}
             <span className="text-foreground font-medium">Machine Learning Engineer</span>. B.E. AI &amp; ML at
             Mysore University · <span className="text-primary font-mono">GPA 9.31/10</span> · recently shipped a
             production-ready Customer Churn Intelligence System with LightGBM and Streamlit.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic intensity={0.25} range={140}>
              <a
                href="#ask"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold transition"
              >
                <span className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-300 group-hover:translate-x-0" aria-hidden="true" />
                 <span className="relative flex items-center gap-2 group-hover:text-accent-foreground transition-colors">
                   Ask Abhishek <span className="transition-transform duration-300 group-hover:translate-y-0.5">↴</span>
                </span>
              </a>
            </Magnetic>
            <Magnetic intensity={0.25} range={140}>
              <a
                href={hireMailto}
                onClick={() => track("cta_click", "hire_hero")}
                aria-label="Email Abhishek about a role"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:border-primary transition"
              >
                <span className="absolute inset-0 -translate-x-full bg-primary transition-transform duration-300 group-hover:translate-x-0" aria-hidden="true" />
                <span className="relative flex items-center gap-2 group-hover:text-primary-foreground transition-colors">
                  Hire me <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </a>
            </Magnetic>
            <Magnetic intensity={0.2} range={140}>
              <Link
                to="/resume"
                onClick={() => track("cta_click", "resume")}
                className="group inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:border-primary hover:text-primary transition"
              >
                Résumé <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">→</span>
              </Link>
            </Magnetic>
            <Magnetic intensity={0.2} range={140}>
              <a
                href="https://github.com/Abhirai2006"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:border-primary hover:text-primary transition"
              >
                GitHub <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </Magnetic>
          </div>

          <dl className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
            <Kpi k="9.31" sub="GPA / 10" />
             <Kpi k="V" sub="Semester" />
            <Kpi k="3+1" sub="Web apps · C++ suite" />
            <VisitorKpi value={visitorCount} />
          </dl>
        </div>
        <div className="hidden lg:flex justify-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/40 via-accent/20 to-destructive/30 blur-2xl opacity-60" />
            <div className="relative">
              <SpotlightPortrait src={portrait.url} alt="Abhishek Rai A" />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-border bg-background/90 backdrop-blur px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground whitespace-nowrap">
              <span className="text-primary">●</span> abhishek · mysuru
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono uppercase tracking-widest text-muted-foreground animate-bounce">
        scroll ↓
      </div>
    </section>
  );
}

function Kpi({ k, sub }: { k: string; sub: string }) {
  return (
    <div>
      <div className="text-3xl font-display gold-text">{k}</div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">
        {sub}
      </div>
    </div>
  );
}

function AnimatedKpi({ n, sub }: { n: number; sub: string }) {
  return (
    <div>
      <div className="text-3xl font-display gold-text">
        <AnimatedNumber value={n} />
      </div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">
        {sub}
      </div>
    </div>
  );
}

function VisitorKpi({ value }: { value: number | null }) {
  return (
    <div aria-live="polite">
      <div className="text-3xl font-display gold-text tabular-nums">
        {value === null ? "—" : value.toLocaleString()}
      </div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">
        total visitors
      </div>
    </div>
  );
}

/* ---------- MARQUEE ---------- */
function Marquee({ words }: { words: string[] }) {
  const line = words.join("  ★  ");
  return (
    <div className="overflow-hidden border-y border-border bg-muted/30 py-4">
      <div className="whitespace-nowrap marquee flex">
        <span className="font-chapter text-2xl tracking-widest px-6">{line}</span>
        <span className="font-chapter text-2xl tracking-widest px-6">{line}</span>
      </div>
    </div>
  );
}

/* ---------- ORIGIN ---------- */
function Origin() {
  return (
    <>
      <Marquee
        words={[
          "ML ENGINEER",
          "PROBLEM SOLVER",
          "ANIME FAN",
          "DSA NERD",
          "TULU · KANNADA · HINDI · ENGLISH",
        ]}
      />
      <section id="origin" className="mx-auto max-w-6xl px-6 py-28">
        <ChapterHeader n="01" title="Origin Story" />
        <div className="mt-10 grid md:grid-cols-[1fr_1.4fr] gap-12">
          <blockquote className="relative border-l-2 border-primary pl-6 font-display text-2xl leading-snug">
            "Building cool stuff — <span className="gold-text">one algorithm at a time.</span>"
          </blockquote>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
               <span className="text-foreground font-semibold">Abhishek Rai A</span>, a
               <span className="text-foreground"> B.E. AI &amp; ML</span> student at
               <span className="text-foreground"> Mysore University School of Engineering</span>, entering my
               fifth semester with a <span className="text-primary font-mono">9.31/10</span> GPA. Originally from
               Mangalore, now in Mysuru.
            </p>
            <p>
               I find patterns in mathematics and elegance in algorithms. I speak Tulu (mother tongue), Kannada, Hindi
               and English. I recently completed a rigorous 4-week, roughly 120-hour Core AI &amp; ML internship at
               Bluemind Solutions Pvt. Ltd. (Aug–Sep 2026), where my capstone was a leak-free Customer Churn
               Intelligence System on IBM Telco data.
            </p>
             <p className="text-sm">
               I compared Logistic Regression, Random Forest, XGBoost and LightGBM, tuned the decision threshold for
               business cost, added SHAP-style analysis, and shipped a live Streamlit dashboard. LightGBM reached
               <span className="text-primary font-mono"> 0.849 CV ROC-AUC</span> and <span className="text-primary font-mono">82% recall</span> on churners, with an estimated
               <span className="text-primary font-mono"> ~$179k</span> in annual recoverable revenue. One Piece bias included.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono uppercase tracking-widest">
              <Chip>Mysuru, Karnataka</Chip>
              <Chip>B.E. AI &amp; ML</Chip>
              <Chip>DRISHTI CPS · IIT Indore</Chip>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border px-3 py-1 text-muted-foreground">{children}</span>
  );
}

function ChapterHeader({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-baseline gap-6">
      <span className="font-chapter text-7xl gold-text leading-none">{n}</span>
      <div>
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground">Chapter</div>
        <WordReveal text={title} className="font-display text-4xl sm:text-5xl font-semibold" />
      </div>
    </div>
  );
}

/* ---------- NOW BUILDING ---------- */
function NowBuilding() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-28">
      <div className="grid md:grid-cols-3 gap-4">
        <StatusCard tag="Recently shipped" title="Churn Intelligence" body="Bluemind Solutions capstone: leak-free tabular ML, business threshold tuning, and a live Streamlit dashboard on IBM Telco data." />
        <StatusCard tag="Learning" title="AI & Data Science" body="Ongoing certification via DRISHTI CPS (IIT Indore) — ML fundamentals, workflows, applied AI." />
        <StatusCard tag="Building foundations" title="PyTorch · FastAPI" body="Learning the next layer of ML engineering deliberately — strengthening model serving and deep-learning fundamentals without overclaiming production experience." />
      </div>
    </section>
  );
}
function StatusCard({ tag, title, body }: { tag: string; title: string; body: string }) {
  return (
    <MagicCard className="border border-border bg-card/50 backdrop-blur p-5 hover:border-primary/60 transition-colors">
      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-primary">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> {tag}
      </div>
      <div className="mt-3 font-display text-xl">{title}</div>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
    </MagicCard>
  );
}

/* ---------- ARSENAL ---------- */
function Arsenal() {
  const tiers = [
    { tier: "S", label: "Proficient", items: ["Python", "NumPy", "Pandas", "Scikit-learn (Pipelines, ColumnTransformer, CV)", "Git", "Linear Algebra", "Calculus"] },
    { tier: "A", label: "Intermediate", items: ["XGBoost", "LightGBM", "Matplotlib / Seaborn", "Streamlit", "SQL", "DSA", "Probability & Statistics"] },
    { tier: "B", label: "Learning / Basics", items: ["PyTorch", "FastAPI", "Discrete Mathematics"] },
  ];
  return (
    <section id="arsenal" className="mx-auto max-w-6xl px-6 py-28">
      <ChapterHeader n="02" title="Power Levels" />
      <p className="mt-6 max-w-2xl text-muted-foreground">
        Core weapons in the arsenal — AI/ML + math foundations. I vibe-code web (HTML/CSS/JS/React) with AI as
        copilot. Focus stays on the algorithms.
      </p>
      <div className="mt-10 space-y-4">
        {tiers.map((t) => (
          <div
            key={t.tier}
            className="grid grid-cols-[80px_1fr] items-center border border-border rounded-xl overflow-hidden bg-card/40"
          >
            <div className="bg-primary text-primary-foreground py-6 text-center">
              <div className="font-chapter text-4xl leading-none">{t.tier}</div>
              <div className="text-[9px] font-mono uppercase tracking-widest mt-1">TIER</div>
            </div>
            <div className="px-5 py-4">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{t.label}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {t.items.map((i) => (
                  <span
                    key={i}
                    className="rounded-md bg-secondary border border-border px-3 py-1 text-sm font-mono"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- GITHUB ---------- */
function GithubSection() {
  return (
    <section id="github" className="mx-auto max-w-6xl px-6 py-28">
      <ChapterHeader n="03" title="Live Code Activity" />
      <p className="mt-6 max-w-2xl text-muted-foreground">
        Not hardcoded — pulled live from the GitHub API every 10 minutes. What you see is what I actually shipped.
      </p>
      <div className="mt-10">
        <GithubLive />
      </div>
    </section>
  );
}

/* ---------- PROJECTS ---------- */
function Projects() {
  const items: Project[] = PROJECTS;
  const [active, setActive] = useState<Project | null>(null);
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-28">
      <ChapterHeader n="04" title="The Arsenal" />
      <p className="mt-6 max-w-2xl text-muted-foreground">
        Click any card for screenshots and the live site — or read the full case study for the problem,
        constraints, trade-offs and what actually shipped.
      </p>
      <div
        className="mt-10 grid gap-4 md:grid-cols-2"
      >
        {items.map((p, idx) => (
          <MagicCard
            key={p.title}
            style={{ animationDelay: `${idx * 0.7}s` }}
            className="breathe border border-border bg-card/50 hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all"
          >
          <div className="group relative flex h-full flex-col">
            <button
              onClick={() => {
                track("cta_click", `open_case_${p.title}`);
                setActive(p);
              }}
              aria-label={`Open ${p.title} project preview`}
              className="block w-full flex-1 cursor-pointer p-6 text-left"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-primary">{p.tag}</div>
                  <h3 className="mt-2 font-display text-2xl">{p.title}</h3>
                </div>
                <span className="text-primary group-hover:translate-x-1 transition-transform">→</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.body}</p>

              <dl className="mt-5 grid grid-cols-3 gap-3 border-y border-border/70 py-3">
                {PROJECTS[idx]?.metrics.map((m) => (
                  <div key={m.label}>
                    <dt className="sr-only">{m.label}</dt>
                    <dd className="font-display text-xl leading-none gold-text">{m.value}</dd>
                    <dd className="mt-1 text-[10px] font-mono uppercase tracking-wide text-muted-foreground leading-tight">
                      {m.label}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground border border-border rounded-full px-2 py-0.5">
                    {t}
                  </span>
                ))}
              </div>
            </button>
            <div className="mt-auto px-6 pb-6 pt-1 flex flex-wrap items-center gap-4">
              <Link
                to="/projects/$slug"
                params={{ slug: PROJECTS[idx]!.slug }}
                onClick={() => track("cta_click", `read_case_${p.title}`)}
                className="relative z-10 text-[10px] font-mono uppercase tracking-widest text-accent hover:text-primary underline underline-offset-4 md:cursor-pointer"
              >
                Read the full case study →
              </Link>
              {p.live && (
                <a
                  href={p.live}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="relative z-10 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-primary md:cursor-pointer"
                >
                  Live site ↗
                </a>
              )}
            </div>
          </div>
          </MagicCard>
        ))}
      </div>
      {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
    </section>
  );
}

/* ---------- ASK AI ---------- */
function AskSection() {
  return (
    <section id="ask" className="mx-auto max-w-6xl px-6 py-28">
      <ChapterHeader n="05" title="Ask Abhishek" />
      <p className="mt-6 max-w-2xl text-muted-foreground">
        Recruiter in a hurry? Skip the scroll — ask the AI trained on my resume and projects. Answers stay grounded
        in my actual background.
      </p>
      <div className="mt-10 max-w-3xl mx-auto">
        <AskAbhishek />
      </div>
    </section>
  );
}

/* ---------- ANIME ---------- */
function AnimeShelf() {
  const top = [
    ["One Piece", 1120],
    ["Naruto", 721],
    ["Hunter x Hunter", 148],
    ["My Hero Academia", 138],
    ["Dragon Ball", 125],
    ["The Seven Deadly Sins", 96],
    ["Attack on Titan", 89],
    ["Haikyuu!!", 86],
    ["Demon Slayer", 83],
    ["Jujutsu Kaisen", 60],
    ["Fire Force", 60],
    ["Bleach", 50],
    ["Sword Art Online", 49],
    ["Jobless Reincarnation", 48],
    ["Black Clover", 48],
    ["Frieren", 38],
  ];
  return (
    <section id="shelf" className="mx-auto max-w-6xl px-6 py-28">
      <ChapterHeader n="06" title="Side Quest · Anime Shelf" />
      <p className="mt-3 font-one-piece text-xl text-primary">Grand Line watch log</p>
      <div className="mt-6 grid grid-cols-3 gap-4 max-w-lg">
        <AnimatedKpi n={56} sub="Series + movies" />
        <AnimatedKpi n={3653} sub="Episodes" />
        <Kpi k="S" sub="One Piece" />
      </div>
      <div className="mt-10">
        <InfiniteSlider gap={12} duration={35} speedOnHover={12}>
          {top.map(([name, ep]) => (
            <div
              key={String(name)}
              className="shrink-0 rounded-lg border border-border bg-card/60 px-4 py-2 font-mono text-xs flex items-center gap-3"
            >
              <span className="text-foreground">{name}</span>
              <span className="text-primary">{ep}ep</span>
            </div>
          ))}
        </InfiniteSlider>
      </div>
      <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-4 gap-2 font-mono text-xs">
        {top.map(([name, ep], i) => (
          <div
            key={name}
            className="flex items-center justify-between border border-border rounded-md px-3 py-2 bg-card/40"
          >
            <span className="flex items-center gap-2">
              <span className="text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <span>{name}</span>
            </span>
            <span className="text-primary">{ep}ep</span>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs font-mono text-muted-foreground">
        領域展開 · 全集中 · 葬送 · 計画通り · 自由の翼 · 76,750 min watched
      </p>
      <TechniqueVault />
    </section>
  );
}

/* ---------- CONTACT ---------- */
function Contact() {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const parallax = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = parallax.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const progress = 1 - r.top / window.innerHeight;
      setOffset(Math.max(-1, Math.min(1, progress)) * 60);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  // Split + reversed encoding so raw source doesn't contain the strings verbatim.
  const decode = (parts: string[]) => parts.map((p) => p.split("").reverse().join("")).join("");
  const email = decode(["iarihba", "mg@6002", "moc.lia"]);
  const phone = decode(["69 19+", "110 860", "54"]);
  return (
    <section ref={parallax} id="contact" className="relative overflow-hidden mx-auto max-w-6xl px-6 py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
          style={{ transform: `translate3d(0, ${offset * -0.6}px, 0)` }}
        />
        <div
          className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-accent/15 blur-3xl"
          style={{ transform: `translate3d(0, ${offset * 0.8}px, 0)` }}
        />
        <div
          className="absolute left-1/2 top-1/3 h-56 w-56 rounded-full bg-destructive/10 blur-3xl"
          style={{ transform: `translate3d(0, ${offset * -0.3}px, 0)` }}
        />
      </div>
      <ChapterHeader n="07" title="Let's Build Something" />
      <div className="mt-10 grid md:grid-cols-2 gap-8 items-center">
        <div className="rounded-2xl border border-border bg-card font-mono text-sm p-6 space-y-1 shadow-2xl">
          <div className="flex gap-1.5 mb-3">
            <span className="h-3 w-3 rounded-full bg-destructive" />
            <span className="h-3 w-3 rounded-full bg-primary" />
            <span className="h-3 w-3 rounded-full bg-muted-foreground" />
          </div>
          <div><span className="text-primary">$</span> whoami</div>
          <div className="text-muted-foreground pl-2">abhishek@rai:~$ aspiring_ml_engineer</div>
          <div>
            <span className="text-primary">$</span>{" "}
            <button
              onClick={() => setRevealed(true)}
              className="text-foreground hover:text-primary underline-offset-4 hover:underline"
            >
              cat contact.sh
            </button>
          </div>
          {revealed ? (
            <>
              <div className="text-muted-foreground pl-2 flex items-center gap-2 flex-wrap">
                →{" "}
                <a href={`mailto:${email}`} className="text-primary hover:underline">
                  {email}
                </a>
                <button
                  type="button"
                  aria-label="Copy email address"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(email);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    } catch {
                      /* clipboard unavailable */
                    }
                  }}
                  className={`rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wider transition-colors ${
                    copied
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {copied ? "copied ✓" : "copy"}
                </button>
              </div>
              <div className="text-muted-foreground pl-2">
                →{" "}
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-primary hover:underline">
                  {phone}
                </a>
              </div>
            </>
          ) : (
            <div className="text-muted-foreground pl-2 italic">
              [ contact locked — click <span className="text-primary">cat contact.sh</span> to decrypt ]
            </div>
          )}
          <div><span className="text-primary">$</span> ./transmit.sh</div>
          <div className="text-muted-foreground pl-2 animate-pulse">▍</div>
        </div>
        <div className="space-y-4">
          <p className="text-lg text-muted-foreground">
            An algorithm to crack, a theorem to prove, or the latest anime arc — drop a line.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setRevealed(true)}
              className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:opacity-90"
            >
              {revealed ? (
                <a href={`mailto:${email}`} className="text-primary-foreground">
                  {email}
                </a>
              ) : (
                "Reveal email"
              )}
            </button>
            <a
              href="https://github.com/Abhirai2006"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border px-5 py-2.5 text-sm hover:border-primary hover:text-primary"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/abhishek-rai-a-00067238b/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border px-5 py-2.5 text-sm hover:border-primary hover:text-primary"
            >
              LinkedIn
            </a>
            <a
              href="https://instagram.com/_abhishek.rai.a_"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border px-5 py-2.5 text-sm hover:border-primary hover:text-primary"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
        <div>© 2026 · Abhishek Rai A · Portfolio v3</div>
        <div>Built with TanStack Start · Three.js</div>
      </div>
    </footer>
  );
}
