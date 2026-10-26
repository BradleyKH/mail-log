import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { tokenizeFortran, type LineTokens } from "./fortranHighlighter";
import { gutterLabel, isCommentLine, resolveLineId, type FortranLine } from "./fortranLines";

export type FortranBlockProps = {
  lines: FortranLine[];
  /** `id` shows `NNNN`, `printed` shows `(NNNN)`, `none` hides the gutter. */
  gutter?: "id" | "printed" | "none";
  /** A line id, or a bare sequence number that resolves to its first occurrence. Scrolled into view and marked. */
  highlightId?: string | null;
  /** Returns a URL for a line's gutter number, or undefined for no link. */
  lineHref?: (id: string) => string | undefined;
  /** `page` scrolls the window to the highlighted line; `block` scrolls only this block's own scroller, never the page. */
  scroll?: "page" | "block";
  className?: string;
};

export default function FortranBlock({ lines, gutter = "id", highlightId, lineHref, scroll = "page", className }: FortranBlockProps) {
  const [tokens, setTokens] = useState<LineTokens[] | undefined>();
  const markedRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const activeId = resolveLineId(lines, highlightId);
  const source = lines.map((l) => l.text).join("\n");

  useEffect(() => {
    let cancelled = false;
    setTokens(undefined);
    tokenizeFortran(source)
      .then((t) => {
        if (!cancelled) setTokens(t);
      })
      .catch(() => {
        // Plain text stays on screen if the highlighter fails to load.
      });
    return () => {
      cancelled = true;
    };
  }, [source]);

  useEffect(() => {
    const marked = markedRef.current;
    if (!marked) return;
    if (scroll === "page") {
      marked.scrollIntoView?.({ block: "center" });
      return;
    }
    const root = rootRef.current;
    if (root) root.scrollTop = marked.offsetTop - (root.clientHeight - marked.offsetHeight) / 2;
  }, [activeId, lines, scroll]);

  return (
    <div
      ref={rootRef}
      className={cn("relative overflow-x-auto rounded-md border bg-card font-mono text-[13px] leading-6", className)}
      data-slot="fortran-block"
    >
      <div className="w-max min-w-full py-2">
        {lines.map((line, i) => {
          const label = gutter === "none" ? "" : gutterLabel(line.id, gutter);
          const href = lineHref?.(line.id);
          const active = line.id === activeId;
          const comment = isCommentLine(line.text);
          return (
            <div
              key={line.id}
              ref={active ? markedRef : undefined}
              id={`line-${line.id}`}
              data-line-id={line.id}
              data-active={active || undefined}
              data-comment={comment || undefined}
              className={cn("flex px-3", active && "bg-primary/15 shadow-[inset_3px_0_0_var(--primary)]")}
            >
              {gutter !== "none" && (
                <span className="sticky left-0 mr-4 w-14 shrink-0 bg-card text-right text-muted-foreground tabular-nums select-none">
                  {href && label ? (
                    <Link to={href} className="underline-offset-2 hover:underline">
                      {label}
                    </Link>
                  ) : (
                    label
                  )}
                </span>
              )}
              <code className={cn("whitespace-pre", comment && "text-(--ink-faded) italic")}>
                {tokens?.[i] && !comment
                  ? tokens[i].map((t, j) => (
                      <span key={j} className="text-(--shiki-light) dark:text-(--shiki-dark)" style={t.htmlStyle as CSSProperties}>
                        {t.content}
                      </span>
                    ))
                  : line.text || " "}
              </code>
            </div>
          );
        })}
      </div>
    </div>
  );
}
