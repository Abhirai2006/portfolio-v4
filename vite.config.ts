import { defineConfig, loadEnv } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

// Nitro auto-detects Vercel (and other hosts) at build time. Anywhere it can't
// detect, it falls back to Cloudflare Workers. Force a target with NITRO_PRESET.
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const define = Object.fromEntries(
    Object.entries(env).map(([k, v]) => [`import.meta.env.${k}`, JSON.stringify(v)]),
  );

  return {
    define,
    css: { transformer: "lightningcss" },
    resolve: {
      alias: { "@": `${process.cwd()}/src` },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    server: { host: "::", port: 8080 },
    plugins: [
      tailwindcss(),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      tanstackStart({
        // our SSR error wrapper lives in src/server.ts
        server: { entry: "server" },
        importProtection: {
          behavior: "error",
          client: { files: ["**/server/**"], specifiers: ["server-only"] },
        },
      }),
      ...(command === "build"
        ? [nitro(
            process.env.NITRO_PRESET
              ? { preset: process.env.NITRO_PRESET }
              : {
                  defaultPreset: "cloudflare-module",
                  cloudflare: {
                    wrangler: {
                      // Must match the Worker name in the Cloudflare dashboard.
                      name: "portfolio",
                      // Keep variables/secrets set in the dashboard on every deploy.
                      keep_vars: true,
                      observability: { enabled: true },
                    },
                  },
                },
          )]
        : []),
      viteReact(),
    ],
  };
});
