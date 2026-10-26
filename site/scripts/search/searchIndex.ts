import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { z } from "zod";
import {
  DOC_IDS,
  codeIndexSchema,
  figuresSchema,
  glossarySchema,
  parsePageFile,
  sectionsSchema,
} from "../../src/content/schema.ts";
import type { CodeIndex, Page } from "../../src/content/types.ts";
import { CODE_INDEXED_DOCS, buildSearchDocs, routinesByPage, type DocContent } from "../../src/lib/search/buildDocs.ts";
import type { SearchDoc } from "../../src/lib/search/types.ts";

function readJson<T>(file: string, schema: z.ZodType<T>, fallback: T): T {
  return existsSync(file) ? schema.parse(JSON.parse(readFileSync(file, "utf8"))) : fallback;
}

/** Reads the in-site reports from `contentDir` and builds the search documents, mirroring what the site loads. */
export function buildSearchDocsFromDisk(contentDir: string): SearchDoc[] {
  const codeIndexFile = path.join(contentDir, "code", "index.json");
  const codeIndex: CodeIndex | undefined = existsSync(codeIndexFile)
    ? codeIndexSchema.parse(JSON.parse(readFileSync(codeIndexFile, "utf8")))
    : undefined;
  const codeRoutines = routinesByPage(codeIndex);

  const contents: DocContent[] = [];
  for (const docId of DOC_IDS) {
    const docDir = path.join(contentDir, "docs", docId);
    if (!existsSync(path.join(docDir, "doc.json"))) continue;
    const pagesDir = path.join(docDir, "pages");
    const pageNames = existsSync(pagesDir)
      ? readdirSync(pagesDir)
          .filter((f) => /^page-.*\.md$/.test(f))
          .sort()
      : [];
    const pages: Page[] = pageNames.map((f) => {
      const { frontmatter, body } = parsePageFile(readFileSync(path.join(pagesDir, f), "utf8"));
      return { ...frontmatter, docId, body };
    });
    contents.push({
      docId,
      pages,
      sections: readJson(path.join(docDir, "sections.json"), sectionsSchema, []),
      figures: readJson(path.join(docDir, "figures.json"), figuresSchema, []),
      glossary: readJson(path.join(docDir, "glossary.json"), glossarySchema, []),
      routinesByPage: CODE_INDEXED_DOCS.includes(docId) ? codeRoutines : new Map(),
    });
  }
  return buildSearchDocs(contents);
}
