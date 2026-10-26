import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { createEngine } from "@/terminal/engine";
import { browserEnv, isRecordType } from "@/terminal/programData";
import type { EngineResult, EngineState, OutputLine, RecordType } from "@/terminal/types";

/** Enough scrollback for several long listings without the page growing without bound. */
const MAX_LINES = 600;

const env = browserEnv();
const engine = createEngine(env);

function begin(record: RecordType, step: number | undefined): EngineResult {
  return step === undefined ? engine.start(record) : engine.goTo(record, step);
}

const keyOf = (s: EngineState) => `${s.record}:${s.step}`;

/** Runs one terminal session and keeps `record` and `step` in the URL as the visitor moves. */
export function useTerminalSession() {
  const [params, setParams] = useSearchParams();
  const paramRecord = params.get("record");
  const record: RecordType = isRecordType(paramRecord) ? paramRecord : "correspondence";
  const rawStep = params.get("step");
  const paramStep = rawStep && /^\d+$/.test(rawStep) ? Number(rawStep) : undefined;

  const [session, setSession] = useState(() => {
    const r = begin(record, paramStep);
    return { state: r.state, lines: r.output };
  });
  const syncedKey = useRef(keyOf(session.state));
  // The engine writes entered records to the shared store, so it must run once per submit, outside any state updater (StrictMode runs updaters twice).
  const current = useRef(session);
  current.current = session;

  // A link elsewhere on the site can change the URL while the Terminal is open; follow it.
  useEffect(() => {
    const wanted = `${record}:${paramStep ?? "start"}`;
    if (paramStep === undefined || wanted === syncedKey.current) return;
    const r = begin(record, paramStep);
    syncedKey.current = keyOf(r.state);
    setSession({ state: r.state, lines: r.output });
  }, [record, paramStep]);

  useEffect(() => {
    const key = keyOf(session.state);
    if (key === syncedKey.current && params.get("step") !== null) return;
    syncedKey.current = key;
    setParams(
      (p) => {
        const next = new URLSearchParams(p);
        next.set("record", session.state.record);
        if (session.state.step === "exit") next.delete("step");
        else next.set("step", String(session.state.step));
        return next;
      },
      { replace: true },
    );
  }, [session.state, params, setParams]);

  const submit = useCallback((input: string) => {
    const s = current.current;
    const r = engine.submit(s.state, input);
    const lines: OutputLine[] = [...s.lines, ...r.output];
    const next = { state: r.state, lines: lines.length > MAX_LINES ? lines.slice(-MAX_LINES) : lines };
    current.current = next;
    setSession(next);
  }, []);

  const restart = useCallback(() => {
    const r = engine.start(session.state.record);
    setSession({ state: r.state, lines: r.output });
  }, [session.state.record]);

  return useMemo(() => ({ state: session.state, lines: session.lines, submit, restart, env }), [session, submit, restart]);
}
