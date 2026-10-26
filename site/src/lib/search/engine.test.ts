import { beforeAll, describe, expect, it } from "vitest";
import generatedDocs from "virtual:search-index";
import { getFigures, getGlossary, getSections, listDocs, loadAllPages, loadCodeIndex } from "@/content/load";
import { CODE_INDEXED_DOCS, buildSearchDocs, routinesByPage } from "./buildDocs";
import { loadSearchEngine } from "./loadEngine";
import type { SearchEngine } from "./engine";
import { listingCommentText } from "./indexText";
import { buildSnippet } from "./snippet";

describe("search engine over the real content", () => {
  let engine: SearchEngine;
  beforeAll(async () => {
    engine = await loadSearchEngine();
  }, 60_000);

  it("finds the author/source search page near the top", () => {
    const hits = engine.search("AUTHOR/SOURCE").slice(0, 5);
    expect(hits.some((h) => h.docId === "cr-159065" && h.pdfPage === 40)).toBe(true);
  });

  it("returns AUSEA's listing and flowchart pages", () => {
    const hits = engine.search("AUSEA");
    expect(hits.some((h) => h.kind === "listing" && h.docId === "cr-159064" && h.pdfPage === 86)).toBe(true);
    expect(hits.some((h) => h.kind === "flowchart" && h.docId === "cr-159063" && h.pdfPage === 180)).toBe(true);
  });

  it("finds MAGSAT in a figure page with a highlighted snippet", () => {
    const hit = engine.search("MAGSAT").find((h) => h.docId === "cr-159065" && h.pdfPage === 115);
    expect(hit?.snippet.some((s) => s.match)).toBe(true);
  });

  it("indexes listing comments but not code", () => {
    const body = "```fortran\n(0001)       CALL SECRETCODE\n(0002) C      THIS IS A COMMENT\n```";
    expect(listingCommentText(body)).toBe("THIS IS A COMMENT");
  });
});

describe("generated search index", () => {
  it("matches the documents built from the site's own content loaders", async () => {
    const docs = listDocs();
    const [codeIndex, ...pageSets] = await Promise.all([loadCodeIndex(), ...docs.map((d) => loadAllPages(d.docId))]);
    const routines = routinesByPage(codeIndex);
    const expected = buildSearchDocs(
      docs.map((doc, i) => ({
        docId: doc.docId,
        pages: pageSets[i],
        sections: getSections(doc.docId),
        figures: getFigures(doc.docId),
        glossary: getGlossary(doc.docId),
        routinesByPage: CODE_INDEXED_DOCS.includes(doc.docId) ? routines : new Map(),
      })),
    );
    expect(generatedDocs).toEqual(expected);
  }, 60_000);
});

describe("buildSnippet", () => {
  it("marks matches", () => {
    expect(buildSnippet("find the author here", ["author"])).toEqual([
      { text: "find the ", match: false },
      { text: "author", match: true },
      { text: " here", match: false },
    ]);
  });
});
