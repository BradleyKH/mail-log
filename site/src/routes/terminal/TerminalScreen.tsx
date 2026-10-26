import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import type { OutputLine } from "@/terminal/types";
import { useTypewriter } from "./useTypewriter";

type Props = {
  lines: OutputLine[];
  baud: number;
  reducedMotion: boolean;
  /** Whether the program has logged out; typing anything starts a new session. */
  exited: boolean;
  onSubmit(input: string): void;
  ariaLabel?: string;
  /** Set when the terminal sits inside a longer page, so loading it neither focuses the input nor scrolls the page. */
  embedded?: boolean;
};

/** Visible lines for the first `shown` characters of the transcript, counting a newline per line. */
function reveal(lines: OutputLine[], shown: number): OutputLine[] {
  const out: OutputLine[] = [];
  let left = shown;
  for (const line of lines) {
    if (left <= 0) break;
    out.push(left >= line.text.length ? line : { ...line, text: line.text.slice(0, left) });
    left -= line.text.length + 1;
  }
  return out;
}

export default function TerminalScreen({ lines, baud, reducedMotion, exited, onSubmit, ariaLabel = "MAIL LOG terminal output", embedded = false }: Props) {
  const total = useMemo(() => lines.reduce((n, l) => n + l.text.length + 1, 0), [lines]);
  const { shown, printing, skip } = useTypewriter(total, reducedMotion ? 0 : baud);
  const visible = useMemo(() => reveal(lines, shown), [lines, shown]);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (embedded) {
      const log = logRef.current;
      if (log) log.scrollTop = log.scrollHeight;
      return;
    }
    endRef.current?.scrollIntoView?.({ block: "nearest" });
  }, [visible.length, shown, embedded]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (printing) {
      skip();
      return;
    }
    onSubmit(draft);
    setDraft("");
  };

  return (
    <div
      className={cn("terminal-crt relative overflow-hidden rounded-lg border-4 border-neutral-700 bg-[#0d0b07] shadow-inner has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/70", !reducedMotion && "terminal-crt-motion")}
      onClick={() => inputRef.current?.focus()}
      data-testid="terminal-screen"
    >
      <div
        className="h-[60vh] min-h-80 overflow-auto p-4 font-mono text-[13px] leading-5 text-[#ffb547] uppercase sm:text-sm"
        ref={logRef}
        role="log"
        tabIndex={0}
        aria-live="polite"
        aria-label={ariaLabel}
      >
        <div className="w-max min-w-full">
          {visible.map((line, i) => (
            <div
              key={i}
              data-kind={line.kind}
              className={cn(
                "min-h-5 whitespace-pre",
                line.kind === "echo" && "text-[#ffd79a]",
                line.kind === "hint" && "font-sans text-xs whitespace-normal text-[#9fc3a8] normal-case italic",
              )}
            >
              {line.text}
            </div>
          ))}
          {!printing && (
            <div className="flex min-h-5 whitespace-pre text-[#ffd79a]">
              <span>{draft}</span>
              <span aria-hidden className={cn("inline-block w-[1ch] bg-[#ffb547]", !reducedMotion && "terminal-cursor-blink")}>
                &nbsp;
              </span>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>
      <label className="sr-only" htmlFor="terminal-input">
        Terminal input
      </label>
      <input
        id="terminal-input"
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value.toUpperCase())}
        onKeyDown={onKeyDown}
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        autoFocus={!embedded}
        className="absolute bottom-0 left-0 h-px w-px opacity-0"
        aria-describedby="terminal-hint"
        placeholder={exited ? "Type LOGIN and your initials" : undefined}
      />
      {printing && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            skip();
            inputRef.current?.focus();
          }}
          className="absolute right-3 bottom-3 rounded border border-[#ffb547]/60 bg-black/60 px-2 py-1 font-mono text-xs text-[#ffb547] hover:bg-[#ffb547]/15"
        >
          SKIP (ENTER)
        </button>
      )}
    </div>
  );
}
