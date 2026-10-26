export default function ExternalPopover({ name, group, callers }: { name: string; group: string | null; callers: string[] }) {
  return (
    <div className="space-y-1.5">
      <p className="font-mono text-xs tracking-wider uppercase">
        <span data-testid="map-popover-title" className="font-semibold">
          {name}
        </span>
        <span className="text-muted-foreground"> {group ? `${group} external` : "external"}</span>
      </p>
      <p className="text-xs text-muted-foreground">
        Called by {callers.length} routine{callers.length === 1 ? "" : "s"}
        {callers.length > 0 ? `: ${callers.slice(0, 6).join(", ")}${callers.length > 6 ? ", ..." : ""}` : ""}
      </p>
    </div>
  );
}
