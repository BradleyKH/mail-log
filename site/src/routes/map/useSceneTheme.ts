import { useEffect, useState } from "react";
import type { SceneTheme } from "./palette";

const read = (): SceneTheme => (document.documentElement.classList.contains("dark") ? "dark" : "light");

/** Follows the `dark` class the header's theme toggle sets on <html>. */
export function useSceneTheme(): SceneTheme {
  const [theme, setTheme] = useState<SceneTheme>(read);
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(read()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return theme;
}
