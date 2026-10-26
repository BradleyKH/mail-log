import { z } from "zod";
import { parse as parseYaml } from "yaml";

/** The seven reports that may ship in the site. Anything else under content/docs/ fails the build. */
export const DOC_IDS = ["cr-159065", "cr-159063", "cr-159064", "cr-159066", "cr-177948", "cr-177949", "cr-177950"] as const;
export const docIdSchema = z.enum(DOC_IDS);

export const RECORDS = ["correspondence", "dir", "drawing-eo"] as const;
export const recordSchema = z.enum(RECORDS);

const pdfPage = z.number().int().positive();

/** Figure ids are the printed ids ("27", "5.4.1-17", "6.3.2"), so they stay strings. */
const figureId = z.string().min(1);

export const knownGapSchema = z.strictObject({
  file: z.string().min(1),
  messagePrefix: z.string().min(1),
  reason: z.string().min(1),
});
export const knownGapsSchema = z.array(knownGapSchema);

export const docMetaSchema = z.strictObject({
  docId: docIdSchema,
  reportNumber: z.string().min(1),
  title: z.string().min(1),
  date: z.enum(["1979-05", "1985-07"]),
  ntrsId: z.string().regex(/^\d{11}$/),
  pdfPath: z.string().endsWith(".pdf"),
  stem: z.string().min(1),
  pageCount: z.number().int().positive(),
});

export const PAGE_KINDS = ["text", "figure", "mixed", "blank", "cover", "flowchart", "listing"] as const;

export const pageFrontmatterSchema = z.strictObject({
  pdfPage,
  folio: z.string().nullable(),
  sectionId: z.string().nullable(),
  kind: z.enum(PAGE_KINDS),
  /** "ai" is a vision-model transcription, checked arithmetically against the printout's own totals. */
  source: z.enum(["ocr", "reviewed", "ai"]),
  confidence: z.number().min(0).max(100),
  figures: z.array(figureId),
  listing: z
    .strictObject({
      appendix: z.string().min(1),
      routines: z.array(z.string().min(1)),
      listingPage: z.number().int().positive().nullable(),
    })
    .optional(),
});

export const sectionSchema = z.strictObject({
  id: z.string().min(1),
  title: z.string().min(1),
  level: z.number().int().min(1),
  pdfPage,
});
export const sectionsSchema = z.array(sectionSchema);

export const figureSchema = z.strictObject({
  number: figureId,
  title: z.string().min(1),
  pdfPage,
  sectionId: z.string().nullable(),
});
export const figuresSchema = z.array(figureSchema);

export const glossaryEntrySchema = z.strictObject({
  term: z.string().min(1),
  definition: z.string().min(1),
  pdfPage,
});
export const glossarySchema = z.array(glossaryEntrySchema);

export const flowchartsSchema = z.array(
  z.strictObject({
    routine: z.string().min(1),
    figure: figureId,
    caption: z.string(),
    pdfPages: z.array(pdfPage).min(1),
  }),
);

const gotoTarget = z.union([z.number().int().nonnegative(), z.literal("exit")]);

export const stepSchema = z.strictObject({
  n: z.number().int().nonnegative(),
  mode: z.enum(["input", "revise", "search", "archive", "menu", "common"]),
  title: z.string().optional(),
  prompt: z.array(z.string()),
  input: z
    .strictObject({
      pattern: z.string().min(1),
      description: z.string(),
      maxLength: z.number().int().positive().optional(),
    })
    .optional(),
  response: z.string().optional(),
  branches: z.array(z.strictObject({ when: z.string().min(1), goto: gotoTarget })),
  next: gotoTarget.optional(),
  figures: z.array(figureId),
  pdfPage,
});

export const flowSchema = z.strictObject({
  record: recordSchema,
  title: z.string().min(1),
  entryStep: z.number().int().nonnegative(),
  steps: z.array(stepSchema).min(1),
});

export const fieldSchema = z.strictObject({
  name: z.string().min(1),
  label: z.string().min(1),
  length: z.number().int().positive().optional(),
  searchable: z.boolean(),
  description: z.string(),
  pdfPage,
});
export const fieldsSchema = z.array(fieldSchema);

export const sampleRecordSchema = z
  .object({ sourceFigure: figureId })
  .catchall(z.union([z.string(), z.number(), z.null()]));
export const sampleRecordsSchema = z.array(sampleRecordSchema);

export const routineDescriptionSchema = z.strictObject({
  routine: z.string().min(1),
  record: z.enum([...RECORDS, "general", "external", "support"]),
  sectionId: z.string().min(1),
  description: z.string().min(1),
  pdfPage,
});
export const routineDescriptionsSchema = z.array(routineDescriptionSchema);

export const APPENDICES = ["B", "C", "D", "E", "F"] as const;

/**
 * A listing line id: the printed sequence number plus a 1-based ordinal among the routine's
 * lines with that number (`$INSERT` repeats numbers), or `uN` where the appendix prints none.
 */
const lineId = z.string().regex(/^(\d{4}\.\d+|u\d+)$/);

export const routineCallSchema = z.strictObject({
  name: z.string().min(1),
  target: z.string().min(1).nullable(),
  kind: z.enum(["routine", "external", "unresolved"]),
  lines: z.array(lineId).min(1),
});

export const routineFileSchema = z.strictObject({
  unit: z.string().min(1),
  kind: z.enum(["unit", "file"]),
  mode: z.string().min(1),
  purpose: z.string().nullable(),
});

export const routineEntrySchema = z.strictObject({
  id: z.string().min(1),
  name: z.string().min(1),
  appendix: z.enum(APPENDICES),
  record: z.enum([...RECORDS, "general", "external", "support"]),
  kind: z.enum(["main", "subroutine", "function", "program"]),
  sectionId: z.string().nullable(),
  lines: z.number().int().nonnegative(),
  commentLines: z.number().int().nonnegative(),
  firstSeq: z.number().int().nonnegative().nullable(),
  lastSeq: z.number().int().nonnegative().nullable(),
  listingPages: z.array(pdfPage),
  symbolTablePages: z.array(pdfPage),
  flowchartFigure: figureId.nullable(),
  flowchartPages: z.array(pdfPage),
  description: z.string().nullable(),
  descriptionPage: pdfPage.nullable(),
  calls: z.array(routineCallSchema),
  calledBy: z.array(z.string().min(1)),
  commons: z.array(z.string().min(1)),
  files: z.array(routineFileSchema),
  prompts: z.array(z.strictObject({ line: lineId, text: z.string().min(1) })),
  reviewed: z.boolean(),
});

const codeTotalsSchema = z.strictObject({
  routines: z.number().int().nonnegative(),
  lines: z.number().int().nonnegative(),
  commentLines: z.number().int().nonnegative(),
});

export const codeIndexSchema = z.strictObject({
  totals: codeTotalsSchema.extend({ byAppendix: z.record(z.enum(APPENDICES), codeTotalsSchema) }),
  externals: z.array(
    z.strictObject({
      name: z.string().min(1),
      group: z.enum(["system", "miscellaneous"]),
      sectionId: z.string().min(1),
      pdfPage,
    }),
  ),
  unresolvedCalls: z.array(z.strictObject({ routine: z.string().min(1), name: z.string().min(1), lines: z.array(lineId).min(1) })),
  routines: z.array(routineEntrySchema),
});

/** Maps each line of `routines/<id>.f` (1-based, in order) to its line id and listing page. */
export const routineLinesSchema = z.strictObject({
  routine: z.string().min(1),
  lineIds: z.array(lineId),
  pages: z.array(z.strictObject({ pdfPage, firstLine: z.number().int().positive(), lastLine: z.number().int().positive() })),
});

const stepRef = z.strictObject({ record: recordSchema, step: z.number().int().nonnegative() });
export const xrefSchema = z.strictObject({
  threshold: z.number().min(0).max(1),
  stepToRoutines: z.array(
    stepRef.extend({
      matches: z.array(z.strictObject({ routine: z.string().min(1), score: z.number().min(0).max(1), line: lineId, promptLine: z.number().int().nonnegative() })).min(1),
    }),
  ),
  routineToSteps: z.array(
    z.strictObject({ routine: z.string().min(1), steps: z.array(stepRef.extend({ score: z.number().min(0).max(1) })).min(1) }),
  ),
  unmatchedSteps: z.array(stepRef),
  unmatchedRoutines: z.array(z.string().min(1)),
});

export const flagsSchema = z.strictObject({
  thresholds: z.record(z.string(), z.number()),
  counts: z.record(docIdSchema, z.number().int().nonnegative()),
  docs: z.record(
    docIdSchema,
    z.array(z.strictObject({ pdfPage, kind: z.enum(PAGE_KINDS), confidence: z.number(), reasons: z.array(z.string()) })),
  ),
  flowchartMisses: z.array(z.strictObject({ pdfPage, reason: z.string() })),
  flowchartNotes: z.array(z.string()),
});

/** Header and job-order field definitions from the SPADS manuals; `partial` marks a definition the printed page only gives in part. */
export const spadsFieldSchema = z.strictObject({
  n: z.number().int().positive(),
  name: z.string().min(1),
  label: z.string().min(1),
  description: z.string(),
  pdfPage,
  partial: z.boolean().optional(),
});
export const spadsFieldsSchema = z.array(spadsFieldSchema);

export const spadsJobOrderSchema = z.strictObject({
  jo: z.string().min(1),
  sub: z.string(),
  progno: z.string(),
  all: z.number(),
  /** Percent of the job order charged in each fiscal year, up to eight. */
  fy: z.array(z.number()).max(8),
});

export const spadsMonthSchema = z.strictObject({
  /** Month and two-digit year as printed, e.g. "JUL85". */
  month: z.string().regex(/^[A-Z]{3}\d{2}$/),
  cmaa: z.string(),
  eacHours: z.number(),
  eacDollars: z.number(),
  actHours: z.number(),
  actDollars: z.number(),
  compHours: z.number(),
  compDollars: z.number(),
});

export const spadsRecordSchema = z.strictObject({
  sysnum: z.string().min(1),
  date: z.string(),
  /** Empty where a book listing does not print it. */
  status: z.enum(["AUT", "FUT", ""]),
  title: z.string(),
  mods: z.array(z.string()),
  contractor: z.string(),
  remarks: z.string(),
  nr: z.string(),
  cr: z.string(),
  rbk: z.string(),
  pr: z.string(),
  contract: z.string(),
  task: z.string(),
  taskas: z.string(),
  tasksb: z.string(),
  wan: z.string(),
  wacode: z.string(),
  complete: z.boolean(),
  rtHours: z.number(),
  rtDollars: z.number(),
  totHours: z.number(),
  totDollars: z.number(),
  fee: z.number(),
  /** Empty where a book listing does not print it. */
  table: z.enum(["SUST", "MANL", ""]),
  jobOrders: z.array(spadsJobOrderSchema),
  months: z.array(spadsMonthSchema),
  sourcePages: z.array(pdfPage),
});
export const spadsRecordsSchema = z.array(spadsRecordSchema);

export const spadsTablesSchema = z.strictObject({
  /** `fee` is null where the printout masks it; `masked` then keeps the printed text, such as "**.060". */
  fee: z.array(
    z.strictObject({
      contract: z.string(),
      task: z.string(),
      subtask: z.string(),
      fee: z.number().nullable(),
      masked: z.string().optional(),
      pdfPage,
    }),
  ),
  rates: z.array(
    z.strictObject({ task: z.string(), fy: z.string(), hourRate: z.number(), dollarRate: z.number(), illustrative: z.boolean() }),
  ),
  sustaining: z.array(z.strictObject({ task: z.string(), jo: z.string(), subtask: z.string(), fy: z.record(z.string(), z.number()) })),
  programNumbers: z.array(z.strictObject({ jo: z.string(), progno: z.string() })),
  time: z.array(z.strictObject({ task: z.string(), start: z.string(), end: z.string(), contractValue: z.number(), baseFee: z.number() })),
});

/** A sample report from the manuals' appendices, with the checks run against its printout. */
export const spadsReportSchema = z.strictObject({
  id: z.string().min(1),
  title: z.string().min(1),
  pdfPages: z.array(pdfPage).min(1),
  options: z.array(z.string()),
  printout: z.string(),
  verified: z.array(z.strictObject({ what: z.string(), result: z.string() })),
});
export const spadsReportsSchema = z.array(spadsReportSchema);

/** Menu screens keyed by menu name; each value is a line of text or a list of lines. */
export const spadsMenusSchema = z.record(z.string(), z.union([z.string(), z.array(z.string())]));

const FRONTMATTER =/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

/** Splits a page file into validated frontmatter and Markdown body. Throws on invalid frontmatter. */
export function parsePageFile(raw: string): { frontmatter: z.infer<typeof pageFrontmatterSchema>; body: string } {
  const m = FRONTMATTER.exec(raw);
  if (!m) throw new Error("missing frontmatter block");
  return { frontmatter: pageFrontmatterSchema.parse(parseYaml(m[1])), body: raw.slice(m[0].length) };
}
