import { NavLink, useMatch } from "react-router";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { navLinkClass } from "./navLinkClass";
import type { NavLeaf } from "./navItems";

export default function NavDropdown({ item, pages }: { item: NavLeaf; pages: readonly NavLeaf[] }) {
  const active = useMatch({ path: item.to, end: false }) !== null;
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className={cn(navLinkClass(active), "inline-flex items-center gap-1 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50")}>
        {item.label}
        <ChevronDown aria-hidden className="size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-56">
        {pages.map((page) => (
          <DropdownMenuItem key={page.to} asChild>
            <NavLink to={page.to} end={page.end} className={({ isActive }) => cn("cursor-pointer", isActive && "font-semibold text-foreground")}>
              {page.label}
            </NavLink>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
