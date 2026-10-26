export const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/archive", label: "Archive", end: false },
  { to: "/terminal", label: "Terminal", end: false },
  { to: "/code", label: "Code", end: false },
  { to: "/map", label: "Map", end: false },
  { to: "/spads", label: "SPADS", end: false },
  { to: "/glossary", label: "Glossary", end: false },
  { to: "/about", label: "About", end: false },
] as const;
