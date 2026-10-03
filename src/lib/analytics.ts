import { supabase } from "@/integrations/supabase/client";

type EventName = "page_view" | "section_view" | "cta_click";

const sessionId = (() => {
  if (typeof window === "undefined") return "";
  const KEY = "sid";
  let id = sessionStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(KEY, id);
  }
  return id;
})();

const seen = new Set<string>();

/** Fire-and-forget, anonymous. No personal data, just which parts of the site get reached. */
export function track(name: EventName, label: string) {
  if (typeof window === "undefined") return;
  const key = `${name}:${label}`;
  if (name !== "cta_click") {
    if (seen.has(key)) return;
    seen.add(key);
  }
  void supabase
    .from("site_events")
    .insert({
      name,
      label,
      session_id: sessionId,
      path: window.location.pathname,
      referrer: document.referrer ? new URL(document.referrer).hostname : null,
    })
    .then(() => undefined, () => undefined);
}

/** Records one homepage visitor per browser session and returns the live total. */
export async function recordVisit() {
  if (typeof window === "undefined" || !sessionId) return null;
  const { data, error } = await supabase.rpc("record_site_visit", {
    p_session_id: sessionId,
  });
  if (error) return null;
  const total = typeof data === "number" ? data : Number(data);
  return Number.isFinite(total) ? total : null;
}

/** Observes elements with an id and reports the first time each scrolls into view. */
export function observeSections(ids: string[]) {
  if (typeof window === "undefined") return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) track("section_view", e.target.id);
      }
    },
    { threshold: 0.35 },
  );
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) io.observe(el);
  }
  return () => io.disconnect();
}
