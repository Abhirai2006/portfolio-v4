import { useQuery } from "@tanstack/react-query";

type Contribution = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
type ApiResp = { total: Record<string, number>; contributions: Contribution[] };

async function fetchContribs(): Promise<ApiResp> {
  const res = await fetch("https://github-contributions-api.jogruber.de/v4/Abhirai2006?y=last");
  if (!res.ok) throw new Error("contrib fetch failed");
  return res.json();
}

const LEVEL_BG = [
  "bg-muted/40",
  "bg-accent/30",
  "bg-accent/55",
  "bg-accent/80",
  "bg-accent",
];

export function ContributionHeatmap() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["gh-contribs"],
    queryFn: fetchContribs,
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card/50 p-5 font-mono text-xs text-muted-foreground">
        loading contribution graph…
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="rounded-lg border border-border bg-card/50 p-5 font-mono text-xs text-muted-foreground">
        couldn't load contribution graph.
      </div>
    );
  }

  // Build weekly columns (7 rows). Start on the first Sunday.
  const c = data.contributions;
  const first = new Date(c[0].date);
  const pad = first.getDay(); // 0 = Sun
  const cells: (Contribution | null)[] = Array(pad).fill(null).concat(c);
  const weeks: (Contribution | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const total = c.reduce((a, x) => a + x.count, 0);

  return (
    <div className="rounded-lg border border-border bg-card/50 p-5 space-y-3">
      <div className="flex items-baseline justify-between">
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Contributions · last year
        </h3>
        <span className="font-mono text-xs text-accent">{total} commits</span>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-[3px] min-w-max">
          {weeks.map((w, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {Array.from({ length: 7 }).map((_, di) => {
                const cell = w[di];
                if (!cell) return <div key={di} className="h-2.5 w-2.5 rounded-[2px]" />;
                return (
                  <div
                    key={di}
                    title={`${cell.date} · ${cell.count} commits`}
                    className={`h-2.5 w-2.5 rounded-[2px] ${LEVEL_BG[cell.level]}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
        <span>less</span>
        {LEVEL_BG.map((cls, i) => (
          <div key={i} className={`h-2.5 w-2.5 rounded-[2px] ${cls}`} />
        ))}
        <span>more</span>
      </div>
    </div>
  );
}