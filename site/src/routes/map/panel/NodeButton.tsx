import type { ReactNode } from "react";

/** Selects another node on the map without leaving the page. */
export default function NodeButton({ onClick, children, title }: { onClick: () => void; children: ReactNode; title?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="rounded-sm border bg-background px-1.5 py-0.5 font-mono text-xs hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {children}
    </button>
  );
}
