import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { displayText } from "@/lib/display";
import type { DocId, Section } from "@/content/types";
import { pagePath } from "./scanUrl";
import { useIsDesktop } from "./useIsDesktop";

type Props = { docId: DocId; sections: Section[]; currentSectionId: string | null; pdfPage: number };

/** Sticky contents list; a collapsed disclosure on small screens. */
export default function SidebarToc({ docId, sections, currentSectionId, pdfPage }: Props) {
  const desktop = useIsDesktop();
  const listRef = useRef<HTMLDivElement>(null);

  const current =
    sections.find((s) => s.id === currentSectionId)?.id ??
    [...sections].reverse().find((s) => s.pdfPage <= pdfPage)?.id ??
    null;

  useEffect(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>("[aria-current]");
    if (!list || !active) return;
    const top = active.offsetTop - list.offsetTop;
    if (top < list.scrollTop || top + active.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = top - list.clientHeight / 3;
    }
  }, [current, desktop]);

  if (sections.length === 0) return null;
  return (
    <details key={String(desktop)} open={desktop} className="rounded-md border bg-card lg:sticky lg:top-20 lg:self-start">
      <summary className="cursor-pointer px-3 py-2 text-sm font-medium lg:hidden">Contents</summary>
      <div ref={listRef} className="relative max-h-72 overflow-y-auto py-2 lg:max-h-[calc(100svh-7rem)]">
        <p className="hidden px-3 pb-1 font-mono text-xs tracking-widest text-muted-foreground uppercase lg:block">Contents</p>
        <ul className="text-sm">
          {sections.map((s) => (
            <li key={s.id}>
              <Link
                to={pagePath(docId, s.pdfPage)}
                aria-current={s.id === current ? "location" : undefined}
                style={{ paddingLeft: `${0.75 + Math.max(0, s.level - 1) * 0.75}rem` }}
                className={cn(
                  "flex gap-2 py-1 pr-3 hover:bg-accent",
                  s.id === current && "bg-accent font-medium shadow-[inset_3px_0_0_var(--primary)]",
                )}
              >
                <span className="shrink-0 font-mono text-xs text-muted-foreground">{s.id}</span>
                <span className="min-w-0 break-words">{displayText(s.title)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
