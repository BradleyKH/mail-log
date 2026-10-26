import { bookSteps } from "./book";
import { inputSteps } from "./input";
import { modifySteps } from "./modify";
import { phoneReplay } from "./phone";
import { reportDialogs, reportSteps } from "./reports";
import { retrieveSteps } from "./retrieve";
import { answer, dialogStep, intOf, securityCheck, Session, type Steps } from "./session";
import { TEXT } from "./screens";
import { spoolSteps } from "./spool";
import type { SpadsEngine, SpadsEnv, SpadsResult, SpadsState } from "./types";
import { updateDialogs, updateSteps } from "./update";

const LIVE_CONTRACT = 10;
const TERMINAL = 4;

// Where the 1985 SPADS manuals document the main-menu programs this site does not emulate.
const MAIN_MENU_DOCS: Record<number, string> = {
  1: "CR-177948 (Vol. I), section 9.0, Change Request File",
  2: "CR-177948 (Vol. I), section 10.0, DIR and Report File",
  4: "CR-177948 (Vol. I), section 4.0, Office Automation System",
  7: "CR-177948 (Vol. I), section 16.0, Scheduler File",
  10: "CR-177948 (Vol. I), section 11.0, Government Furnished Property File",
  11: "CR-177948 (Vol. I), section 8.0, History Information File",
  12: "CR-177948 (Vol. I), section 12.0, Cross Reference Index File",
  13: "CR-177948 (Vol. I), section 13.0, Alpha Numeric Drawing File",
  14: "CR-177948 (Vol. I), section 15.0, Daily Work Items File",
  15: "CR-177950 (Vol. III), sections 10.0 and 11.0, Conference Registration Files",
  17: "CR-177948 (Vol. I), section 5.0, Telemail Network",
};

const pad2 = (n: number) => String(n).padStart(2, "0");

/** PRIMOS login-line form `DAY, DD MM YY HR:MN:SC` (PDF 12). */
function primosStamp(d: Date): string {
  const day = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][d.getDay()];
  return `${day}, ${pad2(d.getDate())} ${pad2(d.getMonth() + 1)} ${pad2(d.getFullYear() % 100)}  ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

function loggedOut(s: Session): string {
  const d = s.now();
  const date = `${pad2(d.getMonth() + 1)}${pad2(d.getDate())}${pad2(d.getFullYear() % 100)}`;
  const time = `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
  return `${s.state.user.padEnd(3)}    (${s.state.terminal}) LOGGED OUT  ${date}    ${time}`;
}

/** Prints only a menu's closing prompt line and waits on the same step. */
function reprompt(s: Session, key: string): void {
  const lines = s.menu(key);
  s.print(lines[lines.length - 1]);
}

const coreSteps: Steps = {
  login: {
    enter: (s) => s.print(TEXT.loginPlease),
    input: (s, text) => {
      const m = /^(?:LOGIN\s+)?([A-Z][A-Z0-9]{0,5})$/.exec(answer(text));
      if (!m) return s.go("login");
      s.state.user = m[1];
      s.print(TEXT.password);
      s.state.step = "password";
    },
  },
  password: {
    mask: true,
    input: (s) => {
      const now = s.now();
      const last = new Date(now.getTime() - 20 * 60 * 60 * 1000);
      s.print("");
      s.print(`${s.state.user} (USER ${s.state.terminal}) LOGGED IN  ${primosStamp(now)}`);
      // The manual prints REV#; the spool and job utilities it shows are rev 19.2.
      s.print("Welcome to PRIMOS version 19.2.");
      s.print(`Last login  ${primosStamp(last)}`);
      s.print("");
      s.print("HI !,");
      s.print("");
      s.print(TEXT.enterPassword);
      s.state.step = "password2";
    },
  },
  password2: {
    mask: true,
    input: (s) => {
      s.show("systemNews");
      s.print("");
      s.go("spadsMain");
    },
  },
  spadsMain: {
    enter: (s) => s.lines(s.menu("spadsMain").map((l) => l.replace("AAAAAA", s.state.user.padEnd(6)))),
    input: (s, text) => {
      const n = intOf(text);
      if (n === 8) return s.go("contract");
      if (n === 0) return s.go("logout");
      if (n === 9) {
        s.hint("MAIL LOG Correspondence is the 1979 program this site is built around; its terminal is in the Terminal room.");
        return reprompt(s, "spadsMain");
      }
      if (n !== null && n >= 1 && n <= 17) {
        const doc = MAIN_MENU_DOCS[n];
        s.hint(
          doc
            ? `This program is not emulated here. It is documented in ${doc}, in the Archive.`
            : "This program is not emulated here. The 1985 SPADS manuals (CR-177948 to CR-177950) in the Archive describe the SPADS programs.",
        );
        return reprompt(s, "spadsMain");
      }
      s.go("spadsMain");
    },
  },
  logout: {
    enter: (s) => s.show("logout"),
    input: (s, text) => {
      const n = answer(text) === "" ? 0 : intOf(text);
      if (n === 0) return s.go("spadsMain");
      if (n === 1) {
        s.print(loggedOut(s));
        s.state.step = "exit";
        return;
      }
      if (n === 2) {
        s.hint("No other terminal is logged in with your user ID, so the program returns to the SPADS main menu.");
        return s.go("spadsMain");
      }
      s.go("logout");
    },
  },
  exit: {
    input: (s) => s.go("login"),
  },
  contract: {
    enter: (s) => s.show("contractSelect"),
    input: (s, text) => {
      const n = answer(text) === "" ? 0 : intOf(text);
      if (n === 0) {
        s.print(loggedOut(s));
        s.state.step = "exit";
        return;
      }
      if (n === LIVE_CONTRACT) return s.go("analysis");
      if (n === 33) return pause(s, ["spoolQueue"]);
      if (n === 44) return pause(s, ["userList"]);
      if (n === 55) return pause(s, ["phantomList", "jobList"]);
      if (n === 66 || n === 77) {
        s.hint(`Replaying the manual's printed ${n === 66 ? "SEND" : "ANSWER"} MESSAGE exchange (CR-177949, PDF ${n === 66 ? "16 to 18" : "19 and 20"}).`);
        s.lines(phoneReplay(s, n));
        return s.go("contract");
      }
      if (n === 99) {
        s.show("systemNews");
        s.print("");
        return s.go("spadsMain");
      }
      if (n !== null && ((n >= 1 && n <= 12) || n === 22)) {
        s.hint("Only NAS1-16200's sample data survives in the 1985 manual, so that is the one contract this terminal opens. Choose 10.");
        return reprompt(s, "contractSelect");
      }
      s.go("contract");
    },
  },
  "contract.continue": {
    input: (s) => s.go("contract"),
  },
  analysis: {
    enter: (s) => s.show("analysisMain"),
    input: (s, text) => {
      const a = answer(text);
      const n = a === "" ? 0 : (intOf(a) ?? ["EXIT", "RETRIEVE", "INPUT", "BOOK", "REPORT", "UPDATE", "RATETABLE"].findIndex((w) => a.startsWith(w)));
      s.ctx.criteria = undefined;
      s.ctx.results = undefined;
      s.ctx.draft = undefined;
      switch (n) {
        case 0:
          return s.go("contract");
        case 1:
          return s.go("ret.start");
        case 2:
          securityCheck(s);
          return s.go("input.wa");
        case 3:
          return s.go("book.type");
        case 4:
          securityCheck(s);
          return s.go("report.main");
        case 5:
          securityCheck(s);
          return s.go("update.main");
        case 6:
          securityCheck(s);
          return s.go("rate.task");
        default:
          s.hint("That is not one of this menu's options.");
          s.go("analysis");
      }
    },
  },
  dialog: dialogStep,
};

/** Shows lookup screens that end in `Return to Continue: ** return **`, then waits for the return. */
function pause(s: Session, keys: string[]): void {
  for (const key of keys) {
    for (const line of s.menu(key)) s.print(line.replace(/\s*\*\* return \*\*\s*$/, ""));
  }
  s.state.step = "contract.continue";
}

const steps: Steps = {
  ...coreSteps,
  ...spoolSteps,
  ...retrieveSteps,
  ...modifySteps,
  ...inputSteps,
  ...bookSteps,
  ...reportSteps,
  ...updateSteps,
};

const dialogs = { ...reportDialogs, ...updateDialogs };

export function initialState(statusMonth = "MAY84"): SpadsState {
  return { step: "login", user: "", terminal: TERMINAL, statusMonth, securityNoted: false, ctx: {} };
}

/** The Contract Analysis program as a pure state machine over already-loaded SPADS data. */
export function createSpadsEngine(env: SpadsEnv): SpadsEngine {
  const run = (state: SpadsState, act: (s: Session) => void): SpadsResult => {
    const s = new Session(env, state, steps, dialogs);
    act(s);
    return { state: s.state, output: s.output };
  };
  return {
    start: () => run(initialState(), (s) => s.go("login")),
    submit: (state, input) => run(state, (s) => s.submit(input)),
  };
}
