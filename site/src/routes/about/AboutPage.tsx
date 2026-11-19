import AboutProgrammer from "./AboutProgrammer";
import AboutReports from "./AboutReports";
import AboutScout from "./AboutScout";

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-2">
        <h1 className="font-mono text-3xl font-semibold tracking-wide uppercase">About</h1>
        <p className="text-muted-foreground">The programmer, the seven reports, and the rocket they served.</p>
      </header>
      <AboutProgrammer />
      <AboutReports />
      <AboutScout />
    </div>
  );
}
