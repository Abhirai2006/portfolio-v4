import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, MessageCircle, Send, Star } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Nav } from "@/components/portfolio/Nav";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";

import { SITE } from "@/lib/site";
type Review = {
  id: string;
  display_name: string | null;
  role: string | null;
  rating: number;
  message: string;
  created_at: string;
};

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — Abhishek Rai A" },
      {
        name: "description",
        content: "Read feedback on Abhishek Rai A's work and leave an anonymous review without signing in.",
      },
      { property: "og:title", content: "Reviews — Abhishek Rai A" },
      {
        property: "og:description",
        content: "Read feedback and leave an anonymous review for Abhishek Rai A's portfolio.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/reviews` },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/reviews` }],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(5);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("reviews")
      .select("id, display_name, role, rating, message, created_at")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError("The review wall is taking a moment to load. Please refresh and try again.");
    } else {
      setReviews((data ?? []) as Review[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    const displayName = String(form.get("display_name") ?? "").trim();
    const role = String(form.get("role") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    if (message.length < 10) {
      setError("Your review needs at least 10 characters.");
      setSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from("reviews").insert({
      display_name: displayName || null,
      role: role || null,
      rating,
      message,
      published: true,
    });

    if (insertError) {
      setError("That review could not be published yet. Please try again.");
      setSubmitting(false);
      return;
    }

    track("cta_click", "review_submitted");
    await navigate({ to: "/thank-you" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-32">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground transition hover:text-primary">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to portfolio
        </Link>

        <header className="mt-10 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary">a small guestbook</p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight sm:text-7xl">
            Leave a note.
            <span className="mt-1 block font-script text-7xl font-normal text-primary sm:text-9xl">Keep it real.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            No account. No email. Just your honest take on the work, the projects, or the experience of exploring this site.
          </p>
        </header>

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8" aria-labelledby="review-form-title">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-primary">your words</p>
                <h2 id="review-form-title" className="mt-2 font-display text-2xl font-semibold">What did you think?</h2>
              </div>
              <MessageCircle className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
            </div>

            <form className="mt-8 space-y-5" onSubmit={submitReview}>
              <div>
                <label htmlFor="display_name" className="text-sm font-medium">Name <span className="text-muted-foreground">(optional)</span></label>
                <input id="display_name" name="display_name" maxLength={80} placeholder="How should I credit you?" className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label htmlFor="role" className="text-sm font-medium">Role or context <span className="text-muted-foreground">(optional)</span></label>
                <input id="role" name="role" maxLength={100} placeholder="Recruiter, classmate, visitor…" className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary" />
              </div>
              <fieldset>
                <legend className="text-sm font-medium">Rating</legend>
                <div className="mt-2 flex gap-1" aria-label={`Selected rating: ${rating} out of 5`}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      aria-label={`${value} star${value === 1 ? "" : "s"}`}
                      aria-pressed={rating === value}
                      className="rounded-md p-1.5 text-primary transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Star className={`h-5 w-5 ${value <= rating ? "fill-current" : ""}`} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor="message" className="text-sm font-medium">Your review</label>
                <textarea id="message" name="message" required minLength={10} maxLength={1000} rows={5} placeholder="The strongest part was…" className="mt-2 w-full resize-y rounded-md border border-input bg-background px-3 py-2.5 text-sm leading-relaxed outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary" />
              </div>
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={submitting} className="w-full rounded-full py-5">
                <Send className="h-4 w-4" aria-hidden="true" />
                {submitting ? "Publishing…" : "Publish review"}
              </Button>
              <p className="text-center text-xs leading-relaxed text-muted-foreground">Your review is public immediately. Please keep it respectful.</p>
            </form>
          </section>

          <section aria-labelledby="review-wall-title">
            <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-primary">the wall</p>
                <h2 id="review-wall-title" className="mt-2 font-display text-3xl font-semibold">Notes from visitors</h2>
              </div>
              <span className="font-mono text-xs text-muted-foreground">{reviews.length} {reviews.length === 1 ? "note" : "notes"}</span>
            </div>
            <div className="mt-6 space-y-4">
              {loading ? (
                <div className="border-y border-border py-10 text-center text-sm text-muted-foreground">Loading the wall…</div>
              ) : reviews.length === 0 ? (
                <div className="border-y border-border py-12 text-center">
                  <p className="font-script text-5xl text-primary">Be the first.</p>
                  <p className="mt-2 text-sm text-muted-foreground">There are no notes here yet.</p>
                </div>
              ) : (
                reviews.map((review) => <ReviewCard key={review.id} review={review} />)
              )}
            </div>
            <Link to="/" className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary">
              Explore the projects
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const author = review.display_name || "Anonymous visitor";
  const date = new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(review.created_at));

  return (
    <article className="rounded-xl border border-border bg-card/60 p-5 transition hover:border-primary/50 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
          {[1, 2, 3, 4, 5].map((value) => (
            <Star key={value} className={`h-4 w-4 text-primary ${value <= review.rating ? "fill-current" : ""}`} aria-hidden="true" />
          ))}
        </div>
        <time dateTime={review.created_at} className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{date}</time>
      </div>
      <p className="mt-4 leading-relaxed text-foreground/90">“{review.message}”</p>
      <div className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
        <span className="font-semibold">{author}</span>
        {review.role && <span className="text-muted-foreground">· {review.role}</span>}
      </div>
    </article>
  );
}