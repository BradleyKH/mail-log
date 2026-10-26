import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { spadsMenus, spadsRecords, spadsReports, spadsTables } from "@/content/load";
import { createSpadsEngine } from "@/spads/terminal/engine";
import { createSpadsStore } from "@/spads/terminal/store";
import type { OutputLine, SpadsData, SpadsEngine, SpadsState } from "@/spads/terminal/types";
import { formulaOf, RESTORE_INPUTS, screenOf, type FormulaKey } from "./spadsHints";

/** Enough scrollback for several long listings without the page growing without bound. */
const MAX_LINES = 600;

let dataPromise: Promise<SpadsData | undefined> | undefined;

function loadSpadsData(): Promise<SpadsData | undefined> {
  dataPromise ??= Promise.all([spadsMenus(), spadsRecords(), spadsTables(), spadsReports()]).then(
    ([menus, records, tables, reports]) => (menus && records && tables && reports ? { menus, records, tables, reports } : undefined),
    (err: unknown) => {
      dataPromise = undefined;
      throw err;
    },
  );
  return dataPromise;
}

type Session = { engine: SpadsEngine; state: SpadsState; lines: OutputLine[]; formula?: FormulaKey };

/**
 * A fresh session with its own store, so session edits never outlive a restart.
 * A restorable `screen` is reached by replaying login and menu choices through the engine;
 * only the final screen's output is kept.
 */
function begin(data: SpadsData, screen: string | null): Session {
  const engine = createSpadsEngine({ data, store: createSpadsStore(data) });
  const start = engine.start();
  const inputs = screen ? RESTORE_INPUTS[screen] : undefined;
  if (!inputs) return { engine, state: start.state, lines: start.output };
  let state = start.state;
  let last: OutputLine[] = [];
  for (const input of inputs) {
    const r = engine.submit(state, input);
    state = r.state;
    last = r.output;
  }
  if (screenOf(state) !== screen) return { engine, state: start.state, lines: start.output };
  const note: OutputLine = { text: `Logged in as ${state.user} and returned to this screen. Start over for a fresh login.`, kind: "hint" };
  return { engine, state, lines: [note, ...last.filter((l) => l.kind !== "echo")] };
}

export type SpadsSession =
  | { status: "loading" | "error" }
  | {
      status: "ready";
      state: SpadsState;
      lines: OutputLine[];
      /** The calculation behind the most recent spread, update, or report flow. */
      formula: FormulaKey | undefined;
      submit(input: string): void;
      restart(): void;
    };

/** Runs one Contract Analysis session and keeps the current screen in `?screen=`. */
export function useSpadsSession(): SpadsSession {
  const [params, setParams] = useSearchParams();
  const paramScreen = params.get("screen");
  const [data, setData] = useState<SpadsData | "error">();
  const [session, setSession] = useState<Session>();
  // The engine writes to the session's store, so it must run once per submit, outside any state updater (StrictMode runs updaters twice).
  const current = useRef(session);
  current.current = session;
  const syncedScreen = useRef<string | null | undefined>(undefined);
  const initialScreen = useRef(paramScreen);

  useEffect(() => {
    let live = true;
    loadSpadsData().then(
      (d) => live && setData(d ?? "error"),
      () => live && setData("error"),
    );
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (!data || data === "error" || current.current) return;
    const s = begin(data, initialScreen.current);
    current.current = s;
    setSession(s);
  }, [data]);

  // A link elsewhere on the site can change the URL while the terminal is open; follow it to a restorable menu.
  useEffect(() => {
    if (!data || data === "error" || !session) return;
    if (paramScreen === syncedScreen.current || paramScreen === null || !RESTORE_INPUTS[paramScreen]) return;
    if (paramScreen === screenOf(session.state)) return;
    const s = begin(data, paramScreen);
    current.current = s;
    setSession(s);
  }, [data, paramScreen, session]);

  useEffect(() => {
    if (!session) return;
    const screen = screenOf(session.state) ?? null;
    if (screen === syncedScreen.current && params.get("screen") === screen) return;
    syncedScreen.current = screen;
    setParams(
      (p) => {
        const next = new URLSearchParams(p);
        if (screen === null) next.delete("screen");
        else next.set("screen", screen);
        return next;
      },
      { replace: true },
    );
  }, [session, params, setParams]);

  const submit = useCallback((input: string) => {
    const s = current.current;
    if (!s) return;
    const r = s.engine.submit(s.state, input);
    const lines = [...s.lines, ...r.output];
    const next: Session = {
      engine: s.engine,
      state: r.state,
      lines: lines.length > MAX_LINES ? lines.slice(-MAX_LINES) : lines,
      formula: formulaOf(r.state) ?? (r.state.step === "exit" ? undefined : s.formula),
    };
    current.current = next;
    setSession(next);
  }, []);

  const restart = useCallback(() => {
    if (!data || data === "error") return;
    const s = begin(data, null);
    current.current = s;
    setSession(s);
  }, [data]);

  return useMemo<SpadsSession>(() => {
    if (data === "error") return { status: "error" };
    if (!session) return { status: "loading" };
    return { status: "ready", state: session.state, lines: session.lines, formula: session.formula, submit, restart };
  }, [data, session, submit, restart]);
}
