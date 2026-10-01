import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const KEY = "theme";

function apply(light: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("light", light);
}

/** Full-bleed banner that drops/rises over the page during the swap. */
function playBanner(label: string, fromRight: boolean) {
  if (typeof document === "undefined") return;
  if (document.documentElement.dataset["reduceMotion"] === "true") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  const el = document.createElement("div");
  el.className = fromRight ? "theme-banner from-right" : "theme-banner";
  el.textContent = label;
  document.body.appendChild(el);
  window.setTimeout(() => el.remove(), 700);
}

export function useTheme() {
  const [light, setLight] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    const initial = stored === "light";
    setLight(initial);
    apply(initial);
    setReady(true);
  }, []);

  function toggle() {
    const next = !light;
    const commit = () => {
      setLight(next);
      apply(next);
      localStorage.setItem(KEY, next ? "light" : "dark");
    };

    // dark → light wipes left→right, light → dark wipes right→left
    playBanner(next ? "daylight mode" : "night mode", !next);
    document.documentElement.classList.toggle("theme-sweep-left", !next);

    const startVT = (document as Document & {
      startViewTransition?: (cb: () => void) => { finished: Promise<void> };
    }).startViewTransition;

    if (typeof startVT === "function" && document.documentElement.dataset["reduceMotion"] !== "true") {
      startVT.call(document, commit);
    } else {
      commit();
    }
  }

  return { light, ready, toggle };
}

/** Light/dark switch with a banner-drop transition. */
export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { light, ready, toggle } = useTheme();

  if (!ready) return null;

  const label = light ? "Switch to dark theme" : "Switch to light theme";

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={light}
        aria-label={label}
        title={label}
        className="inline-flex items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur p-2 text-muted-foreground hover:text-primary hover:border-primary transition-colors"
      >
        {light ? <Moon className="h-4 w-4" aria-hidden="true" /> : <Sun className="h-4 w-4" aria-hidden="true" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={light}
      aria-label={label}
      title={label}
      className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 backdrop-blur px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary transition-colors shadow-lg"
    >
      {light ? <Moon className="h-3.5 w-3.5" aria-hidden="true" /> : <Sun className="h-3.5 w-3.5" aria-hidden="true" />}
      {light ? "dark" : "light"}
    </button>
  );
}
