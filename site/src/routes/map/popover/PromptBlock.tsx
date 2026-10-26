import { displayText } from "@/lib/display";

/** The step's printed prompt in terminal type, as the visitor would have seen it on the CRT. */
export default function PromptBlock({ lines, max }: { lines: string[]; max?: number }) {
  const shown = max ? lines.slice(0, max) : lines;
  if (shown.length === 0) return null;
  return (
    <pre
      data-testid="map-prompt"
      tabIndex={0}
      className="overflow-x-auto rounded-sm bg-[#0d120d] px-2 py-1.5 font-mono text-[11px] leading-snug whitespace-pre text-[#9cf59c] uppercase"
    >
      {shown.map((l) => displayText(l)).join("\n")}
      {max && lines.length > max ? "\n..." : ""}
    </pre>
  );
}
