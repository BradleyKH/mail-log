import type { ReactNode } from "react";

export default function PanelSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-1.5">
      <h3 className="font-mono text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">{title}</h3>
      {children}
    </section>
  );
}
