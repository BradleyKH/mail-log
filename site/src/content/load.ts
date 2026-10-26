import {
  DOC_IDS,
  codeIndexSchema,
  flagsSchema,
  routineLinesSchema,
  xrefSchema,
  docMetaSchema,
  fieldsSchema,
  figuresSchema,
  flowSchema,
  flowchartsSchema,
  glossarySchema,
  parsePageFile,
  routineDescriptionsSchema,
  sampleRecordsSchema,
  sectionsSchema,
  spadsFieldsSchema,
  spadsMenusSchema,
  spadsRecordsSchema,
  spadsReportsSchema,
  spadsTablesSchema,
} from "./schema";
import type {
  CodeIndex,
  DocId,
  Flags,
  RoutineLines,
  Xref,
  DocMeta,
  Field,
  Figure,
  Flow,
  Flowchart,
  GlossaryEntry,
  Page,
  RecordType,
  RoutineDescription,
  SampleRecord,
  Section,
  SpadsField,
  SpadsRecord,
  SpadsReport,
  SpadsTables,
} from "./types";

// Overrides are merged into pages/ by the import script, so only pages/ is ever loaded.
// Patterns never reach content/fixtures/.
const docMetaFiles = import.meta.glob<unknown>("@content/docs/*/doc.json", { eager: true, import: "default" });
const sectionFiles = import.meta.glob<unknown>("@content/docs/*/sections.json", { eager: true, import: "default" });
const figureFiles = import.meta.glob<unknown>("@content/docs/*/figures.json", { eager: true, import: "default" });
const glossaryFiles = import.meta.glob<unknown>("@content/docs/*/glossary.json", { eager: true, import: "default" });
const flowchartFiles = import.meta.glob<unknown>("@content/docs/cr-159063/flowcharts.json", { import: "default" });
const pageFiles = import.meta.glob<string>("@content/docs/*/pages/page-*.md", { query: "?raw", import: "default" });
const flowFiles = import.meta.glob<unknown>("@content/program/flows/*.json", { eager: true, import: "default" });
const fieldFiles = import.meta.glob<unknown>("@content/program/fields/*.json", { eager: true, import: "default" });
const recordFiles = import.meta.glob<unknown>("@content/program/records/*.json", { eager: true, import: "default" });
const descriptionFiles = import.meta.glob<unknown>("@content/code/descriptions.json", { import: "default" });
const codeIndexFiles = import.meta.glob<unknown>("@content/code/index.json", { import: "default" });
const xrefFiles = import.meta.glob<unknown>("@content/code/xref.json", { import: "default" });
const routineSourceFiles = import.meta.glob<string>("@content/code/routines/*.f", { query: "?raw", import: "default" });
const routineLineFiles = import.meta.glob<unknown>("@content/code/routines/*.lines.json", { import: "default" });
const flagFiles = import.meta.glob<unknown>("@content/reports/flags.json", { import: "default" });
const spadsFieldFiles = import.meta.glob<unknown>("@content/spads/fields.json", { import: "default" });
const spadsJobOrderFieldFiles = import.meta.glob<unknown>("@content/spads/jobOrderFields.json", { import: "default" });
const spadsRecordFiles = import.meta.glob<unknown>("@content/spads/records.json", { import: "default" });
const spadsTableFiles = import.meta.glob<unknown>("@content/spads/tables.json", { import: "default" });
const spadsReportFiles = import.meta.glob<unknown>("@content/spads/reports.json", { import: "default" });
const spadsMenuFiles = import.meta.glob<unknown>("@content/spads/menus.json", { import: "default" });

const DOC_PATH = /\/docs\/([^/]+)\//;
const NAME = /\/([^/]+)\.json$/;

function docIdOf(key: string): DocId {
  const id = DOC_PATH.exec(key)?.[1];
  if (!id || !(DOC_IDS as readonly string[]).includes(id)) throw new Error(`Unexpected document in content/docs: ${key}`);
  return id as DocId;
}

function byDoc<T>(files: Record<string, unknown>, parse: (raw: unknown) => T): Partial<Record<DocId, T>> {
  const out: Partial<Record<DocId, T>> = {};
  for (const [key, raw] of Object.entries(files)) out[docIdOf(key)] = parse(raw);
  return out;
}

function byName<T>(files: Record<string, unknown>, parse: (raw: unknown) => T): Partial<Record<RecordType, T>> {
  const out: Partial<Record<string, T>> = {};
  for (const [key, raw] of Object.entries(files)) out[NAME.exec(key)![1]] = parse(raw);
  return out as Partial<Record<RecordType, T>>;
}

for (const key of Object.keys(pageFiles)) docIdOf(key);

const docMeta = byDoc(docMetaFiles, (r) => docMetaSchema.parse(r));
const sections = byDoc(sectionFiles, (r) => sectionsSchema.parse(r));
const figures = byDoc(figureFiles, (r) => figuresSchema.parse(r));
const glossaries = byDoc(glossaryFiles, (r) => glossarySchema.parse(r));
const flows = byName(flowFiles, (r) => flowSchema.parse(r));
const fields = byName(fieldFiles, (r) => fieldsSchema.parse(r));
const records = byName(recordFiles, (r) => sampleRecordsSchema.parse(r));

/** The in-site reports in their canonical order. */
export function listDocs(): DocMeta[] {
  return DOC_IDS.flatMap((id) => (docMeta[id] ? [docMeta[id]] : []));
}

export function getDoc(docId: string): DocMeta | undefined {
  return docMeta[docId as DocId];
}

export const getSections = (docId: DocId): Section[] => sections[docId] ?? [];
export const getFigures = (docId: DocId): Figure[] => figures[docId] ?? [];
export const getGlossary = (docId: DocId): GlossaryEntry[] => glossaries[docId] ?? [];
export const getFlow = (record: RecordType): Flow | undefined => flows[record];
export const getFields = (record: RecordType): Field[] => fields[record] ?? [];
export const getSampleRecords = (record: RecordType): SampleRecord[] => records[record] ?? [];

const pagePath = (docId: DocId, pdfPage: number) =>
  Object.keys(pageFiles).find((k) => k.endsWith(`/docs/${docId}/pages/page-${String(pdfPage).padStart(3, "0")}.md`));

/** Loads one page lazily so the page bodies stay out of the main bundle. */
export async function loadPage(docId: DocId, pdfPage: number): Promise<Page | undefined> {
  const key = pagePath(docId, pdfPage);
  if (!key) return undefined;
  const { frontmatter, body } = parsePageFile(await pageFiles[key]());
  return { ...frontmatter, docId, body };
}

export function hasPage(docId: DocId, pdfPage: number): boolean {
  return pagePath(docId, pdfPage) !== undefined;
}

export async function loadFlowcharts(): Promise<Flowchart[]> {
  const load = Object.values(flowchartFiles)[0];
  return load ? flowchartsSchema.parse(await load()) : [];
}

export async function loadRoutineDescriptions(): Promise<RoutineDescription[]> {
  const load = Object.values(descriptionFiles)[0];
  return load ? routineDescriptionsSchema.parse(await load()) : [];
}

async function loadOne<T>(files: Record<string, () => Promise<unknown>>, parse: (raw: unknown) => T): Promise<T | undefined> {
  const load = Object.values(files)[0];
  return load ? parse(await load()) : undefined;
}

/** The code index: every routine with its calls, files, prompts, and links to pages and flowcharts. */
export const loadCodeIndex = (): Promise<CodeIndex | undefined> => loadOne(codeIndexFiles, (r) => codeIndexSchema.parse(r));

/** Links between the manual's flow steps and the routines whose printed prompts match them. */
export const loadXref = (): Promise<Xref | undefined> => loadOne(xrefFiles, (r) => xrefSchema.parse(r));

/** The import's flag report: pages still needing review, with reasons. */
export const loadFlags = (): Promise<Flags | undefined> => loadOne(flagFiles, (r) => flagsSchema.parse(r));

/** Contract Analysis header fields (CR-177949 section 2.5). */
export const spadsFields = (): Promise<SpadsField[] | undefined> => loadOne(spadsFieldFiles, (r) => spadsFieldsSchema.parse(r));

/** Contract Analysis job-order fields. */
export const spadsJobOrderFields = (): Promise<SpadsField[] | undefined> =>
  loadOne(spadsJobOrderFieldFiles, (r) => spadsFieldsSchema.parse(r));

/** Analysis records the CR-177949 manual prints, as printed. */
export const spadsRecords = (): Promise<SpadsRecord[] | undefined> => loadOne(spadsRecordFiles, (r) => spadsRecordsSchema.parse(r));

/** The fee, rate, sustaining, program number, and time tables from appendix D. */
export const spadsTables = (): Promise<SpadsTables | undefined> => loadOne(spadsTableFiles, (r) => spadsTablesSchema.parse(r));

/** Appendix report samples with their cover-sheet options and printout checks. */
export const spadsReports = (): Promise<SpadsReport[] | undefined> => loadOne(spadsReportFiles, (r) => spadsReportsSchema.parse(r));

/** Screen text keyed by menu name; an array holds one screen line per entry. */
export const spadsMenus = (): Promise<Record<string, string | string[]> | undefined> =>
  loadOne(spadsMenuFiles, (r) => spadsMenusSchema.parse(r));

const routineFile = (files: Record<string, unknown>, id: string, suffix: string) =>
  Object.keys(files).find((k) => k.endsWith(`/code/routines/${id}${suffix}`));

/** One routine's FORTRAN as printed, one card per line. */
export async function loadRoutineSource(id: string): Promise<string | undefined> {
  const key = routineFile(routineSourceFiles, id, ".f");
  return key ? routineSourceFiles[key]() : undefined;
}

/** Line ids (`NNNN.k` or `uN`) and listing pages for each line of a routine's source. */
export async function loadRoutineLines(id: string): Promise<RoutineLines | undefined> {
  const key = routineFile(routineLineFiles, id, ".lines.json");
  return key ? routineLinesSchema.parse(await routineLineFiles[key]()) : undefined;
}

const allPagesByDoc = new Map<DocId, Promise<Page[]>>();

/** Every page of one document, loaded once and cached; chunked by doc so search can index documents as needed. */
export function loadAllPages(docId: DocId): Promise<Page[]> {
  let cached = allPagesByDoc.get(docId);
  if (!cached) {
    const prefix = `/docs/${docId}/pages/`;
    const keys = Object.keys(pageFiles)
      .filter((k) => k.includes(prefix))
      .sort();
    cached = Promise.all(
      keys.map(async (key) => {
        const { frontmatter, body } = parsePageFile(await pageFiles[key]());
        return { ...frontmatter, docId, body };
      }),
    );
    allPagesByDoc.set(docId, cached);
  }
  return cached;
}
