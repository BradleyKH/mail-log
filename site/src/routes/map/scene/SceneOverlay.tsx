import type { CodeIndex, Flow, RecordType } from "@/content/types";
import { cn } from "@/lib/utils";
import type { ClusterLabel, MapNode, NodeGroup } from "../graph/types";
import NodePopover from "../popover/NodePopover";
import { anchorRef, type AnchorRegistry } from "./anchors";

interface Props {
  registry: AnchorRegistry;
  labels: ClusterLabel[];
  hidden: Set<NodeGroup>;
  popoverNode: MapNode | null;
  flows: Partial<Record<RecordType, Flow>>;
  index: CodeIndex | null;
  record: RecordType;
}

const anchored = "absolute top-0 left-0 invisible will-change-transform";

/** Cluster labels and the node popover, drawn as page DOM over the canvas so they stay crisp and accessible. */
export default function SceneOverlay({ registry, labels, hidden, popoverNode, flows, index, record }: Props) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-live="polite">
      {labels
        .filter((l) => !hidden.has(l.group))
        .map((l) => (
          <div key={l.id} ref={anchorRef(registry, l.id, l.position)} className={anchored} aria-hidden>
            <span
              className={cn(
                "inline-block -translate-x-1/2 -translate-y-1/2 font-mono whitespace-nowrap uppercase select-none",
                l.minor
                  ? "text-[10px] tracking-wider text-muted-foreground"
                  : "rounded-sm bg-background/75 px-1.5 py-0.5 text-xs font-semibold tracking-widest text-foreground",
              )}
            >
              {l.text}
            </span>
          </div>
        ))}
      {popoverNode && !hidden.has(popoverNode.group) && (
        <div
          key={popoverNode.id}
          ref={anchorRef(registry, "popover", [popoverNode.position[0], popoverNode.position[1] + popoverNode.size * 1.6 + 0.4, popoverNode.position[2]])}
          className={cn(anchored, "z-10")}
        >
          <div className="-translate-x-1/2 -translate-y-full pb-1">
            <NodePopover node={popoverNode} flows={flows} index={index} record={record} />
          </div>
        </div>
      )}
    </div>
  );
}
