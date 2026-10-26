import type { DocId } from "@/content/types";

/** URL of a page scan, or its thumbnail, under the deploy base path. */
export function scanUrl(docId: DocId, pdfPage: number, thumb = false): string {
  const name = `page-${String(pdfPage).padStart(3, "0")}.webp`;
  return `${import.meta.env.BASE_URL}scans/${docId}/${thumb ? "thumbs/" : ""}${name}`;
}

export const pagePath = (docId: DocId, pdfPage: number) => `/archive/${docId}/page/${pdfPage}`;
