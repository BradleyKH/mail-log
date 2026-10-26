import type { z } from "zod";
import type {
  APPENDICES,
  codeIndexSchema,
  flagsSchema,
  routineCallSchema,
  routineEntrySchema,
  routineLinesSchema,
  xrefSchema,
  DOC_IDS,
  PAGE_KINDS,
  RECORDS,
  docMetaSchema,
  fieldSchema,
  figureSchema,
  flowSchema,
  flowchartsSchema,
  glossaryEntrySchema,
  knownGapSchema,
  pageFrontmatterSchema,
  routineDescriptionSchema,
  sampleRecordSchema,
  sectionSchema,
  stepSchema,
  spadsFieldSchema,
  spadsJobOrderSchema,
  spadsMonthSchema,
  spadsRecordSchema,
  spadsReportSchema,
  spadsTablesSchema,
} from "./schema";

export type DocId = (typeof DOC_IDS)[number];
export type RecordType = (typeof RECORDS)[number];
export type PageKind = (typeof PAGE_KINDS)[number];

export type KnownGap = z.infer<typeof knownGapSchema>;
export type DocMeta = z.infer<typeof docMetaSchema>;
export type PageFrontmatter = z.infer<typeof pageFrontmatterSchema>;
export type Page = PageFrontmatter & { docId: DocId; body: string };
export type Section = z.infer<typeof sectionSchema>;
export type Figure = z.infer<typeof figureSchema>;
export type GlossaryEntry = z.infer<typeof glossaryEntrySchema>;
export type Flowchart = z.infer<typeof flowchartsSchema>[number];
export type Step = z.infer<typeof stepSchema>;
export type Flow = z.infer<typeof flowSchema>;
export type Field = z.infer<typeof fieldSchema>;
export type SampleRecord = z.infer<typeof sampleRecordSchema>;
export type RoutineDescription = z.infer<typeof routineDescriptionSchema>;
export type Appendix = (typeof APPENDICES)[number];
export type CodeIndex = z.infer<typeof codeIndexSchema>;
export type RoutineEntry = z.infer<typeof routineEntrySchema>;
export type RoutineCall = z.infer<typeof routineCallSchema>;
export type RoutineLines = z.infer<typeof routineLinesSchema>;
export type Xref = z.infer<typeof xrefSchema>;
export type Flags = z.infer<typeof flagsSchema>;
export type SpadsField = z.infer<typeof spadsFieldSchema>;
export type SpadsJobOrder = z.infer<typeof spadsJobOrderSchema>;
export type SpadsMonth = z.infer<typeof spadsMonthSchema>;
export type SpadsRecord = z.infer<typeof spadsRecordSchema>;
export type SpadsTables = z.infer<typeof spadsTablesSchema>;
export type SpadsReport = z.infer<typeof spadsReportSchema>;
