import { useEffect, useState } from "react";
import { loadRoutineSource } from "@/content/load";
import { displayText } from "@/lib/display";

const cache = new Map<string, Promise<string[]>>();

/** Fixed-form FORTRAN marks a comment card with C or * in column 1. */
export function firstComments(source: string, count: number): string[] {
  return source
    .split(/\r?\n/)
    .filter((l) => /^[Cc*]/.test(l) && l.slice(1).trim().length > 0)
    .slice(0, count)
    .map((l) => displayText(l.trimEnd()));
}

/** The opening comment cards of a routine, loaded on demand and cached. */
export function useRoutineComments(id: string | null, count = 3): string[] | null {
  const [state, setState] = useState<{ id: string; lines: string[] } | null>(null);
  useEffect(() => {
    if (!id) return;
    let live = true;
    let pending = cache.get(id);
    if (!pending) {
      pending = loadRoutineSource(id).then((src) => (src ? firstComments(src, 8) : []));
      cache.set(id, pending);
    }
    pending.then((lines) => live && setState({ id, lines })).catch(() => live && setState({ id, lines: [] }));
    return () => {
      live = false;
    };
  }, [id]);
  return state && state.id === id ? state.lines.slice(0, count) : null;
}
