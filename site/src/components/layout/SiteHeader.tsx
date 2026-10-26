import { Link } from "react-router";
import HeaderSearchLink from "./HeaderSearchLink";
import MobileNav from "./MobileNav";
import SiteNav from "./SiteNav";
import ThemeToggle from "./ThemeToggle";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-double border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4">
        <MobileNav />
        <Link to="/" className="mr-4 flex items-baseline gap-2">
          <span className="font-mono text-lg font-semibold tracking-[0.2em]">MAIL LOG</span>
          <span className="hidden font-mono text-xs text-muted-foreground sm:inline">1979</span>
        </Link>
        <SiteNav className="hidden flex-1 items-center gap-1 md:flex" />
        <div className="ml-auto flex items-center md:ml-0">
          <HeaderSearchLink />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
