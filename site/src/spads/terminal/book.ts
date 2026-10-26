import { fieldLoop, search } from "./retrieve";
import { answer, intOf, isYes, type Session, type Steps } from "./session";
import { TEXT } from "./screens";
import { spool } from "./spool";
import type { StoredSpadsRecord } from "./types";

// BOOK PART (PDF 52 to 54): an Entire Record book or a sorted Brief Listing,
// both spooled to a printer.

const SORTS: Record<number, { name: string; key: (r: StoredSpadsRecord) => string }> = {
  1: { name: "SYSTEM NUMBER", key: (r) => r.sysnum.padStart(6, "0") },
  2: { name: "SUB-TASK", key: (r) => `${r.task}${r.taskas.padStart(3)}${r.tasksb.padStart(2)}` },
  3: { name: "WACODE", key: (r) => r.wacode },
};

const addCriterion = (s: Session, field: number, value: string) => {
  s.ctx.criteria = [...(s.ctx.criteria ?? []), { field, value }];
};

/** Brief listing lines for the hint after spooling: task, subtask, WA, system number, title. */
function briefLines(records: StoredSpadsRecord[]): string[] {
  return records.map(
    (r) => `${r.task.padEnd(2)}${`${r.taskas}.${r.tasksb}`.padStart(7)}  ${`${r.wan} ${r.wacode}`.padEnd(10)}${r.sysnum.padStart(5)}  ${r.title}`,
  );
}

export const bookSteps: Steps = {
  "book.type": {
    enter: (s) => {
      s.ctx.criteria = [];
      s.print("");
      s.show("bookPartialType");
      s.print("");
      s.print(TEXT.enterOption);
    },
    input: (s, text) => {
      const n = intOf(text);
      if (answer(text) === "") return s.go("analysis");
      if (n === 1) return s.go("booke.list");
      if (n === 2) {
        s.print("");
        s.show("bookBriefFields");
        return s.go("bookb.list");
      }
      s.go("book.type");
    },
  },
  ...fieldLoop("booke", {
    list: "bookFields",
    max: 28,
    accept: addCriterion,
    done: (s) => {
      const found = search(s, s.ctx.criteria ?? []);
      s.print("");
      for (const r of found) s.print(TEXT.bookRecordNo(r.sysnum));
      s.print("");
      s.print(TEXT.bookItems(found.length));
      s.print("");
      if (!found.length) return s.go("analysis");
      spool(s, {
        style: "record",
        then: "analysis",
        sampleNote: "Each record in the book prints in the Entire Record format, Appendix C-1 (CR-177949, PDF 121), in the Archive.",
      });
    },
  }),
  ...fieldLoop("bookb", {
    list: "retrieveFields",
    max: 26,
    accept: addCriterion,
    done: (s) => {
      const found = search(s, s.ctx.criteria ?? []);
      s.print("");
      s.print(TEXT.bookBeginning);
      s.print("");
      s.print(TEXT.bookFound(found.length));
      s.ctx.results = found.map((r) => r.sysnum);
      if (!found.length) return s.go("analysis");
      s.go("book.sort");
    },
  }),
  "book.sort": {
    enter: (s) => {
      s.print("");
      s.show("bookSortedListing");
    },
    input: (s, text) => {
      const n = intOf(text);
      if (n === null || !SORTS[n]) return s.go("book.sort");
      s.ctx.scratch = { ...s.ctx.scratch, bookSort: n };
      s.go("book.engineer");
    },
  },
  "book.engineer": {
    enter: (s) => s.show("bookSortByEngineer"),
    input: (s, text) => {
      const sort = SORTS[Number(s.ctx.scratch?.bookSort ?? 1)];
      const byEngineer = isYes(text);
      s.print(TEXT.bookSortBegin(sort.name));
      s.print(TEXT.bookSorted(sort.name));
      if (byEngineer) {
        s.print(TEXT.bookEngineerBegin);
        s.print(TEXT.bookEngineerSorted);
      }
      s.print(TEXT.allDone);
      const records = (s.ctx.results ?? []).map((n) => s.store.get(n)).filter((r): r is StoredSpadsRecord => !!r);
      records.sort((a, b) => (byEngineer ? a.nr.localeCompare(b.nr) : 0) || sort.key(a).localeCompare(sort.key(b)));
      s.hint("The brief listing, sorted as asked, from this session's data base (the printed format is Appendix A-1, CR-177949):");
      for (const line of briefLines(records)) s.hint(line);
      spool(s, { style: "record", then: "analysis" });
    },
  },
};
