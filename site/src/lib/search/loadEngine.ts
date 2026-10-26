import { createSearchEngine, type SearchEngine } from "./engine";

let engine: Promise<SearchEngine> | undefined;

/** Builds the engine once, on first use, from the search documents generated at build time (their own lazy chunk). */
export function loadSearchEngine(): Promise<SearchEngine> {
  engine ??= import("virtual:search-index").then((m) => createSearchEngine(m.default));
  return engine;
}
