// Canonical site URL. Set VITE_SITE_URL at build time (e.g. https://yourdomain.com).
export const SITE = (
  (import.meta.env.VITE_SITE_URL as string | undefined) ?? "http://localhost:8080"
).replace(/\/$/, "");
export const SITE_HOST = SITE.replace(/^https?:\/\//, "");
