import { createServerFn } from "@tanstack/react-start";

const GH_USER = "Abhirai2006";

type Repo = {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  fork: boolean;
  updated_at: string;
};

type Profile = {
  login: string;
  name: string | null;
  avatar_url: string;
  public_repos: number;
  followers: number;
  bio: string | null;
};

const cache = new Map<string, { at: number; data: unknown }>();
const TTL = 10 * 60 * 1000;

async function ghFetch<T>(path: string): Promise<T> {
  const key = `gh:${path}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.data as T;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "abhishek-portfolio",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) throw new Error(`GitHub ${path} ${res.status}`);
  const data = (await res.json()) as T;
  cache.set(key, { at: Date.now(), data });
  return data;
}

export const getGithubData = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const [profile, repos] = await Promise.all([
      ghFetch<Profile>(`/users/${GH_USER}`),
      ghFetch<Repo[]>(`/users/${GH_USER}/repos?per_page=100&sort=updated`),
    ]);

    const nonFork = repos.filter((r) => !r.fork);
    const top = [...nonFork]
      .sort((a, b) => b.stargazers_count - a.stargazers_count || +new Date(b.updated_at) - +new Date(a.updated_at))
      .slice(0, 6)
      .map((r) => ({
        name: r.name,
        url: r.html_url,
        description: r.description,
        stars: r.stargazers_count,
        language: r.language,
        updated: r.updated_at,
      }));

    const langMap = new Map<string, number>();
    for (const r of nonFork) if (r.language) langMap.set(r.language, (langMap.get(r.language) ?? 0) + 1);
    const totalLang = Array.from(langMap.values()).reduce((a, b) => a + b, 0) || 1;
    const languages = Array.from(langMap.entries())
      .map(([name, count]) => ({ name, pct: Math.round((count / totalLang) * 100) }))
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 6);

    const totalStars = nonFork.reduce((a, r) => a + r.stargazers_count, 0);

    return {
      ok: true as const,
      profile: {
        login: profile.login,
        name: profile.name,
        avatar: profile.avatar_url,
        publicRepos: profile.public_repos,
        followers: profile.followers,
        bio: profile.bio,
      },
      totals: {
        repos: nonFork.length,
        stars: totalStars,
        followers: profile.followers,
      },
      top,
      languages,
    };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
});