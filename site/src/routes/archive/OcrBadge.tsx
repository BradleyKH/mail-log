import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const NOTES = {
  ocr: "Read by machine from the scan, which is the original.",
  ai: "Transcribed from the scan by an AI model and checked against the printout's own totals.",
} as const;

const LABELS = { ocr: "OCR text", ai: "AI transcription" } as const;

/** Marks text that didn't come from a reviewer, so readers trust the scan over it. */
export default function OcrBadge({ source }: { source: "ocr" | "reviewed" | "ai" }) {
  if (source === "reviewed") return <Badge variant="secondary">Reviewed text</Badge>;
  return (
    <span className="inline-flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="rounded-full focus-visible:ring-2 focus-visible:ring-ring">
            <Badge variant="outline">{LABELS[source]}</Badge>
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">{NOTES[source]}</TooltipContent>
      </Tooltip>
      {/* Touch screens have no hover, so the sentence also stays visible at small widths. */}
      <span className="text-xs text-muted-foreground sm:sr-only">{NOTES[source]}</span>
    </span>
  );
}
