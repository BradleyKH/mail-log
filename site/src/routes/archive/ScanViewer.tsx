import { useRef, useState, type PointerEvent } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const ZOOMS = [1, 1.5, 2, 3, 4];

type Props = { src: string; alt: string; tall?: boolean };

/** The original scan with zoom buttons, double-click zoom, and drag to pan. */
export default function ScanViewer({ src, alt, tall }: Props) {
  const [zoom, setZoom] = useState(0);
  const frame = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null);

  const step = (d: number) => setZoom((z) => Math.min(ZOOMS.length - 1, Math.max(0, z + d)));

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (zoom === 0 || !frame.current) return;
    drag.current = { x: e.clientX, y: e.clientY, left: frame.current.scrollLeft, top: frame.current.scrollTop };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !frame.current) return;
    frame.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
    frame.current.scrollTop = drag.current.top - (e.clientY - drag.current.y);
  };

  return (
    <div className="space-y-2" data-slot="scan-viewer">
      <div className="flex items-center gap-1">
        <Button type="button" variant="outline" size="icon-sm" aria-label="Zoom out" disabled={zoom === 0} onClick={() => step(-1)}>
          <Minus />
        </Button>
        <Button type="button" variant="outline" size="icon-sm" aria-label="Zoom in" disabled={zoom === ZOOMS.length - 1} onClick={() => step(1)}>
          <Plus />
        </Button>
        <Button type="button" variant="outline" size="icon-sm" aria-label="Fit to width" disabled={zoom === 0} onClick={() => setZoom(0)}>
          <RotateCcw />
        </Button>
        <span className="ml-1 text-xs text-muted-foreground tabular-nums" aria-live="polite">
          {Math.round(ZOOMS[zoom] * 100)}%
        </span>
        <a href={src} target="_blank" rel="noreferrer" className="ml-auto text-xs text-primary underline-offset-2 hover:underline">
          Open full size
        </a>
      </div>
      <div
        ref={frame}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
        onDoubleClick={() => setZoom((z) => (z === 0 ? 2 : 0))}
        className={`overflow-auto rounded-md border bg-muted ${tall ? "max-h-[85svh]" : "max-h-[75svh]"} ${zoom > 0 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"}`}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{ width: `${ZOOMS[zoom] * 100}%`, maxWidth: "none" }}
          className="block h-auto select-none"
        />
      </div>
    </div>
  );
}
