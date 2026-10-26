import type { Menus, OutputLine, SessionCtx, SpadsEnv, SpadsState, SpadsStore } from "./types";

/** A prompt the engine waits on: `enter` prints it, `input` handles the answer. */
export type Step = {
  enter?: (s: Session) => void;
  input: (s: Session, text: string) => void;
  /** Password prompts do not echo what was typed. */
  mask?: boolean;
};

export type Steps = Record<string, Step>;

export type DialogPrompt = {
  key: string;
  lines: string[] | ((s: Session, answers: Record<string, string>) => string[]);
  when?: (answers: Record<string, string>) => boolean;
  /** Returns an error line to print before asking again, or null to accept. */
  check?: (text: string, answers: Record<string, string>) => string | null;
};

/** A straight run of prompts whose answers are handed to `finish`. */
export type Dialog = {
  prompts: DialogPrompt[];
  finish: (s: Session, answers: Record<string, string>) => void;
  /** Step entered when the visitor types QUIT. */
  quit?: string;
};

export type Dialogs = Record<string, Dialog>;

export class Session {
  readonly output: OutputLine[] = [];
  readonly state: SpadsState;
  private readonly env: SpadsEnv;
  private readonly steps: Steps;
  private readonly dialogs: Dialogs;
  private depth = 0;

  constructor(env: SpadsEnv, state: SpadsState, steps: Steps, dialogs: Dialogs) {
    this.env = env;
    this.state = JSON.parse(JSON.stringify(state)) as SpadsState;
    this.steps = steps;
    this.dialogs = dialogs;
  }

  get menus(): Menus {
    return this.env.data.menus;
  }

  get store(): SpadsStore {
    return this.env.store;
  }

  get data() {
    return this.env.data;
  }

  get ctx(): SessionCtx {
    return this.state.ctx;
  }

  now(): Date {
    return this.env.now ? this.env.now() : new Date();
  }

  /** A menus.json entry as lines; throws on an unknown key so a typo cannot pass silently. */
  menu(key: string): string[] {
    const value = this.menus[key];
    if (value === undefined) throw new Error(`menus.json has no ${key}`);
    return typeof value === "string" ? [value] : [...value];
  }

  print(text: string, kind: OutputLine["kind"] = "program"): void {
    this.output.push({ text, kind });
  }

  lines(lines: string[] | string): void {
    for (const line of typeof lines === "string" ? [lines] : lines) this.print(line);
  }

  show(key: string): void {
    this.lines(this.menu(key));
  }

  hint(text: string): void {
    this.print(text, "hint");
  }

  go(step: string): void {
    if (!this.steps[step]) throw new Error(`no step ${step}`);
    this.state.step = step;
    if (++this.depth > 200) throw new Error(`step loop at ${step}`);
    this.steps[step].enter?.(this);
    this.depth--;
  }

  submit(input: string): void {
    const step = this.steps[this.state.step];
    if (!step) return;
    this.print(step.mask ? "" : input, "echo");
    step.input(this, input);
  }

  startDialog(id: string): void {
    if (!this.dialogs[id]) throw new Error(`no dialog ${id}`);
    this.state.ctx.dialog = { id, index: 0, answers: {} };
    this.go("dialog");
  }

  /** Internal: the `dialog` step's enter. */
  dialogEnter(): void {
    const d = this.state.ctx.dialog;
    if (!d) return;
    const dialog = this.dialogs[d.id];
    while (d.index < dialog.prompts.length && dialog.prompts[d.index].when?.(d.answers) === false) d.index++;
    if (d.index >= dialog.prompts.length) {
      this.state.ctx.dialog = undefined;
      dialog.finish(this, d.answers);
      return;
    }
    const prompt = dialog.prompts[d.index];
    this.lines(typeof prompt.lines === "function" ? prompt.lines(this, d.answers) : prompt.lines);
  }

  /** Internal: the `dialog` step's input. */
  dialogInput(text: string): void {
    const d = this.state.ctx.dialog;
    if (!d) return;
    const dialog = this.dialogs[d.id];
    if (dialog.quit && text.trim().toUpperCase() === "QUIT") {
      this.state.ctx.dialog = undefined;
      this.go(dialog.quit);
      return;
    }
    const prompt = dialog.prompts[d.index];
    const error = prompt.check?.(text, d.answers) ?? null;
    if (error !== null) {
      if (error) this.print(error);
      this.go("dialog");
      return;
    }
    d.answers[prompt.key] = text.trim();
    d.index++;
    this.go("dialog");
  }
}

export const dialogStep: Step = {
  enter: (s) => s.dialogEnter(),
  input: (s, text) => s.dialogInput(text),
};

/** Upper-cased, trimmed input. */
export const answer = (text: string) => text.trim().toUpperCase();

export const isYes = (text: string) => /^Y/.test(answer(text));

/** A whole number, or null. Blank reads as null. */
export function intOf(text: string): number | null {
  const t = text.trim();
  if (!/^-?\d+$/.test(t)) return null;
  return Number(t);
}

/** A decimal number, or null. Blank reads as null. */
export function numOf(text: string): number | null {
  const t = text.trim().replace(/,/g, "");
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(t)) return null;
  return Number(t);
}

/** Privileged options consult the security table; on this site every login is cleared. */
export function securityCheck(s: Session): void {
  if (s.state.securityNoted) return;
  s.state.securityNoted = true;
  s.hint(
    "Site choice: this emulator's security table clears whatever initials you logged in with, so the privileged options are open to every visitor.",
  );
}
