// Project screenshots can come in a dark and a light version. The site shows the one that
// matches the theme the visitor is using, and falls back gracefully when a file is missing.

export type Shot = string | { dark?: string; light?: string; any?: string; fallback?: string };

/** File names to try, best match first. */
export function shotCandidates(shot: Shot, light: boolean): string[] {
  if (typeof shot === "string") return [shot];
  // matching theme first, then a single-theme capture, then the other theme, then an older copy
  const order = light
    ? [shot.light, shot.any, shot.dark, shot.fallback]
    : [shot.dark, shot.any, shot.light, shot.fallback];
  return order.filter((u): u is string => Boolean(u));
}

/** Pick the first candidate that has not failed to load. */
export function pickShot(shot: Shot, light: boolean, failed: readonly string[]): string | null {
  return shotCandidates(shot, light).find((u) => !failed.includes(u)) ?? null;
}

/** Plain URL list for places that cannot switch themes (social previews). */
export function firstShotUrl(shot: Shot | undefined): string | undefined {
  if (!shot) return undefined;
  return shotCandidates(shot, false)[0];
}
