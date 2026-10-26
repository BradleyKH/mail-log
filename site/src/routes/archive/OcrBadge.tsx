import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const AI_NOTE = "Transcribed from the scan by an AI model and checked against the printout's own totals.";

/** Marks text that came straight from the scanner's character recognition, so readers trust the scan over it. */
export default function OcrBadge({ source }: { source: "ocr" | "reviewed" | "ai" }) {
  if (source === "reviewed") return <Badge variant="secondary">Reviewed text</Badge>;
  if (source === "ai") {
    return (
      <span className="inline-flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" className="rounded-full focus-visible:ring-2 focus-visible:ring-ring">
              <Badge variant="outline">AI transcription</Badge>
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">{AI_NOTE}</TooltipContent>
        </Tooltip>
        {/* Touch screens have no hover, so the sentence also stays visible at small widths. */}
        <span className="text-xs text-muted-foreground sm:sr-only">{AI_NOTE}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2">
      <Badge variant="outline">OCR text</Badge>
      <span className="text-xs text-muted-foreground">Read by machine from the scan, which is the original.</span>
    </span>
  );
}
