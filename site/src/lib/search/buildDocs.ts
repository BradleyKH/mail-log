// Runs in Node at build time (via the search-index Vite plugin) as well as in the browser,
// so imports here stay relative and free of import.meta.glob.
import type { CodeIndex, DocId, Figure, GlossaryEntry, Page, Section } from "../../content/types.ts";
import { displayText } from "../display.ts";
import { pageIndexText } from "./indexText.ts";
import type { SearchDoc, SearchKind } from "./types.ts";

export type DocContent = {
  docId: DocId;
  pages: Page[];
  sections: Section[];
  figures: Figure[];
  glossary: GlossaryEntry[];
  /** pdfPage to routine names, from the code index (page frontmatter routines can be wrong). */
  routinesByPage: Map<number, string[]>;
};

/** The code index covers cr-159063 flowcharts and cr-159064 listings only. */
export const CODE_INDEXED_DOCS: readonly DocId[] = ["cr-159063", "cr-159064"];

export function routinesByPage(codeIndex: CodeIndex | undefined): Map<number, string[]> {
  const out = new Map<number, string[]>();
  for (const r of codeIndex?.routines ?? []) {
    for (const p of [...r.listingPages, ...r.symbolTablePages, ...r.flowchartPages]) {
      const names = out.get(p) ?? [];
      if (!names.includes(r.name)) names.push(r.name);
      out.set(p, names);
    }
  }
  return out;
}

function pageDoc(c: DocContent, page: Page, sectionTitle: string | undefined): SearchDoc {
  const routines = c.routinesByPage.get(page.pdfPage) ?? [];
  const figureTitles = page.figures
    .map((n) => c.figures.find((f) => f.number === n))
    .flatMap((f) => (f ? [`Figure ${f.number}: ${f.title}`] : []));
  const kind: SearchKind = page.kind === "listing" || page.kind === "flowchart" ? page.kind : "page";
  const base = sectionTitle ? `Page ${page.pdfPage}, ${sectionTitle}` : `Page ${page.pdfPage}`;
  const label = routines.length > 0 ? `${base} (${routines.join(", ")})` : figureTitles[0] ? `${base}, ${figureTitles[0]}` : base;
  return {
    id: `p:${c.docId}:${page.pdfPage}`,
    docId: c.docId,
    pdfPage: page.pdfPage,
    kind,
    title: routines.join(" "),
    text: pageIndexText(page),
    label: displayText(label),
  };
}

/** Flattens pages, sections, figures, and glossary entries into the documents the search index holds. */
export function buildSearchDocs(contents: DocContent[]): SearchDoc[] {
  const docs: SearchDoc[] = [];
  for (const c of contents) {
    const titleOf = new Map(c.sections.map((s) => [s.id, s.title]));
    for (const p of c.pages) docs.push(pageDoc(c, p, p.sectionId ? titleOf.get(p.sectionId) : undefined));
    for (const s of c.sections)
      docs.push({
        id: `s:${c.docId}:${s.id}`,
        docId: c.docId,
        pdfPage: s.pdfPage,
        kind: "section",
        title: `${s.id} ${s.title}`,
        text: "",
        label: displayText(`Section ${s.id}, ${s.title}`),
      });
    for (const f of c.figures)
      docs.push({
        id: `f:${c.docId}:${f.number}`,
        docId: c.docId,
        pdfPage: f.pdfPage,
        kind: "figure",
        title: `Figure ${f.number} ${f.title}`,
        text: "",
        label: displayText(`Figure ${f.number}, ${f.title}`),
      });
    c.glossary.forEach((g, i) =>
      docs.push({
        id: `g:${c.docId}:${i}`,
        docId: c.docId,
        pdfPage: g.pdfPage,
        kind: "glossary",
        title: g.term,
        text: g.definition,
        label: displayText(`Glossary, ${g.term}`),
      }),
    );
  }
  return docs;
}
