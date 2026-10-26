import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/** Temporary stand-in used by each room until that room is built. */
export default function PagePlaceholder({ title, summary, children }: { title: string; summary: string; children?: ReactNode }) {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-mono text-3xl font-semibold tracking-wide uppercase">{title}</h1>
        <p className="max-w-2xl text-muted-foreground">{summary}</p>
      </header>
      {children && (
        <Card className="bg-card [background-image:repeating-linear-gradient(to_bottom,transparent_0,transparent_27px,var(--paper-rule)_28px)]">
          <CardHeader>
            <CardTitle className="font-mono text-sm tracking-widest uppercase">Route details</CardTitle>
            <CardDescription>This room is under construction.</CardDescription>
          </CardHeader>
          <CardContent className="font-mono text-sm">{children}</CardContent>
        </Card>
      )}
    </section>
  );
}
