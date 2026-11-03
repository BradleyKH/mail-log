import type { ReactNode } from "react";
import { CircleHelp } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Props = { children: ReactNode; help: ReactNode };

/** The line under a terminal naming what the current step expects, with a help popover on how to drive the terminal. */
export default function TerminalHint({ children, help }: Props) {
  return (
    <div className="flex items-start gap-2 text-sm text-muted-foreground">
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="How to use the terminal"
            className="mt-0.5 shrink-0 rounded-full hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <CircleHelp className="size-4" aria-hidden />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-80 space-y-2 text-sm">
          {help}
        </PopoverContent>
      </Popover>
      <p id="terminal-hint" data-testid="terminal-hint">
        {children}
      </p>
    </div>
  );
}
