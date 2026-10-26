import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { z } from "zod";
import {
  DOC_IDS,
  RECORDS,
  codeIndexSchema,
  docMetaSchema,
  fieldsSchema,
  figuresSchema,
  flowSchema,
  flowchartsSchema,
  glossarySchema,
  knownGapsSchema,
  parsePageFile,
  routineDescriptionsSchema,
  routineLinesSchema,
  sampleRecordsSchema,
  sectionsSchema,
  spadsFieldsSchema,
  spadsMenusSchema,
  spadsRecordsSchema,
  spadsReportsSchema,
  spadsTablesSchema,
  xrefSchema,
} from "../src/content/schema.ts";
import type { DocMeta, Figure, Flow, KnownGap, PageFrontmatter, Section } from "../src/content/types.ts";

export type Level = "error" | "warning";
export interface Issue {
  level: Level;
  file: string;
  message: string;
}
export interface ValidateOptions {
  /** Names that must never appear in content. Empty or undefined skips the check. */
  denylist?: string[];
}

export interface KnownGapResult {
  /** Issues with matching warnings removed. */
  issues: Issue[];
  /** Warnings suppressed by the allowlist, with the allowlist's reason. */
  known: (Issue & { reason: string })[];
}

/** Moves warnings that match an allowlist entry (same file, message starts with the prefix) out of the issue list. Errors are never suppressed. */
export function applyKnownGaps(issues: Issue[], gaps: KnownGap[]): KnownGapResult {
  const result: KnownGapResult = { issues: [], known: [] };
  for (const i of issues) {
    const gap = i.level === "warning" ? gaps.find((g) => g.file === i.file && i.message.startsWith(g.messagePrefix)) : undefined;
    if (gap) result.known.push({ ...i, reason: gap.reason });
    else result.issues.push(i);
  }
  return result;
}

/** Reads and validates a known-gaps file. An absent file means no allowlist. Throws on malformed content. */
export function loadKnownGaps(file: string): KnownGap[] {
  if (!existsSync(file)) return [];
  return knownGapsSchema.parse(JSON.parse(readFileSync(file, "utf8")));
}

/** Page transcriptions of the 1985 volumes reproduce printed names by design. */
const TRANSCRIBED_PAGES = /^docs\/cr-1779(48|49|50)\/(pages|overrides)\//;

const pad3 = (n: number) => String(n).padStart(3, "0");
const PAGE_FILE = /^page-(\d{3})\.md$/;
const LISTING_LINE = /^\((\d{4})\)/;

export function validateContent(root: string, options: ValidateOptions = {}): Issue[] {
  const issues: Issue[] = [];
  const rel = (abs: string) => path.relative(root, abs).split(path.sep).join("/");
  const error = (file: string, message: string) => issues.push({ level: "error", file, message });
  const warn = (file: string, message: string) => issues.push({ level: "warning", file, message });

  function readJson<T>(abs: string, schema: z.ZodType<T>): T | undefined {
    let raw: unknown;
    try {
      raw = JSON.parse(readFileSync(abs, "utf8"));
    } catch (e) {
      error(rel(abs), `invalid JSON: ${(e as Error).message}`);
      return undefined;
    }
    const result = schema.safeParse(raw);
    if (!result.success) {
      for (const i of result.error.issues) error(rel(abs), `${i.path.join(".") || "(root)"}: ${i.message}`);
      return undefined;
    }
    return result.data;
  }

  function optionalJson<T>(abs: string, schema: z.ZodType<T>): T | undefined {
    if (!existsSync(abs)) {
      warn(rel(abs), "missing");
      return undefined;
    }
    return readJson(abs, schema);
  }

  const docsDir = path.join(root, "docs");
  const docs = new Map<string, { meta: DocMeta; sections?: Section[]; figures?: Figure[] }>();

  if (existsSync(docsDir)) {
    for (const docId of readdirSync(docsDir).sort()) {
      const docDir = path.join(docsDir, docId);
      if (!statSync(docDir).isDirectory()) continue;
      if (!(DOC_IDS as readonly string[]).includes(docId)) {
        error(rel(docDir), `docId "${docId}" is not one of the in-site reports (${DOC_IDS.join(", ")})`);
        continue;
      }
      const metaPath = path.join(docDir, "doc.json");
      if (!existsSync(metaPath)) {
        error(rel(metaPath), "missing");
        continue;
      }
      const meta = readJson(metaPath, docMetaSchema);
      if (!meta) continue;
      if (meta.docId !== docId) error(rel(metaPath), `docId "${meta.docId}" does not match its folder "${docId}"`);
      const sections = optionalJson(path.join(docDir, "sections.json"), sectionsSchema);
      const figures = optionalJson(path.join(docDir, "figures.json"), figuresSchema);
      optionalJson(path.join(docDir, "glossary.json"), glossarySchema);
      docs.set(docId, { meta, sections, figures });

      const sectionIds = sections && new Set(sections.map((s) => s.id));
      const figureNumbers = figures && new Set(figures.map((f) => f.number));
      if (sections) {
        const seen = new Set<string>();
        for (const s of sections) {
          if (seen.has(s.id)) error(rel(path.join(docDir, "sections.json")), `duplicate section id "${s.id}"`);
          seen.add(s.id);
          if (s.pdfPage > meta.pageCount) error(rel(path.join(docDir, "sections.json")), `section "${s.id}" pdfPage ${s.pdfPage} exceeds pageCount`);
        }
      }
      if (figures && sectionIds) {
        for (const f of figures) {
          if (f.sectionId !== null && !sectionIds.has(f.sectionId))
            error(rel(path.join(docDir, "figures.json")), `figure ${f.number} references unknown sectionId "${f.sectionId}"`);
        }
      }

      if (docId === "cr-159063") {
        const fc = path.join(docDir, "flowcharts.json");
        if (existsSync(fc)) readJson(fc, flowchartsSchema);
        else warn(rel(fc), "missing");
      }

      const checkPages = (dir: string, expectReviewed: boolean) => {
        const pages = new Map<number, { file: string; fm: PageFrontmatter; body: string }>();
        if (!existsSync(dir)) return pages;
        for (const name of readdirSync(dir).sort()) {
          const abs = path.join(dir, name);
          const m = PAGE_FILE.exec(name);
          if (!m) {
            error(rel(abs), "unexpected file name (want page-NNN.md)");
            continue;
          }
          let parsed: ReturnType<typeof parsePageFile>;
          try {
            parsed = parsePageFile(readFileSync(abs, "utf8"));
          } catch (e) {
            error(rel(abs), `invalid page: ${(e as Error).message.split("\n").slice(0, 6).join(" ")}`);
            continue;
          }
          const { frontmatter: fm, body } = parsed;
          const n = Number(m[1]);
          if (fm.pdfPage !== n) error(rel(abs), `pdfPage ${fm.pdfPage} does not match file name`);
          if (n > meta.pageCount) error(rel(abs), `page ${n} exceeds pageCount ${meta.pageCount}`);
          if (expectReviewed && fm.source === "ocr") error(rel(abs), 'override pages must have source "reviewed" or "ai"');
          if (fm.sectionId !== null) {
            if (!sectionIds) warn(rel(abs), `sectionId "${fm.sectionId}" cannot be checked without sections.json`);
            else if (!sectionIds.has(fm.sectionId)) error(rel(abs), `unknown sectionId "${fm.sectionId}"`);
          }
          for (const f of fm.figures) {
            if (!figureNumbers) warn(rel(abs), `figure ${f} cannot be checked without figures.json`);
            else if (!figureNumbers.has(f)) error(rel(abs), `unknown figure ${f}`);
          }
          if (fm.kind === "listing") {
            if (!fm.listing) error(rel(abs), 'listing pages need a "listing" frontmatter block');
            if (!/^```(fortran|text)$/m.test(body)) warn(rel(abs), "listing page has no fenced fortran or text block");
          }
          pages.set(n, { file: rel(abs), fm, body });
        }
        return pages;
      };

      const pages = checkPages(path.join(docDir, "pages"), false);
      checkPages(path.join(docDir, "overrides"), true);

      const missing: number[] = [];
      for (let n = 1; n <= meta.pageCount; n++) if (!pages.has(n)) missing.push(n);
      if (missing.length === meta.pageCount) warn(rel(path.join(docDir, "pages")), `no pages yet (expected page-001 to page-${pad3(meta.pageCount)})`);
      else if (missing.length > 0) warn(rel(path.join(docDir, "pages")), `missing pages: ${compressRanges(missing)}`);

      checkListingSequence(
        [...pages.entries()].sort(([a], [b]) => a - b).map(([, p]) => p),
        error,
        warn,
      );
    }
  } else {
    warn("docs", "missing");
  }

  const opInstructions = docs.get("cr-159065");
  const opFigures = opInstructions?.figures && new Set(opInstructions.figures.map((f) => f.number));

  for (const record of RECORDS) {
    const flowPath = path.join(root, "program", "flows", `${record}.json`);
    const flow = optionalJson(flowPath, flowSchema);
    if (flow) checkFlow(flow, rel(flowPath), record, opFigures, error, warn);

    const fieldsPath = path.join(root, "program", "fields", `${record}.json`);
    const fields = optionalJson(fieldsPath, fieldsSchema);
    const recordsPath = path.join(root, "program", "records", `${record}.json`);
    const samples = optionalJson(recordsPath, sampleRecordsSchema);
    if (fields && samples) {
      const names = new Set(fields.map((f) => f.name));
      for (const [i, s] of samples.entries()) {
        for (const key of Object.keys(s)) {
          if (key !== "sourceFigure" && !names.has(key)) warn(rel(recordsPath), `record ${i} has field "${key}" not in fields/${record}.json`);
        }
      }
    }
    if (samples && opFigures) {
      for (const [i, s] of samples.entries()) {
        if (!opFigures.has(s.sourceFigure)) error(rel(recordsPath), `record ${i} references unknown figure ${s.sourceFigure}`);
      }
    }
  }

  const descPath = path.join(root, "code", "descriptions.json");
  const descriptions = optionalJson(descPath, routineDescriptionsSchema);
  const vol1Sections = docs.get("cr-159063")?.sections;
  if (descriptions && vol1Sections) {
    const ids = new Set(vol1Sections.map((s) => s.id));
    for (const d of descriptions) {
      if (!ids.has(d.sectionId)) error(rel(descPath), `${d.routine} references unknown sectionId "${d.sectionId}"`);
    }
  }

  checkCodeIndex(root, rel, docs.get("cr-159064")?.sections, readJson, error);

  const spadsDir = path.join(root, "spads");
  const spadsFiles = [
    ["fields.json", spadsFieldsSchema],
    ["jobOrderFields.json", spadsFieldsSchema],
    ["records.json", spadsRecordsSchema],
    ["tables.json", spadsTablesSchema],
    ["reports.json", spadsReportsSchema],
    ["menus.json", spadsMenusSchema],
  ] as const;
  for (const [name, schema] of spadsFiles) {
    const abs = path.join(spadsDir, name);
    if (existsSync(abs)) readJson(abs, schema as z.ZodType<unknown>);
  }

  const names = (options.denylist ?? []).map((n) => n.trim()).filter(Boolean);
  if (names.length > 0) {
    for (const abs of walk(root)) {
      const r = rel(abs);
      if (r.startsWith("fixtures/") || TRANSCRIBED_PAGES.test(r)) continue;
      const text = readFileSync(abs, "utf8").toLowerCase();
      for (const name of names) {
        // Report the index, never the name itself, so logs and CI output stay clean.
        if (text.includes(name.toLowerCase())) error(r, `contains denylisted name #${names.indexOf(name) + 1}`);
      }
    }
  }

  return issues;
}

/** The generated code index is optional; when present, its routines, sources, and cross-references must agree. */
function checkCodeIndex(
  root: string,
  rel: (abs: string) => string,
  vol2Sections: Section[] | undefined,
  readJson: <T>(abs: string, schema: z.ZodType<T>) => T | undefined,
  error: (f: string, m: string) => void,
) {
  const codeDir = path.join(root, "code");
  const indexPath = path.join(codeDir, "index.json");
  if (!existsSync(indexPath)) return;
  const index = readJson(indexPath, codeIndexSchema);
  if (!index) return;
  const file = rel(indexPath);
  const ids = new Set<string>();
  const sectionIds = vol2Sections && new Set(vol2Sections.map((s) => s.id));
  for (const r of index.routines) {
    if (ids.has(r.id)) error(file, `duplicate routine id "${r.id}"`);
    ids.add(r.id);
    if (r.sectionId !== null && sectionIds && !sectionIds.has(r.sectionId)) error(file, `${r.id} references unknown cr-159064 sectionId "${r.sectionId}"`);
    const src = path.join(codeDir, "routines", `${r.id}.f`);
    const map = path.join(codeDir, "routines", `${r.id}.lines.json`);
    if (!existsSync(src) || !existsSync(map)) {
      error(file, `${r.id} is missing routines/${r.id}.f or .lines.json`);
      continue;
    }
    const sourceLines = readFileSync(src, "utf8").replace(/\n$/, "").split("\n").length;
    const lines = readJson(map, routineLinesSchema);
    if (sourceLines !== r.lines) error(rel(src), `has ${sourceLines} lines; index says ${r.lines}`);
    if (lines && lines.lineIds.length !== r.lines) error(rel(map), `maps ${lines.lineIds.length} lines; index says ${r.lines}`);
  }
  for (const r of index.routines) {
    for (const c of r.calls) if (c.target !== null && !ids.has(c.target)) error(file, `${r.id} calls unknown routine "${c.target}"`);
    for (const c of r.calledBy) if (!ids.has(c)) error(file, `${r.id} calledBy unknown routine "${c}"`);
  }
  const xrefPath = path.join(codeDir, "xref.json");
  if (!existsSync(xrefPath)) return;
  const xref = readJson(xrefPath, xrefSchema);
  if (!xref) return;
  const refs = [
    ...xref.stepToRoutines.flatMap((s) => s.matches.map((m) => m.routine)),
    ...xref.routineToSteps.map((r) => r.routine),
    ...xref.unmatchedRoutines,
  ];
  for (const id of new Set(refs)) if (!ids.has(id)) error(rel(xrefPath), `references unknown routine "${id}"`);
}

function checkFlow(
  flow: Flow,
  file: string,
  record: string,
  opFigures: Set<string> | undefined,
  error: (f: string, m: string) => void,
  warn: (f: string, m: string) => void,
) {
  if (flow.record !== record) error(file, `record "${flow.record}" does not match file name`);
  const steps = new Set<number>();
  for (const s of flow.steps) {
    if (steps.has(s.n)) error(file, `duplicate step ${s.n}`);
    steps.add(s.n);
  }
  const resolves = (t: number | "exit") => t === "exit" || steps.has(t);
  if (!steps.has(flow.entryStep)) error(file, `entryStep ${flow.entryStep} does not exist`);
  for (const s of flow.steps) {
    for (const b of s.branches) if (!resolves(b.goto)) error(file, `step ${s.n} branch "${b.when}" goes to missing step ${b.goto}`);
    if (s.next !== undefined && !resolves(s.next)) error(file, `step ${s.n} next goes to missing step ${s.next}`);
    if (s.branches.length === 0 && s.next === undefined) warn(file, `step ${s.n} has no branches and no next`);
    for (const f of s.figures) {
      if (opFigures && !opFigures.has(f)) error(file, `step ${s.n} references unknown figure ${f}`);
    }
  }
}

/**
 * Lines pulled in by $INSERT all print the insert statement's number, so equal numbers
 * repeat. Routine names recur across appendices, so state is keyed by appendix and
 * routine. Within a page, a drop in sequence number while the page lists another routine
 * means the next routine has begun.
 */
export function checkListingSequence(
  pages: { file: string; fm: PageFrontmatter; body: string }[],
  error: (f: string, m: string) => void,
  warn: (f: string, m: string) => void,
) {
  const last = new Map<string, number>();
  for (const p of pages) {
    if (p.fm.kind !== "listing" || !p.fm.listing || p.fm.listing.routines.length === 0) continue;
    const { appendix, routines } = p.fm.listing;
    const keyOf = (r: string) => `${appendix}:${r}`;
    let i = 0;
    for (const line of fencedLines(p.body, "fortran")) {
      const m = LISTING_LINE.exec(line);
      if (!m) continue;
      const seq = Number(m[1]);
      let prev = last.get(keyOf(routines[i]));
      if (prev !== undefined && seq < prev && i < routines.length - 1) {
        i++;
        prev = last.get(keyOf(routines[i]));
      }
      const routine = routines[i];
      if (prev !== undefined) {
        if (seq < prev) error(p.file, `${routine}: sequence ${pad4(seq)} decreases after ${pad4(prev)}`);
        else if (seq > prev + 1) warn(p.file, `${routine}: gap from ${pad4(prev)} to ${pad4(seq)}`);
      }
      last.set(keyOf(routine), Math.max(seq, prev ?? seq));
    }
  }
}

const pad4 = (n: number) => String(n).padStart(4, "0");

function fencedLines(body: string, lang: string): string[] {
  const out: string[] = [];
  let inside = false;
  for (const line of body.split(/\r?\n/)) {
    if (!inside && line.trim() === "```" + lang) inside = true;
    else if (inside && line.trim() === "```") inside = false;
    else if (inside) out.push(line);
  }
  return out;
}

function compressRanges(ns: number[]): string {
  const parts: string[] = [];
  for (let i = 0; i < ns.length; i++) {
    let j = i;
    while (j + 1 < ns.length && ns[j + 1] === ns[j] + 1) j++;
    parts.push(i === j ? pad3(ns[i]) : `${pad3(ns[i])}-${pad3(ns[j])}`);
    i = j;
  }
  return parts.join(", ");
}

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(abs));
    else out.push(abs);
  }
  return out;
}

export function parseDenylist(raw: string | undefined): string[] {
  return (raw ?? "").split(",").map((s) => s.trim()).filter(Boolean);
}

export interface RunResult {
  code: number;
  lines: string[];
}

export function run(args: string[], env: Record<string, string | undefined>): RunResult {
  const strict = args.includes("--strict");
  const rootArg = args.indexOf("--root");
  const root =
    rootArg >= 0 ? path.resolve(args[rootArg + 1]) : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../content");
  const gapsArg = args.indexOf("--known-gaps");
  const gapsPath = gapsArg >= 0 ? path.resolve(args[gapsArg + 1]) : path.join(root, "reports", "known-gaps.json");
  const denylist = parseDenylist(env.NAME_DENYLIST);
  const { issues, known } = applyKnownGaps(validateContent(root, { denylist }), loadKnownGaps(gapsPath));
  const errors = issues.filter((i) => i.level === "error");
  const warnings = issues.filter((i) => i.level === "warning");
  const lines = issues.map((i) => `${i.level === "error" || strict ? "ERROR" : "warn "} ${i.file}: ${i.message}`);
  for (const k of known) lines.push(`known ${k.file}: ${k.message} (${k.reason})`);
  lines.push(
    `\n${errors.length} error(s), ${warnings.length} warning(s), ${known.length} known gap(s)${strict ? " (strict: warnings are errors)" : ""}; name denylist ${denylist.length > 0 ? `checked (${denylist.length})` : "skipped (NAME_DENYLIST unset)"}`,
  );
  return { code: errors.length > 0 || (strict && warnings.length > 0) ? 1 : 0, lines };
}

function main() {
  const { code, lines } = run(process.argv.slice(2), process.env);
  for (const l of lines) console.log(l);
  if (code !== 0) process.exit(code);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main();
