export default function HomeHero() {
  const cover = `${import.meta.env.BASE_URL}scans/cr-159065/page-001.webp`;
  return (
    <section className="grid items-center gap-8 md:grid-cols-[1fr_320px]">
      <header className="space-y-4">
        <p className="font-mono text-sm tracking-widest text-muted-foreground uppercase">For Danny K. Harris</p>
        <h1 className="font-mono text-4xl font-semibold tracking-wide uppercase sm:text-5xl">MAIL LOG</h1>
        <p className="text-lg">
          A records-tracking program Danny K. Harris wrote in FORTRAN for NASA&apos;s Scout Project Office in 1979, and SPADS, the
          office data system it was part of. This site brings back the program&apos;s original NASA reports: every page readable and
          searchable, the program running again in a terminal, and its source code traced routine by routine.
        </p>
        <p className="font-mono text-sm text-muted-foreground">
          Vought Corporation, Hampton Technical Center, for NASA Langley Research Center, May 1979.
        </p>
      </header>
      <img
        src={cover}
        width={1087}
        height={1400}
        alt="Cover of NASA Contractor Report CR-159065, MAIL LOG Program Operating Instructions, by Danny K. Harris, Vought Corporation, May 1979"
        className="mx-auto w-full max-w-xs rounded-sm border border-border shadow-lg"
      />
    </section>
  );
}
