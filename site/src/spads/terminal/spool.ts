import { answer, intOf, type Session, type Steps } from "./session";
import { TEXT } from "./screens";
import type { SpoolCtx } from "./types";

// Three printed spooling dialogs: the record and report spool (PDF 48, 53),
// the system spool menu (PDF 25 to 27, 93, 113), and the report generator's
// dashed prompts (PDF 63, 64, 66).

export type SpoolRequest = Omit<SpoolCtx, "site" | "allSites"> & { allSites?: boolean };

/** Runs a spooling dialog, then enters `then`. */
export function spool(s: Session, request: SpoolRequest): void {
  s.ctx.spool = { allSites: false, ...request };
  s.go("spool.site");
}

function siteLines(s: Session, c: SpoolCtx): string[] {
  if (c.style === "basic") return s.menu("spoolMain");
  if (c.style === "dash") return [...s.menu("reportSpoolSite"), s.menu("reportEnterOption")[0]];
  return s.menu(c.allSites ? "spoolSiteAll" : "spoolSite");
}

function printerLines(s: Session, c: SpoolCtx): string[] {
  const site = c.site ?? 1;
  if (c.style === "dash") {
    const key = site === 1 ? "reportSpoolScout" : site === 2 ? "reportSpoolDallas" : "";
    const lines = key ? s.menu(key) : s.menu("spoolDirectorate").slice(1, -2);
    return [...lines, s.menu("reportEnterOption")[0]];
  }
  if (c.style === "basic") return s.menu(site === 1 ? "spoolScout" : site === 2 ? "spoolDallas" : "spoolDirectorate");
  return s.menu(site === 1 ? "spoolRecordScout" : site === 2 ? "spoolDallas" : "spoolDirectorate");
}

const printerCount = (c: SpoolCtx) => {
  const site = c.site ?? 1;
  if (site === 3) return 5;
  if (site === 2) return 3;
  return c.style === "record" ? 3 : 4;
};

function copiesLines(s: Session, c: SpoolCtx): string[] {
  if (c.style === "basic") return s.menu("spoolCopies");
  if (c.style === "dash") return s.menu("reportCopies");
  return s.menu("spoolRecordCopies");
}

function finish(s: Session, spooled: boolean): void {
  const c = s.ctx.spool;
  if (!c) return;
  s.ctx.spool = undefined;
  s.ctx.scratch = { ...s.ctx.scratch, spooled };
  if (!spooled) {
    s.print(c.style === "basic" ? s.menu("spoolNoOutput")[0] : s.menu("spoolNoOutputPrinter")[0]);
  } else if (c.style === "dash" && c.computeMode === 2) {
    s.print(s.menu("reportPhantomSubmitted")[0]);
  } else if (c.style === "dash" && c.computeMode === 3) {
    s.show("reportBatchSubmitted");
  } else {
    s.print(TEXT.outputSpooled);
  }
  offerSample(s, c, spooled);
  s.go(c.then);
}

/** After a spool, points at (or prints) the manual's transcribed printout of the same report. */
function offerSample(s: Session, c: SpoolCtx, spooled: boolean): void {
  if (c.sample) {
    const report = s.data.reports.find((r) => r.id === c.sample);
    if (!report) return;
    const pages = report.pdfPages.join(" and ");
    if (!spooled) {
      s.hint(`Spool it to see the printout: the manual reproduces this report as Appendix ${report.id} (PDF ${pages}).`);
      return;
    }
    s.hint(
      `What the printer produced is not computed here. This is the manual's transcribed sample printout, Appendix ${report.id}, ${report.title} (PDF ${pages}):`,
    );
    s.lines(report.printout.split("\n"));
  } else if (c.sampleNote) {
    s.hint(c.sampleNote);
  }
}

export const spoolSteps: Steps = {
  "spool.site": {
    enter: (s) => {
      const c = s.ctx.spool;
      if (c) s.lines(siteLines(s, c));
    },
    input: (s, text) => {
      const c = s.ctx.spool;
      if (!c) return;
      const a = answer(text);
      if (c.style === "dash" && a === "QUIT") {
        s.print("EXIT.");
        s.ctx.spool = undefined;
        s.go(c.then);
        return;
      }
      const n = a === "" ? 0 : intOf(a);
      const max = c.style === "record" && !c.allSites ? 2 : 3;
      if (n === 0 && c.style !== "dash") return finish(s, false);
      if (n === null || n < 1 || n > max) return s.go("spool.site");
      c.site = n;
      s.go("spool.printer");
    },
  },
  "spool.printer": {
    enter: (s) => {
      const c = s.ctx.spool;
      if (c) s.lines(printerLines(s, c));
    },
    input: (s, text) => {
      const c = s.ctx.spool;
      if (!c) return;
      const n = answer(text) === "" ? 0 : intOf(text);
      if (n === 0) return s.go("spool.site");
      if (n === null || n < 1 || n > printerCount(c)) return s.go("spool.printer");
      s.go("spool.copies");
    },
  },
  "spool.copies": {
    enter: (s) => {
      const c = s.ctx.spool;
      if (c) s.lines(copiesLines(s, c));
    },
    input: (s, text) => {
      const n = answer(text) === "" ? 0 : intOf(text);
      if (n === null || n < 0 || n > 5) return s.go("spool.copies");
      finish(s, n > 0);
    },
  },
};
