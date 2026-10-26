import type { Flow, Step } from "@/content/types";
import { matchBranch } from "./branches";
import { mmddyyOf, mmddyyToRecordDate } from "./dates";
import { DATE_FIELDS, fieldForStep } from "./fieldSteps";
import { fill, type Hook, type HookCtx } from "./hook";
import { HOOKS } from "./hooks";
import { normalizeInput, ruleFor, validate, type InputRule } from "./patterns";
import type { EngineEnv, EngineResult, EngineState, OutputLine, RecordType, Target } from "./types";

/** Guards against a no-input loop in the data; far more than any real chain of automatic steps. */
const MAX_AUTO_STEPS = 200;

/** The terminal's error text for a state the program can't be in, taken from the listing (ARCC). */
export const FILE_ERROR = "AN ERROR IN FILE MANAGEMENT SYSTEM HAS OCCURRED!";

const DEEP_LINK_USER = "SPO";

export function findStep(flow: Flow | undefined, n: number): Step | undefined {
  return flow?.steps.find((s) => s.n === n);
}

function hookFor(record: RecordType, n: number): Hook | undefined {
  return HOOKS.common[n] ?? HOOKS[record][n];
}

export function inputRule(record: RecordType, step: Step): InputRule | undefined {
  return ruleFor(step, { field: fieldForStep(record, step.n) !== undefined });
}

/** Whether a step stops for the visitor once entered (as opposed to running straight through). */
export function waitsForInput(record: RecordType, step: Step): boolean {
  return step.input !== undefined || hookFor(record, step.n)?.validate !== undefined;
}

class Session {
  state: EngineState;
  output: OutputLine[] = [];

  constructor(
    readonly env: EngineEnv,
    state: EngineState,
  ) {
    this.state = structuredClone(state);
  }

  flow(): Flow | undefined {
    return this.env.data.flows[this.state.record];
  }

  print(kind: OutputLine["kind"], ...lines: string[]) {
    for (const text of lines) this.output.push({ text, kind });
  }

  ctx(step: Step): HookCtx {
    const flow = this.flow()!;
    return {
      state: this.state,
      env: this.env,
      flow,
      step,
      print: (...lines) => this.print("program", ...lines),
      hint: (text) => this.print("hint", text),
      printPrompt: (map) => this.print("program", ...fill(step.prompt, map ?? {})),
      records: () => this.env.store.list(this.state.record),
      today: () => this.state.vars.today ?? mmddyyOf(this.now()),
    };
  }

  now(): Date {
    return this.env.now?.() ?? new Date();
  }

  stamp(): string {
    const d = this.now();
    const p = (n: number) => String(n).padStart(2, "0");
    return `${p(d.getHours())}'${p(d.getMinutes())}  ${mmddyyOf(d)}`;
  }

  enter(target: Target) {
    let next: Target | undefined = target;
    for (let guard = 0; next !== undefined; guard++) {
      if (guard > MAX_AUTO_STEPS) {
        this.print("program", FILE_ERROR);
        next = 4;
        guard = 0;
        continue;
      }
      if (next === "exit") {
        const v = this.state.vars;
        this.print("program", `${v.user ?? DEEP_LINK_USER} (${v.terminal ?? 4}) LOGGED OUT AT ${this.stamp()}`);
        this.state.step = "exit";
        return;
      }
      const step = findStep(this.flow(), next);
      if (!step) {
        this.print("program", FILE_ERROR);
        next = findStep(this.flow(), 4) ? 4 : "exit";
        continue;
      }
      this.state.step = step.n;
      this.state.history.push(`${this.state.record}:${step.n}`);
      next = this.run(step);
    }
  }

  /** Enters one step: its output, then where it leads, or undefined to wait for input. */
  private run(step: Step): Target | undefined {
    const record = this.state.record;
    const hook = hookFor(record, step.n);
    const c = this.ctx(step);
    const isMenu = step.n === 3 || step.n === 4 || step.mode === "menu";
    if (isMenu && this.output.length > 0 && this.output.at(-1)!.text !== "") this.print("program", "");
    if (hook?.enter) {
      const r = hook.enter(c);
      if (r === "wait") return undefined;
      if (r !== undefined) return r;
    } else {
      c.printPrompt();
    }
    if (waitsForInput(record, step)) return undefined;
    return autoRoute(step);
  }

  submit(raw: string) {
    if (this.state.step === "exit") {
      this.state = initialState(this.state.record);
      this.enter(1);
    }
    const step = findStep(this.flow(), this.state.step as number);
    if (!step) {
      this.print("program", FILE_ERROR);
      this.enter(4);
      return;
    }
    const record = this.state.record;
    const input = normalizeInput(raw);
    this.print("echo", input);
    const hook = hookFor(record, step.n);
    const c = this.ctx(step);
    const fieldName = fieldForStep(record, step.n);
    const rule = inputRule(record, step);
    const check = hook?.validate
      ? hook.validate(c, input)
      : validate(rule, input, { allowNoDate: fieldName !== undefined, allowBlank: fieldName !== undefined && rule?.kind === "text" });
    if (!check.ok) {
      if (check.message) this.print("program", check.message);
      c.printPrompt();
      return;
    }
    this.state.vars.lastInput = input;
    if (fieldName) {
      this.state.fields[fieldName] = DATE_FIELDS.has(fieldName) ? mmddyyToRecordDate(input) : input;
      const back = this.state.vars.itemReturn;
      if (back !== undefined) {
        this.state.vars.itemReturn = undefined;
        this.enter(back);
        return;
      }
    }
    const r = hook?.submit?.(c, input);
    if (r !== undefined && typeof r === "object") {
      this.print("program", ...r.retry);
      c.printPrompt();
      return;
    }
    const target = r ?? matchBranch(step, input) ?? step.next ?? soleBranch(step);
    if (target === undefined) {
      c.printPrompt();
      return;
    }
    this.enter(target);
  }
}

function soleBranch(step: Step): Target | undefined {
  const targets = new Set(step.branches.map((b) => b.goto));
  return targets.size === 1 ? step.branches[0].goto : undefined;
}

/** Where a step with nothing to type goes: its `next`, else its branch when every branch agrees, else the first branch. */
export function autoRoute(step: Step): Target | undefined {
  return step.next ?? soleBranch(step) ?? step.branches[0]?.goto;
}

export function initialState(record: RecordType): EngineState {
  return { record, step: 1, fields: {}, results: [], history: [], vars: {} };
}

export type Engine = {
  /** A fresh session at the login step. */
  start(record?: RecordType): EngineResult;
  submit(state: EngineState, input: string): EngineResult;
  /** A deep link: a logged-in session placed at a step (or the nearest earlier step that asks for input). */
  goTo(record: RecordType, n: number): EngineResult;
};

export function createEngine(env: EngineEnv): Engine {
  return {
    start(record = "correspondence") {
      const s = new Session(env, initialState(record));
      s.enter(1);
      return { state: s.state, output: s.output };
    },
    submit(state, input) {
      const s = new Session(env, state);
      s.submit(input);
      return { state: s.state, output: s.output };
    },
    goTo(record, n) {
      const s = new Session(env, { ...initialState(record), vars: { user: DEEP_LINK_USER, terminal: 4 } });
      s.enter(deepLinkStep(env, record, n));
      return { state: s.state, output: s.output };
    },
  };
}

/**
 * Steps that only print (results, pauses) need the input that led to them, so a link to one
 * starts at the nearest earlier step in the same mode that asks for input.
 */
export function deepLinkStep(env: EngineEnv, record: RecordType, n: number): number {
  const flow = env.data.flows[record];
  const step = findStep(flow, n);
  if (!flow || !step) return n;
  if (waitsForInput(record, step)) return n;
  const block = Math.floor(n / 100);
  const earlier = flow.steps
    .filter((s) => s.n < n && Math.floor(s.n / 100) === block && waitsForInput(record, s))
    .sort((a, b) => b.n - a.n)[0];
  return earlier?.n ?? n;
}
