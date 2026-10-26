import { feeFor } from "./draft";
import { startAuto } from "./joborders";
import { printHeaderAndJobs } from "./retrieve";
import { answer, intOf, numOf, type Session, type Steps } from "./session";
import { recordDate } from "./screens";
import type { StoredSpadsRecord } from "./types";

// INPUT (PDF 49 to 51): WA number and code, the five '!' header form
// sections, STATUS and CONTRACTOR checks, job orders, then one data change.

// The printed INPUT record carries CONTRACT/PURCHASE ORDER NAS1-12500
// (PDF 50) though the form never asks for it.
const INPUT_CONTRACT = "NAS1-12500";

// inputHeaderForm line ranges: intro + TITLE, REMARKS, engineers, task, status.
const FORM_SECTIONS: [number, number][] = [
  [0, 4],
  [4, 7],
  [7, 10],
  [10, 13],
  [13, 16],
];

/**
 * Fields typed under one '!' form line. Text holding '!' marks splits on
 * them; otherwise the text is read by the form's columns, with or without
 * the one-column indent the printed answers show.
 */
export function formFields(formLine: string, text: string): string[] {
  if (text.includes("!")) return text.split("!").slice(text.trimStart().startsWith("!") ? 1 : 0).map((f) => f.trim());
  const bangs = [...formLine].flatMap((c, i) => (c === "!" ? [i] : []));
  const line = /^\s/.test(text) ? text : ` ${text}`;
  const fields: string[] = [];
  for (let i = 0; i + 1 < bangs.length; i++) fields.push(line.slice(bangs[i] + 1, bangs[i + 1]).trim());
  return fields;
}

const hasColumns = (text: string) => text.includes("!") || /\S\s{2,}\S/.test(text.trim());

function applySection(r: StoredSpadsRecord, section: number, formLine: string, text: string): void {
  const raw = text.toUpperCase();
  if (section === 0) r.title = raw.replace(/!/g, "").trim().slice(0, 72);
  else if (section === 1) r.remarks = raw.replace(/!/g, "").trim();
  else if (section === 2) {
    const f = hasColumns(raw) ? formFields(formLine, raw) : raw.trim().split(/\s+/);
    [r.nr = "", r.cr = "", r.rbk = "", r.pr = ""] = f.map((v) => v ?? "");
  } else if (section === 3) {
    let task = "";
    let sub = "";
    let numbers: string[];
    if (hasColumns(raw)) {
      const f = formFields(formLine, raw);
      task = f[0] ?? "";
      sub = f[3] ?? "";
      numbers = f.slice(4);
    } else {
      const t = raw.trim().split(/\s+/).filter(Boolean);
      if (/^[A-Z]$/.test(t[0] ?? "")) task = t.shift() ?? "";
      if (/^\d{0,3}\.\d{0,2}$/.test(t[0] ?? "")) sub = t.shift() ?? "";
      numbers = t;
    }
    r.task = task.slice(0, 1);
    const [as = "", sb = ""] = sub.split(".");
    r.taskas = as.trim();
    r.tasksb = sb.trim();
    r.rtHours = numOf(numbers[0] ?? "") ?? 0;
    r.rtDollars = numOf(numbers[1] ?? "") ?? 0;
  } else {
    const tokens = raw.split(/[!\s]+/).filter(Boolean);
    const status = tokens.find((t) => t === "AUT" || t === "FUT");
    const contractor = tokens.find((t) => t === "LTV" || t === "VOUGHT");
    const mods = tokens.find((t) => t.includes(","));
    const numbers = tokens.filter((t) => t !== mods && numOf(t) !== null).map((t) => numOf(t) ?? 0);
    r.status = (status ?? "") as StoredSpadsRecord["status"];
    r.contractor = contractor ?? "";
    r.mods = mods ? mods.split(",").map((m) => m.trim()).slice(0, 4) : [];
    r.totHours = numbers[0] ?? 0;
    r.totDollars = numbers[1] ?? 0;
  }
}

function blankRecord(s: Session, wan: string, wacode: string): StoredSpadsRecord {
  return {
    sysnum: s.store.nextSysnum(),
    date: recordDate(s.now()),
    status: "",
    title: "",
    mods: [],
    contractor: "",
    remarks: "",
    nr: "",
    cr: "",
    rbk: "",
    pr: "",
    contract: INPUT_CONTRACT,
    task: "",
    taskas: "",
    tasksb: "",
    wan,
    wacode,
    complete: false,
    rtHours: 0,
    rtDollars: 0,
    totHours: 0,
    totDollars: 0,
    fee: 0,
    table: "",
    jobOrders: [],
    months: [],
    sourcePages: [],
    origin: "session",
    showTotals: true,
  };
}

function afterHeader(s: Session): void {
  const r = s.ctx.draft;
  if (!r) return;
  if (r.status !== "AUT" && r.status !== "FUT") return s.go("input.status");
  if (r.contractor !== "LTV" && r.contractor !== "VOUGHT") return s.go("input.contractor");
  r.fee = feeFor(s, r.task);
  s.go("input.jobs");
}

export const inputSteps: Steps = {
  "input.wa": {
    enter: (s) => {
      s.print("");
      s.show("inputWaPrompt");
    },
    input: (s, text) => {
      if (answer(text) === "") return s.go("analysis");
      const m = /^!?\s*(\d{1,4})\s*!?\s*([A-Z0-9]{1,4})\s*!?$/.exec(answer(text));
      if (!m) return s.go("input.wa");
      s.ctx.modMethod = "input";
      s.ctx.draft = blankRecord(s, m[1], m[2]);
      s.ctx.inputForm = 0;
      s.go("input.form");
    },
  },
  "input.form": {
    enter: (s) => {
      const [from, to] = FORM_SECTIONS[s.ctx.inputForm ?? 0];
      s.print("");
      s.lines(s.menu("inputHeaderForm").slice(from, to));
    },
    input: (s, text) => {
      const section = s.ctx.inputForm ?? 0;
      const formLine = s.menu("inputHeaderForm")[FORM_SECTIONS[section][1] - 1];
      if (s.ctx.draft) applySection(s.ctx.draft, section, formLine, text);
      if (section + 1 < FORM_SECTIONS.length) {
        s.ctx.inputForm = section + 1;
        return s.go("input.form");
      }
      s.ctx.inputForm = undefined;
      afterHeader(s);
    },
  },
  "input.status": {
    enter: (s) => {
      s.print("");
      s.show("inputStatusError");
    },
    input: (s, text) => {
      const a = answer(text);
      if (a !== "AUT" && a !== "FUT") return s.go("input.status");
      if (s.ctx.draft) s.ctx.draft.status = a;
      afterHeader(s);
    },
  },
  "input.contractor": {
    enter: (s) => {
      s.print("");
      s.show("inputContractorError");
    },
    input: (s, text) => {
      const a = answer(text);
      if (a !== "LTV" && a !== "VOUGHT") return s.go("input.contractor");
      if (s.ctx.draft) s.ctx.draft.contractor = a;
      afterHeader(s);
    },
  },
  "input.jobs": {
    enter: (s) => {
      s.print("");
      s.show("inputJobOrdersBuilt");
    },
    input: (s, text) => {
      const n = intOf(text);
      if (answer(text) === "") {
        if (s.ctx.draft) printHeaderAndJobs(s, s.ctx.draft);
        return s.go("mod.dataChange");
      }
      if (n === 1) return s.go("input.count");
      if (n === 2) return startAuto(s);
      s.go("input.jobs");
    },
  },
  "input.count": {
    enter: (s) => {
      s.print("");
      s.show("inputJobOrderCount");
    },
    input: (s, text) => {
      const n = intOf(text);
      if (n === null || n < 1 || n > 25) return s.go("input.count");
      s.ctx.joRemaining = n;
      if (s.ctx.draft) s.ctx.draft.table = "MANL";
      s.go("jo.add");
    },
  },
};
