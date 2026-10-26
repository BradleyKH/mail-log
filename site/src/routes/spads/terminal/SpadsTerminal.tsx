import { useState } from "react";
import BaudControl from "@/routes/terminal/BaudControl";
import TerminalScreen from "@/routes/terminal/TerminalScreen";
import { usePrefersReducedMotion } from "@/routes/terminal/usePrefersReducedMotion";
import SpadsHood from "./SpadsHood";
import { inputHint, screenOf } from "./spadsHints";
import { useSpadsSession } from "./useSpadsSession";
import "@/routes/terminal/terminal.css";

export default function SpadsTerminal() {
  const session = useSpadsSession();
  const reducedMotion = usePrefersReducedMotion();
  const [baud, setBaud] = useState(1200);

  if (session.status !== "ready") {
    return (
      <p className="text-sm text-muted-foreground" role="status" data-testid="spads-terminal-status">
        {session.status === "loading" ? "Loading the Contract Analysis program..." : "The Contract Analysis data could not be loaded. Reload the page to try again."}
      </p>
    );
  }

  const { state, lines, formula, submit, restart } = session;
  const exited = state.step === "exit";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="min-w-0 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <BaudControl value={reducedMotion ? 0 : baud} onChange={setBaud} disabled={reducedMotion} />
          <button type="button" onClick={restart} className="rounded border px-2 py-0.5 text-xs hover:bg-accent">
            Start over
          </button>
        </div>
        <TerminalScreen
          lines={lines}
          baud={baud}
          reducedMotion={reducedMotion}
          exited={exited}
          onSubmit={submit}
          ariaLabel="SPADS Contract Analysis terminal output"
          embedded
        />
        <p id="terminal-hint" className="text-sm text-muted-foreground" data-testid="terminal-hint">
          Expected: {inputHint(state)}.
        </p>
      </div>
      <SpadsHood screen={screenOf(state)} formula={formula} />
    </div>
  );
}
