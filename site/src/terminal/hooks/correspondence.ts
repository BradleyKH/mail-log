import { mmddyyToRecordDate, ordinal, parseMmddyy, parseRecordDate } from "../dates";
import { ITEM_STEPS } from "../fieldSteps";
import { correspondenceEntry, correspondenceHeader } from "../format";
import type { Hook, HookCtx, HookTable } from "../hook";
import { MENU_KEYS, menuKey } from "../menuKeys";
import { dateMatch, entryMatch, inDateRange, prefixMatch, printListing, valueTokens, wordMatch } from "../search";
import type { StoredRecord } from "../types";
import { beginEdit, candidates, commit, countStep, itemStep, recordLines, setCandidates, showAndGo, subfileLoop } from "./shared";

const MAIL_STATUS = ["VC", "IM", "OM"];
const NO_DATE_RANGE = new Set(["DOC", "IDD", "ADD", "ALL"]);

const mailStatusError = (aa: string) => `ERROR IN MAIL STATUS ${aa} NOT ALLOWABLE. TRY AGAIN.`;

/** Records whose input date and daily counter make up the typed `MMDDYYNNNN` code. */
function byDateCode(records: StoredRecord[], code: string): StoredRecord[] {
  const want = parseMmddyy(code.slice(0, 6));
  const counter = Number(code.slice(6));
  return records.filter((r) => {
    const d = parseRecordDate(r.values.inputDate);
    return d && want && ordinal(d) === ordinal(want) && Number(r.values.dailyCounter ?? -1) === counter;
  });
}

/** The W.A./contract table, as far as the sample records show it: W.A. number to contract. */
export function contractFor(records: StoredRecord[], wa: string): string | undefined {
  const base = wa.slice(0, 4);
  return records.find((r) => r.values.contractNumber && (r.values.waNumberIdCode ?? "").slice(0, 4) === base)?.values.contractNumber;
}

const listing = (c: HookCtx, title: string, matches: StoredRecord[], tokens: Record<string, string>) =>
  printListing(c, matches, { header: correspondenceHeader(title), entry: correspondenceEntry, tokens });

/** A search's result step: filters on what was typed at the step before and prints the manual's closing message. */
function resultStep(match: (value: string) => (r: StoredRecord) => boolean): Hook {
  return {
    enter(c) {
      const key = c.state.vars.key ?? "";
      const value = c.state.vars.lastInput ?? "";
      const pool = NO_DATE_RANGE.has(key) ? c.records() : inDateRange(c, c.records());
      const title = `${MENU_KEYS.correspondence[key]?.label ?? "SEARCH"}:  ${value}`;
      listing(c, title, pool.filter(match(value)), valueTokens(value));
      return undefined;
    },
  };
}

function showRecord(c: HookCtx, values: Record<string, string>) {
  c.print("", ...recordLines(c, values), "");
}

/** Subject words narrow the found set one word at a time (Steps #39 to #43). */
const subjectWord: Hook = {
  submit(c, input) {
    if (input === "QUIT") return 345;
    const pool = c.state.vars.count === 0 ? inDateRange(c, c.records()) : c.state.results;
    c.state.vars.count = (c.state.vars.count ?? 0) + 1;
    c.state.results = pool.filter(wordMatch("subject", input));
    return 341;
  },
};

export const correspondenceHooks: HookTable = {
  102: {
    submit(c, input) {
      c.state.vars.option = input;
      if (input === "LAST") c.hint("The last output is spooled to the printer again.");
      return undefined;
    },
  },
  104: {
    submit(c, input) {
      c.state.vars.today = input;
      return undefined;
    },
  },
  105: {
    enter(c) {
      if (c.state.vars.option === "DATA") return 131;
      c.state.vars.editingId = undefined;
      c.state.fields = { inputDate: mmddyyToRecordDate(c.today()) };
      return 106;
    },
  },
  107: {
    enter(c) {
      const status = c.state.fields.mailStatus ?? "";
      if (MAIL_STATUS.includes(status)) return 108;
      c.print(mailStatusError(status));
      return 106;
    },
  },
  114: {
    enter(c) {
      c.print(...c.step.prompt.map((l) => l.replace("!MMDDYY!", `!${c.today()}!`)));
      const back = c.state.vars.itemReturn;
      c.state.vars.itemReturn = undefined;
      return back ?? 115;
    },
  },
  115: {
    submit(c, input) {
      const contract = contractFor(c.env.store.list("correspondence"), input) ?? contractFor(c.env.store.list("dir"), input);
      if (!contract) return 116;
      c.state.fields.contractNumber = contract;
      c.print(`CONTRACT NUMBER ${contract}`);
      return 118;
    },
  },
  123: {
    enter(c) {
      showRecord(c, c.state.fields);
      c.printPrompt();
      return "wait";
    },
  },
  124: countStep(),
  125: itemStep(ITEM_STEPS.correspondence, 125, 123),
  126: {
    submit(c, input) {
      c.state.vars.subfile = Number(input);
      return undefined;
    },
  },
  127: {
    enter(c) {
      const values = { ...c.state.fields };
      if (!c.state.vars.editingId) {
        const sameDay = c.records().filter((r) => r.values.inputDate === values.inputDate).length;
        values.dailyCounter = String(sameDay + 1);
      }
      const saved = commit(c, values);
      if (saved) {
        c.state.vars.editingId = saved.id;
        c.state.fields = { ...saved.values };
        const code = `${c.today()}${String(saved.values.dailyCounter ?? "").padStart(4, "0")}`;
        c.hint(`Stored for this session. Its input date-code for Revise and Archive is ${code}.`);
      }
      if (!c.state.fields.referencedDocuments || c.state.fields.referencedDocuments === "NONE") return 130;
      c.printPrompt();
      return 128;
    },
  },
  128: {
    enter: (c) => (/\bDELAY(ED)?\b/.test(c.state.fields.subject ?? "") ? 129 : 130),
  },
  129: {
    submit(c, input) {
      c.state.fields.actionDueDate = mmddyyToRecordDate(input);
      commit(c);
      return undefined;
    },
  },
  130: {
    submit(c, input) {
      if (input.startsWith("Y")) c.state.vars.option = "NEW";
      return undefined;
    },
  },
  201: {
    submit(c, input) {
      setCandidates(c, byDateCode(c.records(), input));
      return undefined;
    },
  },
  202: {
    submit(c, input) {
      c.state.vars.flag = input.startsWith("Y") ? "ACTION_DUE" : undefined;
      return undefined;
    },
  },
  203: countStep(),
  204: subfileLoop(204, 205),
  205: {
    enter(c) {
      const [first] = candidates(c);
      if (!first) {
        c.hint("No record has that input date-code.");
        return 4;
      }
      showRecord(c, first.values);
      c.printPrompt();
      return "wait";
    },
    submit(c, input) {
      const [first, ...rest] = candidates(c);
      if (!first) return 4;
      if (input.startsWith("Y")) {
        beginEdit(c, first);
        return 206;
      }
      setCandidates(c, rest);
      return rest.length > 0 ? 205 : 4;
    },
  },
  206: {
    submit(c, input) {
      if (input !== "DEL") return undefined;
      c.env.store.remove("correspondence", c.state.vars.editingId!);
      c.state.vars.editingId = undefined;
      return 4;
    },
  },
  207: { enter: (c) => (c.state.vars.flag === "ACTION_DUE" ? 211 : 208) },
  208: countStep(),
  209: itemStep(ITEM_STEPS.correspondence, 209, 210),
  210: {
    enter(c) {
      showRecord(c, c.state.fields);
      c.print("CHECK RECORD FOR ERRORS: IF CORRECT, ENTER COR", "                        IF REVISION NEEDED, ENTER REV");
      return "wait";
    },
    submit(c, input) {
      if (input === "COR") commit(c);
      return undefined;
    },
  },
  ...Object.fromEntries([212, 213, 214, 215, 216].map((n) => [n, { submit: (c: HookCtx) => (commit(c), undefined) } satisfies Hook])),
  301: {
    validate: (c, input) => ({ ok: menuKey(c.state.record, input) !== undefined }),
    submit(c, input) {
      c.state.vars = { ...c.state.vars, key: input, firstDate: undefined, lastDate: undefined, count: 0, subfile: undefined };
      return undefined;
    },
  },
  302: { enter: (c) => (c.state.vars.key === "QUIT" ? 350 : 303) },
  303: {
    submit(c, input) {
      c.state.vars.today = input;
      return NO_DATE_RANGE.has(c.state.vars.key ?? "") ? 307 : 304;
    },
  },
  304: {
    submit(c, input) {
      c.state.vars.firstDate = input;
      return undefined;
    },
  },
  305: {
    submit(c, input) {
      c.state.vars.lastDate = input;
      return undefined;
    },
  },
  306: {
    enter(c) {
      const first = parseMmddyy(c.state.vars.firstDate ?? "");
      const last = parseMmddyy(c.state.vars.lastDate ?? "");
      if (first && last && ordinal(first) <= ordinal(last)) return 307;
      c.print("ERROR IN DATES - PLEASE TRY AGAIN");
      return 304;
    },
  },
  307: { enter: (c) => (c.state.vars.key === "ADD" ? 311 : 308) },
  308: countStep(),
  309: subfileLoop(309, 310),
  310: { enter: (c) => menuKey("correspondence", c.state.vars.key ?? "")?.goto ?? 301 },
  311: {
    submit(c, input) {
      c.state.vars.option = input;
      return undefined;
    },
  },
  312: {
    enter(c) {
      const today = parseMmddyy(c.today());
      const due = c.records().filter((r) => {
        const d = parseRecordDate(r.values.actionDueDate);
        if (!d) return false;
        if (c.state.vars.option !== "2" || !today) return true;
        return ordinal(d) - ordinal(today) <= 5;
      });
      c.state.results = due;
      if (due.length === 0) {
        c.print("THERE ARE NO DOCUMENTS AWAITING ACTION");
        return 317;
      }
      c.print(...correspondenceHeader("ACTION ITEM DUE DATE"));
      due.forEach((r) => c.print(...correspondenceEntry(r)));
      c.print("", `THERE ARE ${due.length} DOCUMENTS AWAITING ACTION`);
      return 4;
    },
  },
  314: {
    enter(c) {
      const all = c.records();
      c.state.results = all;
      c.print(...correspondenceHeader("PRINT ALL"));
      all.forEach((r) => c.print(...correspondenceEntry(r)));
      return 4;
    },
  },
  316: resultStep((v) => entryMatch("responsibleEngineer", v, /[/,;\s]+/)),
  317: { submit: () => 301 },
  319: resultStep((v) => entryMatch("toAddressee", v, /;/)),
  322: resultStep((v) => dateMatch(["documentDate"], v)),
  325: resultStep((v) => prefixMatch("contractNumber", v)),
  328: resultStep((v) => prefixMatch("waNumberIdCode", v)),
  331: resultStep((v) => prefixMatch("authorSource", v)),
  334: resultStep((v) => prefixMatch("documentLetterNumber", v)),
  337: resultStep((v) => dateMatch(["inputDate"], v)),
  339: {
    submit(c, input) {
      c.state.vars.remaining = Number(input);
      c.state.vars.count = 0;
      return undefined;
    },
  },
  340: subjectWord,
  341: {
    enter(c) {
      const word = c.state.vars.lastInput ?? "";
      c.state.results.forEach((r) => c.print(r.values.subject ?? ""));
      c.printPrompt({ XXX: String(c.state.results.length), AAAA: word });
      return 342;
    },
  },
  342: {
    enter(c) {
      if (c.state.results.length === 0) return 345;
      const left = (c.state.vars.remaining ?? 1) - 1;
      c.state.vars.remaining = left;
      return left > 0 ? 340 : 343;
    },
  },
  343: {
    enter(c) {
      c.print(...correspondenceHeader("SUBJECT"));
      c.state.results.forEach((r) => c.print(...correspondenceEntry(r)));
      return 344;
    },
  },
  347: {
    enter(c) {
      const status = c.state.vars.lastInput ?? "";
      if (MAIL_STATUS.includes(status)) return 348;
      c.print(mailStatusError(status));
      return 346;
    },
  },
  348: resultStep((v) => (r) => r.values.mailStatus === v),
  350: {
    submit(c, input) {
      if (input.startsWith("Y")) c.hint("The output is spooled to the printer.");
      return undefined;
    },
  },
  401: {
    submit(c, input) {
      setCandidates(c, byDateCode(c.records(), input));
      return undefined;
    },
  },
  403: {
    enter(c) {
      const [found] = candidates(c);
      if (found) {
        c.env.store.remove("correspondence", found.id);
        c.hint(`Archived: ${found.values.subject ?? found.values.documentLetterNumber ?? "the record"}.`);
      } else {
        c.hint("No record has that input date-code, so nothing was archived.");
      }
      return 3;
    },
  },
  103: showAndGo(104),
};

