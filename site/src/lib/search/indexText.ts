import type { Page } from "../../content/types.ts";

const LISTING_LINE = /^\((\d{4})\)\s?(.*)$/;

/** Printed FORTRAN comment cards (C or * in column 1), without the sequence number or the comment marker. */
export function listingCommentText(body: string): string {
  const out: string[] = [];
  for (const raw of body.split("\n")) {
    const m = LISTING_LINE.exec(raw);
    if (!m || !/^[Cc*]/.test(m[2])) continue;
    const text = m[2].slice(1).trim();
    if (text) out.push(text);
  }
  return out.join("\n");
}

/** Text a page contributes to the search index; listings add comments only so source code never drowns prose. */
export function pageIndexText(page: Page): string {
  if (page.kind === "listing") return page.body.startsWith("```fortran") ? listingCommentText(page.body) : "";
  return page.body.replace(/```\w*/g, "");
}
