import type { DocMeta } from "@/content/types";

export interface ShelfGroupDef {
  date: DocMeta["date"];
  title: string;
  description: string;
}

export const SHELF_GROUPS: ShelfGroupDef[] = [
  {
    date: "1979-05",
    title: "MAIL LOG, May 1979",
    description: "Four contractor reports on the FORTRAN records-tracking program of the Scout Project Office.",
  },
  {
    date: "1985-07",
    title: "SPADS user's manuals, July 1985",
    description: "Three operating-procedures volumes for the Scout Project Information and financial programs.",
  },
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Turns a `YYYY-MM` doc date into "May 1979". */
export function formatDocDate(date: string): string {
  const [year, month] = date.split("-");
  return `${MONTHS[Number(month) - 1] ?? month} ${year}`;
}

export function groupDocs(docs: DocMeta[]): { group: ShelfGroupDef; docs: DocMeta[] }[] {
  return SHELF_GROUPS.map((group) => ({ group, docs: docs.filter((d) => d.date === group.date) })).filter(
    (g) => g.docs.length > 0,
  );
}
