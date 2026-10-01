import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Heart } from "lucide-react";
import { Nav } from "@/components/portfolio/Nav";

import { SITE } from "@/lib/site";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "Thank You — Abhishek Rai A" },
      {
        name: "description",
        content: "A personal thank-you from Abhishek Rai A for taking the time to visit and share feedback.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Thank You — Abhishek Rai A" },
      {
        property: "og:description",
        content: "Thanks for taking the time to visit Abhishek Rai A's portfolio.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/thank-you` },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/thank-you` }],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-32">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-50">
          <div className="absolute left-[12%] top-[24%] h-px w-32 bg-primary/60" />
          <div className="absolute bottom-[26%] right-[12%] h-px w-44 bg-accent/60" />
          <div className="absolute left-[18%] top-[24%] h-2 w-2 rounded-full bg-primary" />
          <div className="absolute bottom-[26%] right-[12%] h-2 w-2 translate-x-44 rounded-full bg-accent" />
        </div>

        <section aria-labelledby="thank-you-title" className="relative w-full max-w-3xl text-center">
          <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
            <Heart className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary">message received</p>
          <h1 id="thank-you-title" className="mt-5 font-script text-8xl leading-none text-foreground sm:text-[10rem]">
            Thank you
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            I really appreciate you taking a moment to look around, share a thought, or leave a little kindness behind.
            It means more than a metric ever could.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to portfolio
            </Link>
            <Link
              to="/reviews"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition hover:border-primary hover:text-primary"
            >
              Read the review wall
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-12 font-script text-4xl text-primary/80">— Abhishek</p>
        </section>
      </main>
    </div>
  );
}