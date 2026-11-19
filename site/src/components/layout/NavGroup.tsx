import { NavLink } from "react-router";
import { cn } from "@/lib/utils";
import { navLinkClass } from "./navLinkClass";
import type { NavLeaf } from "./navItems";

export default function NavGroup({ item, pages, onNavigate }: { item: NavLeaf; pages: readonly NavLeaf[]; onNavigate?: () => void }) {
  return (
    <div role="group" aria-label={item.label} className="flex flex-col gap-1">
      <span className="px-3 pt-1.5 text-sm font-medium text-muted-foreground">{item.label}</span>
      {pages.map((page) => (
        <NavLink
          key={page.to}
          to={page.to}
          end={page.end}
          onClick={onNavigate}
          className={({ isActive }) => cn(navLinkClass(isActive), "ml-3")}
        >
          {page.label}
        </NavLink>
      ))}
    </div>
  );
}
