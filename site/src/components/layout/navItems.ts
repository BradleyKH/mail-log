export type NavLeaf = { to: string; label: string; end: boolean };
export type NavItem = NavLeaf & { children?: readonly NavLeaf[] };

export const SPADS_PAGES: readonly NavLeaf[] = [
  { to: "/spads", label: "What SPADS Became", end: true },
  { to: "/spads/mail-log", label: "MAIL LOG in 1985", end: true },
  { to: "/spads/terminal", label: "Contract Analysis Terminal", end: true },
  { to: "/spads/spread-reports", label: "Month Spread and Reports", end: true },
];

export const NAV_ITEMS: readonly NavItem[] = [
  { to: "/", label: "Home", end: true },
  { to: "/terminal", label: "Terminal", end: false },
  { to: "/map", label: "Logic Map", end: false },
  { to: "/code", label: "Code", end: false },
  { to: "/reports", label: "Reports", end: false },
  { to: "/spads", label: "SPADS", end: false, children: SPADS_PAGES },
  { to: "/about", label: "About", end: false },
];
