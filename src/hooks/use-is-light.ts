import { useEffect, useState } from "react";

/** True while the site is in light mode (the theme toggle puts a `light` class on <html>). */
export function useIsLight(): boolean {
  const [light, setLight] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setLight(root.classList.contains("light"));
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return light;
}
