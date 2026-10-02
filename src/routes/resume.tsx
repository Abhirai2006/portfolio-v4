import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/portfolio/Nav";
import { hireMailto, CONTACT_EMAIL } from "@/lib/contact";
import { PROJECTS } from "@/lib/projects";
import ogCover from "@/assets/og-cover.jpg.asset.json";

import { SITE } from "@/lib/site";
const PDF = "https://drive.google.com/file/d/1OaO_nbj7jrrgJY1JGp3CSh798Vh_rf8w/view?usp=sharing";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Résumé — Abhishek Rai A · Aspiring ML Engineer" },
      {
        name: "description",
        content:
          "Résumé of Abhishek Rai A — B.E. Artificial Intelligence & Machine Learning, Mysore University, GPA 9.31/10. Projects, skills, coursework and contact.",
      },
      { property: "og:title", content: "Résumé — Abhishek Rai A · Aspiring ML Engineer" },
      {
        property: "og:description",
        content:
          "B.E. AI & ML, GPA 9.31/10. Full-stack and algorithm projects, Python/C++, and an ongoing DRISHTI CPS (IIT Indore) certification.",
      },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: `${SITE}/resume` },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: `${SITE}${ogCover.url}` },
      { name: "twitter:image", content: `${SITE}${ogCover.url}` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/resume` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Abhishek Rai A",
          jobTitle: "Aspiring Machine Learning Engineer",
          url: `${SITE}/resume`,
          address: { "@type": "PostalAddress", addressLocality: "Mysuru", addressRegion: "Karnataka", addressCountry: "IN" },
          alumniOf: { "@type": "CollegeOrUniversity", name: "Mysore University School of Engineering" },
          knowsLanguage: ["Tulu", "Kannada", "Hindi", "English"],
          sameAs: [
             SITE,
            "https://github.com/Abhirai2006",
            "https://www.linkedin.com/in/abhishek-rai-a-00067238b/",
          ],
        }),
      },
    ],
  }),
  component: ResumePage,
});

function ResumePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="mx-auto max-w-3xl px-6 pt-32 pb-24">
        <Link to="/" className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-primary">
          ← Back to portfolio
        </Link>

        <header className="mt-8 border-b border-border pb-8">
          <h1 className="font-display text-4xl sm:text-5xl font-semibold">Abhishek Rai A</h1>
          <p className="mt-2 text-muted-foreground">
            Aspiring Machine Learning Engineer · Mysuru, Karnataka, India
          </p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-mono text-muted-foreground">
            <a className="hover:text-primary" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <a className="hover:text-primary" href="https://github.com/Abhirai2006" target="_blank" rel="noreferrer">github.com/Abhirai2006</a>
            <a className="hover:text-primary" href="https://www.linkedin.com/in/abhishek-rai-a-00067238b/" target="_blank" rel="noreferrer">linkedin.com/in/abhishek-rai-a</a>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 print:hidden">
            <a href={hireMailto} className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:opacity-90">
              Hire me →
            </a>
            <a href={PDF} target="_blank" rel="noreferrer" className="rounded-full border border-border px-5 py-2.5 text-sm hover:border-primary hover:text-primary">
              PDF version ↗
            </a>
            <button
              onClick={() => window.print()}
              className="rounded-full border border-border px-5 py-2.5 text-sm hover:border-primary hover:text-primary"
            >
              Print
            </button>
          </div>
        </header>

        <Block title="Profile">
          <p className="text-muted-foreground leading-relaxed">
             B.E. student in Artificial Intelligence &amp; Machine Learning entering the fifth semester with a 9.31/10 GPA.
             Recently completed a rigorous 4-week (~120 hour) Core AI &amp; ML internship at Bluemind Solutions, where he
             shipped a Customer Churn Intelligence System with LightGBM and Streamlit.
          </p>
        </Block>

        <Block title="Education">
          <Row
            left="B.E. — Artificial Intelligence & Machine Learning"
            right="2024 — 2028"
             sub="Mysore University School of Engineering · GPA 9.31 / 10 · Entering V Semester"
          />
          <Row
            left="Certification — AI & Data Science"
            right="Ongoing"
            sub="DRISHTI CPS Foundation, IIT Indore · ML fundamentals, workflows, applied AI"
          />
        </Block>

        <Block title="Skills">
           <SkillRow label="Proficient" items={["Python", "NumPy", "Pandas", "Scikit-learn (Pipelines, ColumnTransformer, CV)", "Git", "Linear Algebra", "Calculus"]} />
           <SkillRow label="Intermediate" items={["XGBoost", "LightGBM", "Matplotlib / Seaborn", "Streamlit", "SQL", "DSA", "Probability & Statistics"]} />
           <SkillRow label="Learning / Basics" items={["PyTorch", "FastAPI", "Discrete Mathematics"]} />
          <SkillRow label="Web" items={["React", "TypeScript", "TanStack Start", "Supabase", "Tailwind CSS"]} />
        </Block>

        <Block title="Projects">
          <div className="space-y-6">
            {PROJECTS.map((p) => (
              <div key={p.slug}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <Link
                    to="/projects/$slug"
                    params={{ slug: p.slug }}
                    className="font-display text-lg hover:text-primary"
                  >
                    {p.title} <span className="text-xs font-mono text-muted-foreground">· case study →</span>
                  </Link>
                  <span className="text-xs font-mono text-muted-foreground">{p.year}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{p.caseStudy.summary}</p>
                <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs font-mono text-muted-foreground">
                  {p.metrics.map((m) => (
                    <li key={m.label}>
                      <span className="text-primary">{m.value}</span> {m.label}
                    </li>
                  ))}
                </ul>
                <div className="mt-1 text-xs font-mono text-muted-foreground">{p.caseStudy.stack.join(" · ")}</div>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Languages">
          <p className="text-muted-foreground">Tulu (mother tongue) · Kannada · Hindi · English</p>
        </Block>

        <Block title="How I work">
          <p className="text-muted-foreground leading-relaxed">
            Night owl, ships fast, iterates in public. I use AI copilots deliberately for the web layer so my own hours
            go into the algorithms and the maths. Goal: one small ML system shipped every month.
          </p>
        </Block>
      </main>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Row({ left, right, sub }: { left: string; right: string; sub: string }) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-display text-lg">{left}</span>
        <span className="text-xs font-mono text-muted-foreground">{right}</span>
      </div>
      <div className="text-sm text-muted-foreground">{sub}</div>
    </div>
  );
}

function SkillRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="grid sm:grid-cols-[130px_1fr] gap-2">
      <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground pt-1">{label}</div>
      <div className="flex flex-wrap gap-2">
        {items.map((i) => (
          <span key={i} className="rounded-md bg-secondary border border-border px-2.5 py-0.5 text-sm font-mono">
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}
