import { useQuery } from "@tanstack/react-query";
import { getGithubData } from "@/lib/github.functions";
import { ContributionHeatmap } from "./ContributionHeatmap";

const LANG_COLOR: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  "C++": "#f34b7d",
  C: "#555555",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

export function GithubLive() {
  const { data, isLoading } = useQuery({
    queryKey: ["github"],
    queryFn: () => getGithubData(),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading || !data) {
    return (
      <div className="rounded-2xl border border-border p-8 text-center text-muted-foreground font-mono text-sm">
        fetching live github data…
      </div>
    );
  }
  if (!data.ok) {
    return (
      <div className="rounded-2xl border border-border p-8 text-center text-muted-foreground font-mono text-sm">
        github: {data.error} · <a href="https://github.com/Abhirai2006" className="text-primary underline">visit profile</a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-4">
        <Stat n={data.totals.repos} label="Public repos" />
        <Stat n={data.totals.stars} label="Stars earned" />
        <Stat n={data.totals.followers} label="Followers" />
      </div>

      <ContributionHeatmap />

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Top repositories
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {data.top.map((r) => (
              <a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="group rounded-lg border border-border bg-card/50 p-4 hover:border-primary transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm group-hover:text-primary">{r.name}</span>
                  <span className="text-xs font-mono text-muted-foreground">★ {r.stars}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">
                  {r.description ?? "—"}
                </p>
                {r.language && (
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: LANG_COLOR[r.language] ?? "#888" }}
                    />
                    {r.language}
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Language mix
          </h3>
          <div className="rounded-lg border border-border bg-card/50 p-4 space-y-2">
            {data.languages.map((l) => (
              <div key={l.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-mono">{l.name}</span>
                  <span className="font-mono text-muted-foreground">{l.pct}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${l.pct}%`, background: LANG_COLOR[l.name] ?? "var(--gold)" }}
                  />
                </div>
              </div>
            ))}
          </div>
          <a
            href="https://github.com/Abhirai2006"
            target="_blank"
            rel="noreferrer"
            className="block text-center rounded-lg border border-primary text-primary py-2 text-xs font-mono uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            @Abhirai2006 →
          </a>
        </div>
      </div>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/50 p-5">
      <div className="text-4xl font-display gold-text">{n}</div>
      <div className="mt-1 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}