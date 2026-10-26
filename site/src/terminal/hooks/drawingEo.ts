import { ITEM_STEPS } from "../fieldSteps";
import { drawingEntry, eoLine, referencedEos } from "../format";
import type { Hook, HookCtx, HookTable } from "../hook";
import { menuKey } from "../menuKeys";
import { dateMatch, entryMatch, field, prefixMatch, valueTokens, wordMatch } from "../search";
import type { StoredRecord } from "../types";
import { beginEdit, candidates, commit, countStep, setCandidates } from "./shared";

const isEo = (r: StoredRecord) => !!r.values.eoNumber && !r.values.drawingNumber;
const drawings = (c: HookCtx) => c.records().filter((r) => !isEo(r));
const eos = (c: HookCtx) => c.records().filter(isEo);

const brief = (c: HookCtx) => c.state.vars.flag === "BRIEF";

const showDrawings = (c: HookCtx, found: StoredRecord[]) => {
  const all = eos(c);
  found.forEach((r, i) => c.print(...drawingEntry(r, i + 1, all, brief(c))));
};

const showEos = (c: HookCtx, found: StoredRecord[]) => found.forEach((r, i) => c.print(eoLine(r, i + 1)));

const appendEo = (list: string | undefined, eo: string) => [...referencedEos(list), eo].join(" ");

const vehicleNumbers = (s: string | undefined) => (s ?? "").split(/\s+/).filter((v) => /^\d+/.test(v)).map((v) => parseInt(v, 10));

/** A drawing search: show the matching sheets, then the step after prints the count (Steps #29 to #30 and alike). */
function drawingSearch(match: (value: string) => (r: StoredRecord) => boolean): Hook {
  return {
    enter(c) {
      const value = c.state.vars.lastInput ?? "";
      c.state.results = drawings(c).filter(match(value));
      showDrawings(c, c.state.results);
      c.state.vars.option = value;
      return undefined;
    },
  };
}

/** The count message after a drawing search. */
const drawingCount: Hook = {
  enter(c) {
    c.print("", ...fillCount(c, c.state.results.length));
    return undefined;
  },
};

function fillCount(c: HookCtx, count: number): string[] {
  const value = c.state.vars.option ?? "";
  const tokens: Record<string, string> = { ...valueTokens(value), XXX: String(count) };
  return c.step.prompt.map((l) => l.replace(/(?<![A-Z0-9-])(XXX|AAAA|AAA|NNNNNN|NNNN|NNN|MM-DD-YY)(?![A-Z0-9-])/g, (m) => tokens[m] ?? m));
}

const titleWord: Hook = {
  submit(c, input) {
    if (input === "QUIT") return 311;
    const pool = c.state.vars.count === 0 ? drawings(c) : c.state.results;
    c.state.vars.count = (c.state.vars.count ?? 0) + 1;
    c.state.results = pool.filter(wordMatch("title", input));
    return 307;
  },
};

/** E.O.s on one drawing sheet decide which message Input Step #30 shows. */
function eosOnSheet(c: HookCtx, drawingNumber: string | undefined): number {
  if (!drawingNumber) return 0;
  return Math.max(0, ...drawings(c).filter((r) => r.values.drawingNumber === drawingNumber).map((r) => referencedEos(r.values.eosReferenced).length));
}

const sheetNumberOf = (input: string) => String(Number(input.slice(0, 2)));

export const drawingEoHooks: HookTable = {
  101: {
    submit(c, input) {
      c.state.vars.editingId = undefined;
      c.state.vars.option = input;
      c.state.fields = input === "DRAW" ? { sheetNumber: "1" } : {};
      return undefined;
    },
  },
  110: countStep(),
  111: {
    submit(c, input) {
      c.state.fields.eosReferenced = appendEo(c.state.fields.eosReferenced, input);
      return undefined;
    },
  },
  112: {
    enter(c) {
      const left = (c.state.vars.remaining ?? 1) - 1;
      c.state.vars.remaining = left;
      return left > 0 ? 111 : 113;
    },
  },
  113: {
    enter(c) {
      const sheet1 = { ...c.state.fields };
      c.state.vars.candidates = [];
      const saved = commit(c, sheet1);
      if (saved) c.state.vars.candidates = [saved.id];
      if (Number(sheet1.numberOfSheets ?? "1") <= 1) return 119;
      const { title, drawingNumber, date, system, vehicle, section, numberOfSheets } = sheet1;
      c.state.fields = Object.fromEntries(
        Object.entries({ title, drawingNumber, date, system, vehicle, section, numberOfSheets }).filter(([, v]) => v !== undefined),
      ) as Record<string, string>;
      c.printPrompt();
      return 114;
    },
  },
  114: {
    submit(c, input) {
      c.state.fields.sheetNumber = sheetNumberOf(input);
      return undefined;
    },
  },
  116: countStep(),
  117: {
    submit(c, input) {
      c.state.fields.eosReferenced = appendEo(c.state.fields.eosReferenced, input);
      return undefined;
    },
  },
  118: {
    enter(c) {
      const left = (c.state.vars.remaining ?? 1) - 1;
      c.state.vars.remaining = left;
      return left > 0 ? 117 : 119;
    },
  },
  119: {
    enter(c) {
      if (Number(c.state.fields.numberOfSheets ?? "1") > 1 && c.state.fields.sheetNumber) {
        const saved = commit(c);
        if (saved) c.state.vars.candidates = [...(c.state.vars.candidates ?? []), saved.id];
      }
      showDrawings(c, candidates(c));
      return 134;
    },
  },
  126: countStep(),
  127: {
    submit(c, input) {
      c.state.vars.option = input;
      return undefined;
    },
  },
  128: {
    submit(c, input) {
      c.state.vars.count = Number(input);
      return undefined;
    },
  },
  129: {
    submit(c, input) {
      const drawingNumber = c.state.vars.option;
      const sheet = sheetNumberOf(input);
      const target = drawings(c).find((r) => r.values.drawingNumber === drawingNumber && r.values.sheetNumber === sheet);
      if (target && c.state.fields.eoNumber) {
        c.env.store.update("drawing-eo", target.id, { ...target.values, eosReferenced: appendEo(target.values.eosReferenced, c.state.fields.eoNumber) });
      }
      const sheetsLeft = (c.state.vars.count ?? 1) - 1;
      c.state.vars.count = sheetsLeft;
      if (sheetsLeft > 0) return 129;
      const drawingsLeft = (c.state.vars.remaining ?? 1) - 1;
      c.state.vars.remaining = drawingsLeft;
      return drawingsLeft > 0 ? 127 : 130;
    },
  },
  130: {
    enter(c) {
      const saved = commit(c);
      if (saved) showEos(c, [saved]);
      const n = eosOnSheet(c, c.state.vars.option);
      // The manual gives no branch for exactly four E.O.s (Step #31 is unreachable as printed), so four reads as "less than five".
      if (n === 5) return 132;
      if (n > 5) return 133;
      return 134;
    },
  },
  132: {
    enter(c) {
      c.hint("Attention: this sheet now carries five E.O.s.");
      return 134;
    },
  },
  133: {
    enter(c) {
      c.hint("Important: this sheet carries more than five E.O.s and is due for revision.");
      return 134;
    },
  },
  201: {
    submit(c, input) {
      c.state.vars.option = input;
      return undefined;
    },
  },
  202: {
    submit(c, input) {
      setCandidates(c, eos(c).filter((r) => field(r, "eoNumber") === input));
      return undefined;
    },
  },
  203: {
    submit(c, input) {
      setCandidates(c, drawings(c).filter((r) => field(r, "drawingNumber") === input));
      return undefined;
    },
  },
  204: {
    enter(c) {
      const [first] = candidates(c);
      const value = c.state.vars.lastInput ?? "";
      if (!first) {
        c.print(c.state.vars.option === "EO" ? `THERE IS NO E.O. ${value} IN THE EO SUBFILE` : `THERE IS NO DRAWING WITH NUMBER ${value} IN THE DRAWING FILE`);
        return 4;
      }
      if (isEo(first)) showEos(c, [first]);
      else showDrawings(c, [first]);
      return undefined;
    },
  },
  205: {
    submit(c, input) {
      const [first, ...rest] = candidates(c);
      if (!first) return 4;
      if (input.startsWith("Y")) {
        beginEdit(c, first);
        return 206;
      }
      setCandidates(c, rest);
      return rest.length > 0 ? 204 : 4;
    },
  },
  206: {
    submit(c, input) {
      if (input === "DEL") {
        c.env.store.remove("drawing-eo", c.state.vars.editingId!);
        c.state.vars.editingId = undefined;
        return 4;
      }
      return c.state.vars.option === "EO" ? 207 : 210;
    },
  },
  207: countStep(),
  209: {
    enter(c) {
      const target = ITEM_STEPS.eo[Number(c.state.vars.lastInput)];
      if (!target) return 224;
      const left = (c.state.vars.remaining ?? 1) - 1;
      c.state.vars.remaining = left;
      c.state.vars.itemReturn = left > 0 ? 208 : 224;
      return target;
    },
  },
  210: countStep(),
  211: {
    submit(c, input) {
      c.state.vars.count = Number(input);
      return undefined;
    },
  },
  212: {
    submit(c, input) {
      c.state.vars.flag = input;
      return undefined;
    },
  },
  214: {
    enter(c) {
      const item = c.state.vars.count ?? 0;
      if (item === 7) return 215;
      if (item === 8) return 217;
      if (item === 9) return 219;
      const target = ITEM_STEPS.drawing[item];
      if (!target) return 224;
      const left = (c.state.vars.remaining ?? 1) - 1;
      c.state.vars.remaining = left;
      c.state.vars.itemReturn = left > 0 ? 211 : 224;
      return target;
    },
  },
  215: {
    enter(c) {
      c.printPrompt();
      return c.state.vars.flag === "NEW" ? 216 : 224;
    },
  },
  216: {
    submit(c, input) {
      c.state.fields.sheetNumber = sheetNumberOf(input);
      c.state.vars.editingId = undefined;
      return undefined;
    },
  },
  217: {
    submit: (_c, input) => (sheetNumberOf(input) === "1" ? 224 : 218),
  },
  220: countStep(),
  221: {
    submit(c, input) {
      c.state.vars.count = Number(input);
      return undefined;
    },
  },
  222: {
    submit(c, input) {
      const list = referencedEos(c.state.fields.eosReferenced);
      const i = (c.state.vars.count ?? 1) - 1;
      if (i >= 0 && i < 10) list[i] = input;
      c.state.fields.eosReferenced = list.join(" ");
      return undefined;
    },
  },
  223: {
    enter(c) {
      const left = (c.state.vars.remaining ?? 1) - 1;
      c.state.vars.remaining = left;
      return left > 0 ? 221 : 224;
    },
  },
  224: {
    enter(c) {
      const saved = commit(c);
      if (saved) {
        c.state.vars.editingId = saved.id;
        if (isEo(saved)) showEos(c, [saved]);
        else showDrawings(c, [saved]);
      }
      return 225;
    },
  },
  225: {
    submit(c, input) {
      if (input === "CO") return 4;
      return c.state.vars.option === "EO" ? 207 : 210;
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
  302: { enter: (c) => (c.state.vars.key === "QUIT" ? 360 : 303) },
  303: {
    submit(c, input) {
      c.state.vars.flag = input.startsWith("Y") ? "BRIEF" : undefined;
      return undefined;
    },
  },
  304: { enter: (c) => menuKey("drawing-eo", c.state.vars.key ?? "")?.goto ?? 301 },
  305: {
    submit(c, input) {
      c.state.vars.remaining = Number(input);
      c.state.vars.count = 0;
      return undefined;
    },
  },
  306: titleWord,
  307: {
    enter(c) {
      c.state.results.forEach((r) => c.print(r.values.title ?? ""));
      c.printPrompt({ XXX: String(c.state.results.length), AAAA: c.state.vars.lastInput ?? "" });
      return 308;
    },
  },
  308: {
    enter(c) {
      if (c.state.results.length === 0) return 311;
      const left = (c.state.vars.remaining ?? 1) - 1;
      c.state.vars.remaining = left;
      return left > 0 ? 306 : 309;
    },
  },
  309: {
    enter(c) {
      showDrawings(c, c.state.results);
      return 310;
    },
  },
  314: {
    enter(c) {
      c.state.results = drawings(c);
      showDrawings(c, c.state.results);
      return 315;
    },
  },
  315: {
    enter(c) {
      c.print("", ...fillCount(c, c.state.results.length));
      return 319;
    },
  },
  317: {
    enter(c) {
      c.state.results = eos(c);
      showEos(c, c.state.results);
      return 318;
    },
  },
  318: {
    enter(c) {
      c.print("", ...fillCount(c, c.state.results.length));
      return 319;
    },
  },
  319: {
    enter(c) {
      c.hint("The output file is spooled to the high speed printer.");
      return 4;
    },
  },
  321: {
    enter(c) {
      c.state.results = drawings(c).filter((r) => referencedEos(r.values.eosReferenced).length >= 5);
      showDrawings(c, c.state.results);
      return 322;
    },
  },
  322: {
    enter(c) {
      const sheets = String(c.state.results.length);
      const numbers = new Set(c.state.results.map((r) => r.values.drawingNumber)).size;
      c.print("", ...c.step.prompt.map((l) => l.replace("XXX", String(numbers)).replace(/(?<![A-Z0-9-])NNN(?![A-Z0-9-])/, sheets)));
      return c.state.results.length === 0 ? 324 : 4;
    },
  },
  326: {
    enter(c) {
      const value = c.state.vars.lastInput ?? "";
      c.state.results = drawings(c).filter((r) => field(r, "drawingNumber") === value);
      if (c.state.results.length > 0) showDrawings(c, c.state.results);
      else c.printPrompt({ NNNN: value });
      return 327;
    },
  },
  329: drawingSearch((v) => dateMatch(["date"], v)),
  330: drawingCount,
  333: drawingSearch((v) => entryMatch("system", v, /\s+/)),
  334: drawingCount,
  336: {
    submit(c, input) {
      c.state.vars.option = input;
      return undefined;
    },
  },
  337: {
    validate: (_c, input) => ({ ok: input === "" || /^\d{1,3}$/.test(input) }),
    submit(c, input) {
      c.state.vars.vehicleFirst = input === "" ? 0 : Number(input);
      return undefined;
    },
  },
  338: {
    validate: (_c, input) => ({ ok: input === "" || /^\d{1,3}$/.test(input) }),
    submit(c, input) {
      c.state.vars.vehicleLast = input === "" ? 999 : Number(input);
      return undefined;
    },
  },
  340: {
    enter(c) {
      const { vehicleFirst = 0, vehicleLast = 999 } = c.state.vars;
      c.state.results = drawings(c).filter((r) => vehicleNumbers(r.values.vehicle).some((n) => n >= vehicleFirst && n <= vehicleLast));
      showDrawings(c, c.state.results);
      return 341;
    },
  },
  341: drawingCount,
  343: {
    enter(c) {
      const { vehicleFirst = 0, vehicleLast = 999 } = c.state.vars;
      c.state.results = eos(c).filter((r) => vehicleNumbers(r.values.eoVehicle).some((n) => n >= vehicleFirst && n <= vehicleLast));
      showEos(c, c.state.results);
      return 344;
    },
  },
  344: drawingCount,
  347: drawingSearch((v) => prefixMatch("section", v)),
  348: drawingCount,
  351: drawingSearch((v) => (r) => (r.values.vendorCode ? prefixMatch("vendorCode", v)(r) : false)),
  352: drawingCount,
  354: {
    submit(c, input) {
      c.state.vars.option = input;
      return undefined;
    },
  },
  356: {
    enter(c) {
      const value = c.state.vars.option ?? "";
      c.state.results = eos(c).filter((r) => field(r, "eoNumber") === value);
      if (c.state.results.length > 0) showEos(c, c.state.results);
      else c.printPrompt({ NNNNNN: value });
      return 357;
    },
  },
  358: {
    enter(c) {
      const value = c.state.vars.option ?? "";
      c.state.results = drawings(c).filter((r) => referencedEos(r.values.eosReferenced).includes(value));
      showDrawings(c, c.state.results);
      const numbers = new Set(c.state.results.map((r) => r.values.drawingNumber)).size;
      c.print(
        "",
        ...c.step.prompt.map((l) =>
          l
            .replace("XXX", String(numbers))
            .replace(/(?<![A-Z0-9-])NNN(?![A-Z0-9-])/, String(c.state.results.length))
            .replace(/(?<![A-Z0-9-])NNNNNN(?![A-Z0-9-])/, value),
        ),
      );
      return 359;
    },
  },
  402: countStep(),
  404: {
    enter(c) {
      const number = c.state.vars.lastInput ?? "";
      const found = drawings(c).filter((r) => field(r, "drawingNumber") === number);
      found.forEach((r) => c.env.store.remove("drawing-eo", r.id));
      c.hint(found.length > 0 ? `Archived drawing ${number}.` : `No drawing ${number} was found, so nothing was archived.`);
      const left = (c.state.vars.remaining ?? 1) - 1;
      c.state.vars.remaining = left;
      return left > 0 ? 403 : 407;
    },
  },
  405: {
    enter(c) {
      c.printPrompt();
      const referenced = new Set(drawings(c).flatMap((r) => referencedEos(r.values.eosReferenced)));
      c.state.results = eos(c).filter((r) => !referenced.has(r.values.eoNumber ?? ""));
      return 406;
    },
  },
  406: {
    enter(c) {
      for (const r of c.state.results) {
        c.env.store.remove("drawing-eo", r.id);
        c.printPrompt({ NNNNNN: r.values.eoNumber ?? "" });
      }
      return 407;
    },
  },
};
