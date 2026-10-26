import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { Field } from "@/content/types";
import { displayText } from "@/lib/display";
import type { RecordType, StoredRecord } from "@/terminal/types";
import { formatDate, isDateField, recordTitle } from "./todayModel";

type Props = {
  record: RecordType;
  selected: StoredRecord | undefined;
  fields: Field[];
  onClose: () => void;
  onArchive: (r: StoredRecord) => void;
};

export default function RecordSheet({ record, selected, fields, onClose, onArchive }: Props) {
  const [confirming, setConfirming] = useState<string>();
  const shown = selected ? fields.filter((f) => selected.values[f.name]) : [];
  return (
    <Sheet open={!!selected} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {selected && (
          <>
            <SheetHeader>
              <SheetTitle>{displayText(recordTitle(record, selected))}</SheetTitle>
              <SheetDescription asChild>
                <div>
                  <Badge variant="secondary">
                    {selected.origin === "sample" ? `From the manual, Figure ${selected.sourceFigure ?? ""}`.trim() : "Entered this session"}
                  </Badge>
                </div>
              </SheetDescription>
            </SheetHeader>
            <dl className="grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)] gap-x-4 gap-y-2 px-4 text-sm">
              {shown.map((f) => {
                const raw = selected.values[f.name] ?? "";
                return (
                  <div key={f.name} className="contents">
                    <dt className="text-muted-foreground">{f.label}</dt>
                    <dd className="break-words font-mono">{displayText(isDateField(f.name) ? formatDate(raw) || raw : raw)}</dd>
                  </div>
                );
              })}
            </dl>
            <SheetFooter>
              {confirming === selected.id ? (
                <Button
                  variant="destructive"
                  onClick={() => {
                    onArchive(selected);
                    setConfirming(undefined);
                  }}
                >
                  Confirm archive
                </Button>
              ) : (
                <Button variant="outline" onClick={() => setConfirming(selected.id)}>
                  Archive
                </Button>
              )}
              <p className="text-xs text-muted-foreground">Archiving takes the record out of the active data base, as the Archive mode does in 1979.</p>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
