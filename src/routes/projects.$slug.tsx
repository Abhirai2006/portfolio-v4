import { useState } from "react";
import { useIsLight } from "@/hooks/use-is-light";
import { firstShotUrl, pickShot, type Shot } from "@/lib/shots";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProject, PROJECTS, type ProjectEntry } from "@/lib/projects";
import { Nav } from "@/components/portfolio/Nav";
import { hireMailto } from "@/lib/contact";

import { SITE } from "@/lib/site";

function ShotGrid({ title, shots }: { title: string; shots: Shot[] }) {
  const light = useIsLight();
  const [failed, setFailed] = useState<string[]>([]);
  const urls = shots
    .map((shot) => pickShot(shot, light, failed))
    .filter((u): u is string => u !== null);
  if (urls.length === 0) return null;
  return (
    <div className="mt-14 grid sm:grid-cols-2 gap-4">
      {urls.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`${title} screenshot ${i + 1}`}
          loading="lazy"
          onError={() => setFailed((f) => (f.includes(src) ? f : [...f, src]))}
          className={`rounded-xl border border-border w-full object-cover ${i === 0 ? "sm:col-span-2" : ""}`}
        />
      ))}
    </div>
  );
}

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ params, loaderData }) => {
    const p = loaderData?.project;
    const title = p ? `${p.title}: Case study · Abhishek Rai A` : "Case study · Abhishek Rai A";
    const desc = p?.caseStudy.summary ?? "Project case study by Abhishek Rai A.";
    const url = `${SITE}/projects/${params.slug}`;
    const first = firstShotUrl(p?.images?.[0]);
    const img = first ? `${SITE}${first}` : undefined;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        ...(img
          ? [
              { property: "og:image", content: img },
              { name: "twitter:image", content: img },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: p
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: `${p.title}: Case study`,
                description: p.caseStudy.summary,
                author: { "@type": "Person", name: "Abhishek Rai A" },
                url,
              }),
            },
          ]
        : [],
    };
  },
  component: CaseStudyPage,
});

function CaseStudyPage() {
  const { project: p } = Route.useLoaderData() as { project: ProjectEntry };
  const cs = p.caseStudy;
  const others = PROJECTS.filter((o) => o.slug !== p.slug);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="film-grain" aria-hidden="true" />
      <Nav />
      <main className="mx-auto max-w-4xl px-6 pt-32 pb-24">
        <Link
          to="/"
          hash="projects"
          className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-primary"
        >
          ← Back to the Arsenal
        </Link>

        <header className="mt-8">
          <div className="text-[10px] font-mono uppercase tracking-widest text-primary">
            {p.tag} · {p.year}
          </div>
          <h1 className="mt-3 font-display text-4xl sm:text-6xl font-semibold leading-[1.05]">
            {p.title}
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{cs.summary}</p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {p.metrics.map((m: { value: string; label: string }) => (
              <div key={m.label} className="rounded-lg border border-border bg-card/50 p-4">
                <div className="font-display text-2xl sm:text-3xl gold-text">{m.value}</div>
                <div className="mt-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground leading-snug">
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {p.live && (
              <a
                href={p.live}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition"
              >
                Live site →
              </a>
            )}
            {p.repo && (
              <a
                href={p.repo}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border px-5 py-2.5 text-sm hover:border-primary hover:text-primary transition"
              >
                View code
              </a>
            )}
          </div>
        </header>

        <ShotGrid title={p.title} shots={p.images ?? []} />

        {p.snippet && (
          <div className="mt-14 rounded-xl border border-border bg-black/90 p-6 font-mono text-[12px] sm:text-sm overflow-auto">
            <div className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">
              {p.snippet.title}
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed text-emerald-300/90">
              {p.snippet.lines.join("\n")}
            </pre>
          </div>
        )}

        <Section title="The problem">
          <p className="text-muted-foreground leading-relaxed">{cs.problem}</p>
        </Section>

        <Section title="Constraints">
          <Bullets items={cs.constraints} />
        </Section>

        <Section title="What I built">
          <Bullets items={cs.built} />
        </Section>

        <Section title="Trade-offs">
          <div className="space-y-4">
            {cs.tradeoffs.map((t: { choice: string; why: string }) => (
              <div key={t.choice} className="rounded-xl border border-border bg-card/40 p-5">
                <div className="font-display text-lg">{t.choice}</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t.why}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Outcome">
          <Bullets items={cs.outcome} />
        </Section>

        <Section title="Stack">
          <div className="flex flex-wrap gap-2">
            {cs.stack.map((s: string) => (
              <span
                key={s}
                className="rounded-full border border-border px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-muted-foreground"
              >
                {s}
              </span>
            ))}
          </div>
        </Section>

        <div className="mt-16 rounded-2xl border border-border bg-card/50 p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-display text-xl">Want the long version?</div>
            <p className="text-sm text-muted-foreground">
              Happy to walk through the decisions live.
            </p>
          </div>
          <a
            href={hireMailto}
            className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:opacity-90"
          >
            Email me →
          </a>
        </div>

        <nav aria-label="Other case studies" className="mt-14">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Other case studies
          </h2>
          <div className="mt-4 grid sm:grid-cols-3 gap-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                to="/projects/$slug"
                params={{ slug: o.slug }}
                className="rounded-lg border border-border bg-card/40 p-4 hover:border-primary transition-colors"
              >
                <div className="text-[10px] font-mono uppercase tracking-widest text-primary">
                  {o.tag}
                </div>
                <div className="mt-1 font-display text-lg">{o.title}</div>
              </Link>
            ))}
          </div>
        </nav>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl sm:text-3xl">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((t) => (
        <li key={t} className="flex gap-3 text-muted-foreground leading-relaxed">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}
