import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
      <div className="relative max-w-lg text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-muted-foreground">
          error · 404
        </p>
        <h1
          className="mt-4 text-8xl md:text-9xl text-primary"
          style={{ fontFamily: "Allura, cursive" }}
        >
          Lost?
        </h1>
        <p className="mt-2 text-2xl text-foreground" style={{ fontFamily: "Caveat, cursive" }}>
          "Whatever you lose, you'll find it again.
          <br />
          But what you throw away you'll never get back."
        </p>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Roronoa Zoro, One Piece
        </p>
        <p className="mt-6 text-sm text-muted-foreground">
          This page wandered off the Grand Line. Let's get you back on course.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Sail back home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm transition-colors hover:border-primary hover:text-primary"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "google-site-verification", content: "P2DRuJ18Vnv9ODoBdeu9g8N8WJNXvirCetwE0pxIK2Y" },
      { title: "Abhishek Rai A - ML Engineer · Live Projects" },
      { name: "description", content: "Portfolio of Abhishek Rai A, a B.E. AI & ML student and Bluemind Solutions intern who built a Customer Churn Intelligence System." },
      { name: "author", content: "Abhishek Rai A" },
      { property: "og:title", content: "Abhishek Rai A - ML Engineer · Live Projects" },
      { property: "og:description", content: "Portfolio of Abhishek Rai A, a B.E. AI & ML student and Bluemind Solutions intern who built a Customer Churn Intelligence System." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Abhishek Rai A - ML Engineer · Live Projects" },
      { name: "twitter:description", content: "Portfolio of Abhishek Rai A, a B.E. AI & ML student and Bluemind Solutions intern who built a Customer Churn Intelligence System." },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Allura&family=Bebas+Neue&family=Caveat:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
