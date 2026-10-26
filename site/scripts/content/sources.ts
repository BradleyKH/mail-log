import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { buildKnownRoutines, candidateNames } from "./routines.ts";
import { parseTsv, type Word } from "./tsv.ts";

export const pad3 = (n: number) => String(n).padStart(3, "0");

/** Reads the OCR outputs under build/<stem>/ for one report. Missing files read as empty. */
export class OcrSource {
  constructor(
    readonly buildDir: string,
    readonly stem: string,
  ) {}

  private file(sub: string, n: number, ext: string): string {
    return path.join(this.buildDir, this.stem, sub, `page-${pad3(n)}.${ext}`);
  }

  text(n: number, variant: "" | "-psm6" = ""): string {
    const f = this.file(`text${variant}`, n, "txt");
    return existsSync(f) ? readFileSync(f, "utf8").replace(/\r\n/g, "\n") : "";
  }

  words(n: number, variant: "" | "-psm6" = ""): Word[] {
    const f = this.file(`tsv${variant}`, n, "tsv");
    return existsSync(f) ? parseTsv(readFileSync(f, "utf8")) : [];
  }
}

export const VOL1_STEM = "CR-159063-mail-log-program-theory-vol1";
export const VOL2_STEM = "CR-159064-mail-log-program-theory-vol2";

/** External routine names from the Vol. I section 8.0 table, where `$` survives as `$` or `S`. */
function externalNames(text: string): string[] {
  const out: string[] = [];
  for (const line of text.split("\n")) {
    const m = /^[\s\-\u2014~.]*([A-Z][A-Z0-9$]{1,6})[\s.~|]/.exec(line + " ");
    if (m && /X/.test(line.slice(m[0].length))) out.push(m[1].replace(/[.]$/, ""));
  }
  return out;
}

/**
 * The known routine list, agreed between the Vol. I and Vol. II tables of contents, the Vol. I
 * section 4 and 8 headings, and the external-calls table.
 */
export function loadKnownRoutines(buildDir: string): string[] {
  const v1 = new OcrSource(buildDir, VOL1_STEM);
  const v2 = new OcrSource(buildDir, VOL2_STEM);
  const join = (src: OcrSource, from: number, to: number, variant: "" | "-psm6" = "") => {
    const parts: string[] = [];
    for (let n = from; n <= to; n++) parts.push(src.text(n, variant));
    return parts.join("\n");
  };
  const v1Toc = candidateNames(join(v1, 5, 8));
  const v2Toc = [...candidateNames(join(v2, 5, 9)), ...candidateNames(join(v2, 5, 9, "-psm6"))];
  const v1Headings = candidateNames(join(v1, 25, 51) + "\n" + join(v1, 546, 552)).concat(
    candidateNames(join(v1, 546, 552).replace(/^(\s*[0-9.]+)\s+[~\-_]+\s*/gm, "$1 ")),
  );
  const externals = externalNames(join(v1, 546, 547)).map((n) => n.replace(/SS$/, "$$$$"));
  return buildKnownRoutines([v1Toc, v2Toc, v1Headings], ["MAIN", ...externals]);
}
