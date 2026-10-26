import type { ReactNode } from "react";

export default function SidebarSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-1.5">
      <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">{title}</h2>
      {children}
    </section>
  );
}
