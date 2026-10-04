import { createFileRoute } from "@tanstack/react-router";
import { clientIp, isRateLimited } from "@/lib/guard";

const ALLOWED = new Set(["media.kitsu.app", "media.kitsu.io"]);
// Raster formats only. SVG is left out on purpose: served from our own origin it could run scripts.
const TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const MAX_BYTES = 5 * 1024 * 1024;

export const Route = createFileRoute("/api/public/poster")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (isRateLimited(`poster:${clientIp(request)}`, 120, 60_000)) {
          return new Response("Slow down", { status: 429 });
        }
        const raw = new URL(request.url).searchParams.get("url");
        if (!raw || raw.length > 600) return new Response("Missing url", { status: 400 });

        let target: URL;
        try {
          target = new URL(raw);
        } catch {
          return new Response("Bad url", { status: 400 });
        }
        if (target.protocol !== "https:" || !ALLOWED.has(target.hostname) || target.port) {
          return new Response("Host not allowed", { status: 403 });
        }

        // redirect: "error" so an allowed host can never bounce us to somewhere else
        let upstream: Response;
        try {
          upstream = await fetch(target.toString(), { redirect: "error" });
        } catch {
          return new Response("Upstream failed", { status: 502 });
        }
        const type = (upstream.headers.get("content-type") ?? "")
          .split(";")[0]!
          .trim()
          .toLowerCase();
        const length = Number(upstream.headers.get("content-length") ?? 0);
        if (!upstream.ok || !TYPES.has(type) || length > MAX_BYTES) {
          return new Response("Not an image", { status: 502 });
        }

        return new Response(upstream.body, {
          status: 200,
          headers: {
            "content-type": type,
            "cache-control": "public, max-age=86400",
            "x-content-type-options": "nosniff",
            "content-security-policy": "default-src 'none'; sandbox",
            "cross-origin-resource-policy": "same-origin",
          },
        });
      },
    },
  },
});
