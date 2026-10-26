import type { ReactNode } from "react";
import { Link } from "react-router";

export default function PanelLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="text-sm text-primary underline-offset-4 hover:underline">
      {children}
    </Link>
  );
}
