import { NavLink } from "react-router";
import NavDropdown from "./NavDropdown";
import NavGroup from "./NavGroup";
import { navLinkClass } from "./navLinkClass";
import { NAV_ITEMS } from "./navItems";

/** `stacked` is the mobile sheet layout: groups list their pages inline instead of opening a dropdown. */
export default function SiteNav({ className, onNavigate, stacked = false }: { className?: string; onNavigate?: () => void; stacked?: boolean }) {
  return (
    <nav aria-label="Main" className={className}>
      {NAV_ITEMS.map((item) => {
        if (item.children) {
          return stacked ? (
            <NavGroup key={item.to} item={item} pages={item.children} onNavigate={onNavigate} />
          ) : (
            <NavDropdown key={item.to} item={item} pages={item.children} />
          );
        }
        return (
          <NavLink key={item.to} to={item.to} end={item.end} onClick={onNavigate} className={({ isActive }) => navLinkClass(isActive)}>
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}
