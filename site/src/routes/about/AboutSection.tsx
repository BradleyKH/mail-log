import type { ReactNode } from "react";

export default function AboutSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-mono text-xl font-semibold tracking-wide uppercase">{title}</h2>
      {children}
    </section>
  );
}
