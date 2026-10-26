import type { Step } from "@/content/types";
import { isRealDate, parseMmddyy } from "./dates";

export type InputRule =
  | { kind: "login" }
  | { kind: "return" }
  | { kind: "keys"; keys: string[] }
  | { kind: "date" }
  | { kind: "dateCode" }
  | { kind: "wa"; max: number }
  | { kind: "digits"; max: number }
  | { kind: "code"; max: number }
  | { kind: "text"; max: number };

const YES_NO = new Set(["YES", "NO", "Y", "N"]);

/** Reads the manual's input mask (`AAAA`, `MMDDYY`, `YES/NO`, `!NN!!NN!`, ...) as a validation rule. */
export function ruleFor(step: Step, opts: { field?: boolean } = {}): InputRule | undefined {
  const input = step.input;
  if (!input) return undefined;
  const raw = input.pattern.trim();
  if (raw.startsWith("LOGIN")) return { kind: "login" };
  if (raw === "RETURN") return { kind: "return" };
  const p = raw.replaceAll("!", "");
  const maxLength = input.maxLength;
  if (p.includes("/")) return { kind: "keys", keys: p.split("/").map((k) => k.trim()) };
  // A record field typed under a count-style mask (`X`) is free text; the manual folds the count and the entries into one step.
  if (opts.field && /^[AX]+$/.test(p)) return { kind: "text", max: maxLength ?? 70 };
  if (p === "MMDDYY") return { kind: "date" };
  if (p === "MMDDYYNNNN") return { kind: "dateCode" };
  if (p === "NNNNIIII") return { kind: "wa", max: 8 };
  if (/^N+$/.test(p)) {
    // Short N masks are counts and item numbers; long ones hold drawing and E.O. numbers like `V51311`.
    return p.length <= 3 ? { kind: "digits", max: maxLength ?? p.length } : { kind: "code", max: maxLength ?? 14 };
  }
  if (/^X{1,2}$/.test(p)) return { kind: "digits", max: maxLength ?? p.length };
  if (/^[AXIN]+$/.test(p)) return { kind: "text", max: maxLength ?? (p.length < 4 ? p.length : 70) };
  return { kind: "keys", keys: [p] };
}

export const normalizeInput = (raw: string) => raw.toUpperCase().replace(/\s+$/, "").replace(/^\s+/, "");

export function keyMatches(key: string, input: string): boolean {
  const k = key.toUpperCase();
  if (k === input) return true;
  if (YES_NO.has(k) && YES_NO.has(input)) return k[0] === input[0];
  return false;
}

export type Validation = { ok: true } | { ok: false; message?: string };

/** Checks typed input against a step's rule. `allowNoDate` accepts `000000` for optional record dates. */
export function validate(rule: InputRule | undefined, input: string, opts: { allowNoDate?: boolean; allowBlank?: boolean } = {}): Validation {
  if (!rule) return { ok: true };
  if (rule.kind === "return") return { ok: true };
  if (input === "") return opts.allowBlank ? { ok: true } : { ok: false };
  switch (rule.kind) {
    case "login":
      return /^LOGIN\s+[A-Z]{1,3}$/.test(input) ? { ok: true } : { ok: false };
    case "keys":
      return rule.keys.some((k) => keyMatches(k, input)) ? { ok: true } : { ok: false };
    case "date": {
      if (opts.allowNoDate && input === "000000") return { ok: true };
      const ymd = parseMmddyy(input);
      return ymd && isRealDate(ymd) ? { ok: true } : { ok: false, message: "ERROR IN DATES - PLEASE TRY AGAIN" };
    }
    case "dateCode": {
      const ymd = /^\d{10}$/.test(input) ? parseMmddyy(input.slice(0, 6)) : undefined;
      return ymd && isRealDate(ymd) ? { ok: true } : { ok: false, message: "ERROR IN DATES - PLEASE TRY AGAIN" };
    }
    case "wa":
      return /^\d{4}[A-Z0-9]{0,4}$/.test(input) ? { ok: true } : { ok: false };
    case "digits":
      return /^\d+$/.test(input) && input.length <= rule.max ? { ok: true } : { ok: false };
    case "code":
      return /^[A-Z0-9 .-]+$/.test(input) && input.length <= rule.max ? { ok: true } : { ok: false };
    case "text":
      return input.length <= rule.max ? { ok: true } : { ok: false };
  }
}

/** A short, plain-language description of what a step expects, for the site's hint line. */
export function describeRule(rule: InputRule | undefined): string | undefined {
  if (!rule) return undefined;
  switch (rule.kind) {
    case "login":
      return "LOGIN followed by your initials, for example LOGIN DKH";
    case "return":
      return "Press Enter to continue";
    case "keys":
      return `One of: ${rule.keys.join(", ")}`;
    case "date":
      return "A date as MMDDYY, for example 100978";
    case "dateCode":
      return "Input date MMDDYY plus the four-digit daily counter, for example 1206780008";
    case "wa":
      return "A W.A. number: four digits plus up to four letters or digits";
    case "digits":
      return `A number, up to ${rule.max} digit${rule.max === 1 ? "" : "s"}`;
    case "code":
      return `A number or code, up to ${rule.max} characters`;
    case "text":
      return `Text, up to ${rule.max} characters`;
  }
}
