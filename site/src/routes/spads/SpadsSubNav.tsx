import { NavLink } from "react-router";
import { SPADS_PAGES } from "@/components/layout/navItems";
import { cn } from "@/lib/utils";

export default function SpadsSubNav() {
  return (
    <nav aria-label="SPADS pages">
      <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-sm">
        {SPADS_PAGES.map((page) => (
          <li key={page.to}>
            <NavLink
              to={page.to}
              end={page.end}
              className={({ isActive }) =>
                cn(
                  "underline underline-offset-4 hover:text-foreground",
                  isActive ? "font-semibold text-foreground decoration-primary decoration-2" : "text-muted-foreground",
                )
              }
            >
              {page.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
