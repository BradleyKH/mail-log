import { useCallback, useEffect, useRef, useState } from "react";

/** 10 bits per character on an asynchronous serial line: start, 8 data, stop. */
const BITS_PER_CHAR = 10;

/**
 * Reveals `total` characters at a terminal's baud rate. `baud` of 0 shows everything at once.
 * Returns how many characters are visible and a way to skip to the end.
 */
export function useTypewriter(total: number, baud: number) {
  const [shown, setShown] = useState(total);
  const shownRef = useRef(shown);
  shownRef.current = shown;

  useEffect(() => {
    if (baud === 0 || total < shownRef.current) {
      setShown(total);
      return;
    }
    if (shownRef.current >= total) return;
    const cps = baud / BITS_PER_CHAR;
    let frame = 0;
    let last = performance.now();
    let carry = 0;
    const tick = (now: number) => {
      carry += ((now - last) / 1000) * cps;
      last = now;
      const step = Math.floor(carry);
      if (step > 0) {
        carry -= step;
        setShown((s) => Math.min(total, s + step));
      }
      if (shownRef.current + step < total) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [total, baud]);

  const skip = useCallback(() => setShown(total), [total]);
  return { shown: Math.min(shown, total), printing: shown < total, skip };
}
