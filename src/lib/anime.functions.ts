import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { clientIp, isRateLimited, isSameOrigin } from "@/lib/guard";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { shelf } from "@/data/anime";

// The recommendations live in the shelf's own Supabase project (separate from the
// portfolio's reviews database). Both values are public/publishable and are
// baked in at build time; ANIME_SUPABASE_* can override them at runtime.
function publicDb() {
  const url =
    process.env["ANIME_SUPABASE_URL"] ?? (import.meta.env["VITE_ANIME_SUPABASE_URL"] as string);
  const key =
    process.env["ANIME_SUPABASE_PUBLISHABLE_KEY"] ??
    (import.meta.env["VITE_ANIME_SUPABASE_PUBLISHABLE_KEY"] as string);
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export type Recommendation = {
  id: string;
  title: string;
  romaji: string | null;
  cover: string | null;
  year: number | null;
  studio: string | null;
  genres: string[];
  synopsis: string | null;
  episodes: number | null;
  recommender: string;
  note: string | null;
  created_at: string;
  votes: number;
};

export type CatalogueHit = {
  catalogueId: string;
  title: string;
  romaji: string | null;
  cover: string | null;
  year: number | null;
  synopsis: string | null;
  episodes: number | null;
  subtype: string | null;
};

/** Shared gate for the public server functions: same-origin + per-IP rate limit. */
function gate(name: string, limit: number, windowMs = 60_000): string | null {
  const request = getRequest();
  if (!isSameOrigin(request)) return "Not allowed.";
  if (isRateLimited(`${name}:${clientIp(request)}`, limit, windowMs)) {
    return "Too many requests. Try again in a minute.";
  }
  return null;
}

/** Cover art may only come from the catalogue host, never from user-supplied URLs. */
function safeCover(url: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.protocol === "https:" &&
      (u.hostname === "media.kitsu.app" || u.hostname === "media.kitsu.io")
      ? u.toString()
      : null;
  } catch {
    return null;
  }
}

type KitsuAttributes = {
  canonicalTitle?: string;
  titles?: { en?: string; en_jp?: string };
  posterImage?: { large?: string; original?: string };
  startDate?: string;
  synopsis?: string;
  episodeCount?: number;
  subtype?: string;
};

/* ---------------- catalogue search (live, whole-of-anime) ---------------- */

export const searchCatalogue = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ q: z.string().min(1).max(80) }).parse(input))
  .handler(async ({ data }): Promise<CatalogueHit[]> => {
    if (gate("search", 30)) return [];
    const url = new URL("https://kitsu.io/api/edge/anime");
    url.searchParams.set("filter[text]", data.q);
    url.searchParams.set("page[limit]", "12");
    url.searchParams.set(
      "fields[anime]",
      "canonicalTitle,titles,posterImage,startDate,synopsis,episodeCount,subtype",
    );

    const res = await fetch(url, { headers: { Accept: "application/vnd.api+json" } });
    if (!res.ok) return [];
    const json = (await res.json()) as {
      data?: Array<{ id: string; attributes?: KitsuAttributes }>;
    };

    return (json.data ?? []).map((row) => {
      const a = row.attributes ?? {};
      return {
        catalogueId: row.id,
        title: a.titles?.en || a.canonicalTitle || a.titles?.en_jp || "Untitled",
        romaji: a.titles?.en_jp ?? null,
        cover: a.posterImage?.large ?? a.posterImage?.original ?? null,
        year: a.startDate ? Number(String(a.startDate).slice(0, 4)) : null,
        synopsis: a.synopsis ? String(a.synopsis).slice(0, 600) : null,
        episodes: a.episodeCount ?? null,
        subtype: a.subtype ?? null,
      };
    });
  });

/* ---------------- visitor recommendations ---------------- */

export const listRecommendations = createServerFn({ method: "GET" }).handler(
  async (): Promise<Recommendation[]> => {
    const db = publicDb();
    const { data, error } = await db
      .from("recommendations")
      .select(
        "id,title,romaji,cover,year,studio,genres,synopsis,episodes,recommender,note,created_at",
      )
      .eq("hidden", false)
      .order("created_at", { ascending: false })
      .limit(60);
    if (error) return [];

    const rows = (data ?? []) as Omit<Recommendation, "votes">[];
    const { data: voteRows } = await db
      .from("recommendation_votes")
      .select("recommendation_id")
      .limit(5000);

    const tally = new Map<string, number>();
    for (const v of (voteRows ?? []) as Array<{ recommendation_id: string }>) {
      tally.set(v.recommendation_id, (tally.get(v.recommendation_id) ?? 0) + 1);
    }

    return rows
      .map((r) => ({ ...r, votes: tally.get(r.id) ?? 0 }))
      .sort((a, b) => b.votes - a.votes || (a.created_at < b.created_at ? 1 : -1));
  },
);

export const voteRecommendation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid(), voterKey: z.string().min(8).max(64) }).parse(input),
  )
  .handler(async ({ data }) => {
    if (gate("vote", 20)) return { ok: false as const, reason: "failed" };
    const { error } = await publicDb()
      .from("recommendation_votes")
      .insert({ recommendation_id: data.id, voter_key: data.voterKey });
    if (error) {
      if (error.code === "23505") return { ok: false as const, reason: "already" };
      return { ok: false as const, reason: "failed" };
    }
    return { ok: true as const };
  });

export const addRecommendation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        catalogueId: z.string().max(40).nullable(),
        title: z.string().min(1).max(200),
        romaji: z.string().max(200).nullable(),
        cover: z.string().max(500).nullable(),
        year: z.number().int().nullable(),
        episodes: z.number().int().nullable(),
        synopsis: z.string().max(1200).nullable(),
        recommender: z.string().min(1).max(60),
        note: z.string().max(400).nullable(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const blocked = gate("add", 5, 10 * 60_000);
    if (blocked) return { ok: false as const, reason: blocked };
    const db = publicDb();

    const { data: dupe } = await db
      .from("recommendations")
      .select("id")
      .eq("title", data.title)
      .limit(1);
    if (dupe && dupe.length > 0) {
      return { ok: false as const, reason: "Someone already put that one on the shelf." };
    }

    const { error } = await db.from("recommendations").insert({
      catalogue_id: data.catalogueId,
      title: data.title,
      romaji: data.romaji,
      cover: safeCover(data.cover),
      year: data.year,
      episodes: data.episodes,
      synopsis: data.synopsis,
      recommender: data.recommender.trim() || "Anonymous",
      note: data.note?.trim() || null,
    });

    if (error) return { ok: false as const, reason: "Could not save that right now." };
    return { ok: true as const };
  });

/* ---------------- mood search ---------------- */

export const moodSearch = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ mood: z.string().min(2).max(160) }).parse(input))
  .handler(async ({ data }): Promise<{ ids: string[]; line: string; error?: string }> => {
    const blocked = gate("mood", 8);
    if (blocked) return { ids: [], line: "", error: blocked };
    const key = process.env["AI_API_KEY"];
    if (!key) return { ids: [], line: "", error: "Mood search is not configured." };

    const menu = shelf
      .map(
        (a) =>
          `${a.id} | ${a.title} | ${a.genres.join(", ")} | ${a.format} | ${a.episodesWatched} ep`,
      )
      .join("\n");

    const system =
      "You are the curator of a personal anime shelf. Given a mood, pick 3-7 titles from the shelf that fit it. Only use ids from the list. Write one short, warm sentence (max 18 words) explaining the pick as if handing someone a case off a shelf.";

    const call = (model: string) =>
      fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: `Mood: ${data.mood}\n\nShelf:\n${menu}` }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              required: ["ids", "line"],
              properties: {
                ids: { type: "ARRAY", items: { type: "STRING" } },
                line: { type: "STRING" },
              },
            },
          },
        }),
      });

    // Gemini sometimes answers 500/503 ("model overloaded") for a moment:
    // retry once, then fall back to a lighter model.
    const model = process.env["AI_MODEL"] ?? "gemini-flash-latest";
    const fallback = process.env["AI_FALLBACK_MODEL"] ?? "gemini-flash-lite-latest";
    let res = await call(model);
    if (res.status >= 500) {
      console.error("AI upstream", res.status, await res.text());
      await new Promise((r) => setTimeout(r, 600));
      res = await call(model);
    }
    if (res.status >= 500 && fallback !== model) res = await call(fallback);

    if (res.status === 429)
      return { ids: [], line: "", error: "Too many requests. Try again in a moment." };
    if (!res.ok) {
      console.error("AI error", res.status, await res.text());
      return { ids: [], line: "", error: "The curator could not answer just now." };
    }

    const json = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    try {
      const text = (json.candidates?.[0]?.content?.parts ?? []).map((x) => x.text ?? "").join("");
      const parsed = JSON.parse(text || "{}");
      const valid = new Set(shelf.map((a) => a.id));
      const ids = (parsed.ids ?? []).filter((id: string) => valid.has(id));
      if (!ids.length)
        return { ids: [], line: "", error: "Nothing on the shelf matches that mood." };
      return { ids, line: String(parsed.line ?? "") };
    } catch {
      return { ids: [], line: "", error: "The curator mumbled something unreadable." };
    }
  });
