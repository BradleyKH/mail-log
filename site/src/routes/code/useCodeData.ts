import { useEffect, useState } from "react";
import { loadCodeData, type CodeData } from "./codeLinks";

/** `undefined` while loading, `null` when the code index is missing. */
export function useCodeData(): CodeData | null | undefined {
  const [data, setData] = useState<CodeData | null | undefined>();
  useEffect(() => {
    let live = true;
    loadCodeData().then(
      (d) => live && setData(d ?? null),
      () => live && setData(null),
    );
    return () => {
      live = false;
    };
  }, []);
  return data;
}
