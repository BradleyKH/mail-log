import { Link } from "react-router";

const SECTIONS = [
  { to: "/archive", name: "Archive", blurb: "All seven reports, searchable, with each page's text beside the original scan." },
  { to: "/terminal", name: "Terminal", blurb: "Run MAIL LOG the way the 1979 manual describes it, one step at a time." },
  { to: "/code", name: "Code", blurb: "His FORTRAN, routine by routine, beside the printed listings." },
  { to: "/map", name: "Map", blurb: "The program's steps and its real call graph, in three dimensions." },
  {
    to: "/spads",
    name: "SPADS",
    blurb: "Six years on: what SPADS had become by 1985, with its Contract Analysis program running in a terminal of its own.",
  },
] as const;

export default function HomeSections() {
  return (
    <section aria-label="Explore" className="space-y-4">
      <h2 className="font-mono text-xl font-semibold tracking-wide uppercase">Explore</h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((d) => (
          <li key={d.to}>
            <Link
              to={d.to}
              className="block h-full rounded-md border border-border p-4 transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <span className="font-mono text-lg font-semibold uppercase">{d.name}</span>
              <span className="mt-2 block text-sm text-muted-foreground">{d.blurb}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
