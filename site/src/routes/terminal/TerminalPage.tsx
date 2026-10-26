import { useSearchParams } from "react-router";
import RetroTerminal from "./RetroTerminal";
import TodayView from "./today/TodayView";
import ViewToggle from "./ViewToggle";

export default function TerminalPage() {
  const [params] = useSearchParams();
  const view = params.get("view") === "today" ? "today" : "1979";

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">Terminal</h1>
          <ViewToggle view={view} />
        </div>
        {view === "1979" ? (
          <p className="max-w-3xl text-muted-foreground">
            MAIL LOG as it ran in 1979, driven step by step by its own operating manual. Log in with your initials, enter MAIL, and pick a
            data base: COR for daily correspondence, DIR for reports, DRAW for drawings and engineering orders. This is the original; Today
            runs the same program logic behind a modern face.
          </p>
        ) : (
          <p className="max-w-3xl text-muted-foreground" data-testid="today-caption">
            The same MAIL LOG, dressed for today. It runs the program logic from the 1979 manual: the same field layouts, input rules, and
            records. Anything you file here is in the 1979 terminal too, and the other way around. 1979 is the original.
          </p>
        )}
      </header>
      {view === "1979" ? <RetroTerminal /> : <TodayView />}
    </div>
  );
}
