import AboutHowMade from "./AboutHowMade";
import AboutProgrammer from "./AboutProgrammer";
import AboutReports from "./AboutReports";
import AboutScout from "./AboutScout";
import AboutSpads from "./AboutSpads";

export default function AboutPage() {
  return (
    <div className="max-w-3xl space-y-12">
      <header className="space-y-2">
        <h1 className="font-mono text-3xl font-semibold tracking-wide uppercase">About</h1>
        <p className="text-muted-foreground">The programmer, the Scout Project Office and its SPADS system, and how the 1979 and 1985 reports came back to life.</p>
      </header>
      <AboutProgrammer />
      <AboutSpads />
      <AboutReports />
      <AboutScout />
      <AboutHowMade />
    </div>
  );
}
