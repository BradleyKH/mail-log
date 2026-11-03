import { useState } from "react";
import { findStep } from "@/terminal/engine";
import { inputHint } from "@/terminal/hints";
import BaudControl from "./BaudControl";
import TerminalHint from "./TerminalHint";
import TerminalScreen from "./TerminalScreen";
import UnderTheHood from "./UnderTheHood";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import { useTerminalSession } from "./useTerminalSession";
import "./terminal.css";

const HELP = (
  <>
    <p>Click the screen and type, then press Enter. Entries are not case sensitive.</p>
    <p>
      Start with <span className="font-mono">LOGIN</span> and your initials, such as <span className="font-mono">LOGIN DKH</span>. Then pick a
      data base (COR, DIR, or DRAW) and a mode: INP to file a record, REV to revise one, SEA to search, ARC to archive.
    </p>
    <p>The line beside this icon names what the current step expects. The panel beside the terminal shows the manual&apos;s text for the step and the FORTRAN behind it.</p>
  </>
);

export default function RetroTerminal() {
  const { state, lines, submit, restart, env } = useTerminalSession();
  const reducedMotion = usePrefersReducedMotion();
  const [baud, setBaud] = useState(1200);
  const flow = env.data.flows[state.record];
  const step = state.step === "exit" ? undefined : findStep(flow, state.step);
  const hint = step ? inputHint(state.record, step) : "Type LOGIN and your initials to start again";

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <BaudControl value={reducedMotion ? 0 : baud} onChange={setBaud} disabled={reducedMotion} />
            <button type="button" onClick={restart} className="rounded border px-2 py-0.5 text-xs hover:bg-accent">
              Start over
            </button>
          </div>
          <TerminalScreen lines={lines} baud={baud} reducedMotion={reducedMotion} exited={state.step === "exit"} onSubmit={submit} />
          <TerminalHint help={HELP}>{hint ? `Expected: ${hint}.` : "Press Enter to continue."}</TerminalHint>
        </div>
        <UnderTheHood record={state.record} step={step} recordTitle={flow?.title ?? state.record} />
      </div>
    </div>
  );
}
