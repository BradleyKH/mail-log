import type { Section } from "@/content/types";

// Every report's page 1 is its cover, which no printed contents list names.
export const TITLE_PAGE: Section = { id: "0.0", title: "TITLE PAGE", level: 1, pdfPage: 1 };

export function withTitlePage(sections: Section[]): Section[] {
  return [TITLE_PAGE, ...sections];
}
