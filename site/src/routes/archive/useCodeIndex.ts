import { useEffect, useState } from "react";
import { loadCodeIndex } from "@/content/load";
import type { CodeIndex } from "@/content/types";

let pending: Promise<CodeIndex | undefined> | undefined;

/** The code index, loaded once; undefined until it arrives. */
export function useCodeIndex(): CodeIndex | undefined {
  const [index, setIndex] = useState<CodeIndex | undefined>();
  useEffect(() => {
    let live = true;
    pending ??= loadCodeIndex();
    pending.then((i) => live && setIndex(i)).catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  return index;
}
