import { mmddyyOf } from "../dates";
import type { HookTable } from "../hook";
import { keyMatches } from "../patterns";
import type { RecordType } from "../types";

/** Step 3's data-type keys; the manual prints each record's flow separately, so choosing one switches flows. */
export const DATA_TYPE_KEYS: Record<string, RecordType | "exit"> = {
  COR: "correspondence",
  DIR: "dir",
  DRAW: "drawing-eo",
  QU: "exit",
  QUIT: "exit",
};

const MODE_KEYS = ["INP", "REV", "SEA", "ARC", "QUIT"];

export const commonHooks: HookTable = {
  1: {
    submit(c, input) {
      const user = input.replace(/^LOGIN\s+/, "");
      const now = c.env.now?.() ?? new Date();
      const p = (n: number) => String(n).padStart(2, "0");
      c.state.vars = { user, terminal: 4, loginAt: `${p(now.getHours())}'${p(now.getMinutes())}`, today: mmddyyOf(now) };
      c.print(`${user} (4) LOGGED IN AT ${c.state.vars.loginAt}  ${mmddyyOf(now)}`);
      return 2;
    },
  },
  3: {
    validate: (_c, input) => ({ ok: input in DATA_TYPE_KEYS }),
    submit(c, input) {
      const choice = DATA_TYPE_KEYS[input];
      if (choice === "exit") return "exit";
      c.state.record = choice;
      c.state.fields = {};
      c.state.results = [];
      return 4;
    },
  },
  4: {
    validate: (_c, input) => ({ ok: MODE_KEYS.some((k) => keyMatches(k, input)) }),
  },
};
