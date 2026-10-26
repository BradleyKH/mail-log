import { ITEM_STEPS } from "../fieldSteps";
import { dirEntry } from "../format";
import type { Hook, HookCtx, HookTable } from "../hook";
import { menuKey } from "../menuKeys";
import { dateMatch, entryMatch, field, prefixMatch, printListing, valueTokens, wordMatch } from "../search";
import type { StoredRecord } from "../types";
import { contractFor } from "./correspondence";
import { beginEdit, candidates, commit, countStep, itemStep, setCandidates } from "./shared";

const byNumber = (records: StoredRecord[], n: string) => records.filter((r) => field(r, "dirReportNumber") === n);

const show = (c: HookCtx, records: StoredRecord[]) => records.forEach((r) => c.print(...dirEntry(r)));

function resultStep(match: (value: string) => (r: StoredRecord) => boolean): Hook {
  return {
    enter(c) {
      const value = c.state.vars.lastInput ?? "";
      printListing(c, c.records().filter(match(value)), { entry: (r) => dirEntry(r), tokens: valueTokens(value) });
      return undefined;
    },
  };
}

const vehicleNumbers = (r: StoredRecord) =>
  (r.values.vehicle ?? "")
    .split(/\s+/)
    .filter((v) => /^\d+$/.test(v))
    .map(Number);

const titleWord: Hook = {
  submit(c, input) {
    if (input === "QUIT") return 314;
    const pool = c.state.vars.count === 0 ? c.records() : c.state.results;
    c.state.vars.count = (c.state.vars.count ?? 0) + 1;
    c.state.results = pool.filter(wordMatch("title", input));
    return 310;
  },
};

export const dirHooks: HookTable = {
  101: {
    submit(c, input) {
      c.state.vars.editingId = undefined;
      c.state.vars.flag = undefined;
      c.state.fields = { dirReportNumber: input };
      return undefined;
    },
  },
  102: {
    enter(c) {
      const [found] = byNumber(c.records(), c.state.fields.dirReportNumber ?? "");
      if (!found) return 106;
      c.printPrompt();
      show(c, [found]);
      setCandidates(c, [found]);
      return 103;
    },
  },
  103: {
    submit(c, input) {
      const [found] = candidates(c);
      if (input.startsWith("Y") && found) beginEdit(c, found);
      return undefined;
    },
  },
  104: countStep(),
  105: itemStep(ITEM_STEPS.dir, 105, 115),
  111: {
    enter(c) {
      const wa = c.state.fields.waNumberIdCode ?? "";
      const contract = contractFor(c.records(), wa) ?? contractFor(c.env.store.list("correspondence"), wa);
      if (contract) {
        c.state.fields.contractNumber = contract;
        c.print(`CONTRACT NUMBER ${contract}`);
      } else {
        c.print("CONTRACT NUMBER WA NOT FOUND SEE RJK");
      }
      return 112;
    },
  },
  115: {
    enter(c) {
      const saved = commit(c);
      if (saved) {
        c.state.vars.editingId = saved.id;
        show(c, [saved]);
      }
      return c.state.vars.flag === "REVISE" ? 205 : 116;
    },
  },
  116: {
    submit(c, input) {
      if (input.startsWith("Y")) c.state.vars.editingId = undefined;
      return undefined;
    },
  },
  201: {
    submit(c, input) {
      const found = byNumber(c.records(), input);
      setCandidates(c, found);
      if (found.length > 0) return 202;
      c.hint("No DIR/report has that number.");
      return 4;
    },
  },
  202: {
    enter(c) {
      const [first] = candidates(c);
      if (!first) return 4;
      show(c, [first]);
      c.printPrompt();
      return "wait";
    },
    submit(c, input) {
      const [first, ...rest] = candidates(c);
      if (!first) return 4;
      if (input.startsWith("Y")) {
        beginEdit(c, first);
        return 203;
      }
      setCandidates(c, rest);
      return rest.length > 0 ? 202 : 4;
    },
  },
  203: {
    submit(c, input) {
      if (input !== "DEL") return undefined;
      c.env.store.remove("dir", c.state.vars.editingId!);
      c.state.vars.editingId = undefined;
      return 4;
    },
  },
  204: {
    enter(c) {
      c.state.vars.flag = "REVISE";
      return 104;
    },
  },
  205: {
    enter(c) {
      c.state.vars.flag = undefined;
      c.state.vars.editingId = undefined;
      return 4;
    },
  },
  301: {
    validate: (c, input) => ({ ok: menuKey(c.state.record, input) !== undefined }),
    submit(c, input) {
      c.state.vars.key = input;
      c.state.vars.count = 0;
      return undefined;
    },
  },
  302: { enter: (c) => menuKey("dir", c.state.vars.key ?? "")?.goto ?? 301 },
  304: {
    enter(c) {
      c.state.results = c.records();
      show(c, c.state.results);
      return 306;
    },
  },
  305: {
    enter(c) {
      c.state.results = c.records();
      c.state.results.forEach((r) => c.print(`${(r.values.dirReportNumber ?? "").padEnd(16)}${r.values.revision ?? ""}`));
      return 306;
    },
  },
  306: {
    enter(c) {
      c.print("", ...c.step.prompt.map((l) => l.replace("XXX", String(c.records().length))));
      return 307;
    },
  },
  307: {
    enter(c) {
      c.hint("The output file is spooled to the high speed printer.");
      return 4;
    },
  },
  308: {
    submit(c, input) {
      c.state.vars.remaining = Number(input);
      c.state.vars.count = 0;
      return undefined;
    },
  },
  309: titleWord,
  310: {
    enter(c) {
      c.state.results.forEach((r) => c.print(r.values.title ?? ""));
      c.printPrompt({ XXX: String(c.state.results.length), AAAA: c.state.vars.lastInput ?? "" });
      return 311;
    },
  },
  311: {
    enter(c) {
      if (c.state.results.length === 0) return 314;
      const left = (c.state.vars.remaining ?? 1) - 1;
      c.state.vars.remaining = left;
      return left > 0 ? 309 : 312;
    },
  },
  312: {
    enter(c) {
      show(c, c.state.results);
      return 313;
    },
  },
  316: {
    enter(c) {
      const value = c.state.vars.lastInput ?? "";
      const found = byNumber(c.records(), value);
      c.state.results = found;
      if (found.length > 0) show(c, found);
      else c.print(`THERE IS NO DIR-REPORT WITH NUMBER ${value} IN THE DIR FILE`);
      return 301;
    },
  },
  318: resultStep((v) => dateMatch(["date", "revisionDate"], v)),
  320: resultStep((v) => prefixMatch("waNumberIdCode", v)),
  322: resultStep((v) => entryMatch("system", v, /\s+/)),
  324: resultStep((v) => prefixMatch("contractNumber", v)),
  325: {
    submit(c, input) {
      c.state.vars.option = input;
      return undefined;
    },
  },
  326: {
    validate: (_c, input) => ({ ok: input === "" || /^\d{1,3}$/.test(input) }),
    submit(c, input) {
      c.state.vars.vehicleFirst = input === "" ? 0 : Number(input);
      return undefined;
    },
  },
  327: {
    validate: (_c, input) => ({ ok: input === "" || /^\d{1,3}$/.test(input) }),
    submit(c, input) {
      c.state.vars.vehicleLast = input === "" ? 999 : Number(input);
      return undefined;
    },
  },
  328: {
    enter(c) {
      const { vehicleFirst = 0, vehicleLast = 999 } = c.state.vars;
      const value = c.state.vars.option ?? "";
      const found = c.records().filter((r) => vehicleNumbers(r).some((n) => n >= vehicleFirst && n <= vehicleLast));
      printListing(c, found, { entry: (r) => dirEntry(r), tokens: valueTokens(value) });
      return 301;
    },
  },
  401: countStep(),
  403: {
    enter(c) {
      const number = c.state.vars.lastInput ?? "";
      const [found] = byNumber(c.records(), number);
      if (found) c.env.store.remove("dir", found.id);
      c.hint(found ? `Archived DIR/report ${number}.` : `No DIR/report ${number} was found, so nothing was archived.`);
      const left = (c.state.vars.remaining ?? 1) - 1;
      c.state.vars.remaining = left;
      return left > 0 ? 402 : 404;
    },
  },
};
