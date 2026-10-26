import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { DocId } from "@/content/types";
import { pagePath } from "./scanUrl";

type Props = { docId: DocId; pdfPage: number; pageCount: number };

export default function PageNav({ docId, pdfPage, pageCount }: Props) {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [draft, setDraft] = useState("");
  const to = (p: number) => ({ pathname: pagePath(docId, p), search });

  const jump = (e: FormEvent) => {
    e.preventDefault();
    const n = Number(draft);
    if (Number.isInteger(n) && n >= 1 && n <= pageCount) navigate(to(n));
    setDraft("");
  };

  const arrow = cn(buttonVariants({ variant: "outline", size: "sm" }));
  return (
    <nav aria-label="Page navigation" className="flex flex-wrap items-center gap-2">
      {pdfPage > 1 ? (
        <Link to={to(pdfPage - 1)} className={arrow} rel="prev">
          <ChevronLeft /> Prev<span className="sr-only">ious page</span>
        </Link>
      ) : (
        <span className={cn(arrow, "pointer-events-none opacity-50")} aria-hidden>
          <ChevronLeft /> Prev
        </span>
      )}
      <span className="text-sm text-muted-foreground tabular-nums">
        Page {pdfPage} of {pageCount}
      </span>
      {pdfPage < pageCount ? (
        <Link to={to(pdfPage + 1)} className={arrow} rel="next">
          Next<span className="sr-only"> page</span> <ChevronRight />
        </Link>
      ) : (
        <span className={cn(arrow, "pointer-events-none opacity-50")} aria-hidden>
          Next <ChevronRight />
        </span>
      )}
      <form onSubmit={jump} className="ml-auto flex items-center gap-1">
        <Input
          type="number"
          inputMode="numeric"
          min={1}
          max={pageCount}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          aria-label="Go to page number"
          placeholder="Go to"
          className="h-8 w-20"
        />
      </form>
    </nav>
  );
}
