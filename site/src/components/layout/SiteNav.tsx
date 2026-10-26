import { NavLink } from "react-router";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./navItems";

export default function SiteNav({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  return (
    <nav aria-label="Main" className={className}>
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "rounded-sm px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
              isActive && "bg-secondary text-foreground underline decoration-primary decoration-2 underline-offset-[6px]",
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
