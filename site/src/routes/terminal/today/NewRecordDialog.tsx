import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Field, Flow } from "@/content/types";
import type { RecordType, StoredRecord } from "@/terminal/types";
import RecordFormField from "./RecordFormField";
import { RECORD_LABELS, checkField, formFields, requiredField, stampCorrespondence, toStoredValues, type DrawingKind } from "./todayModel";
import { env } from "./useRecords";

type Props = {
  record: RecordType;
  fields: Field[];
  flow: Flow | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (r: StoredRecord, note: string) => void;
};

export default function NewRecordDialog({ record, fields, flow, open, onOpenChange, onCreated }: Props) {
  const [kind, setKind] = useState<DrawingKind>("drawing");
  const [form, setForm] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const shown = useMemo(() => formFields(fields, record, kind), [fields, record, kind]);
  const required = requiredField(record, kind);
  const errors = useMemo(() => {
    const out: Record<string, string> = {};
    for (const f of shown) {
      const problem = checkField(flow, record, f, form[f.name] ?? "");
      if (problem) out[f.name] = problem;
      else if (submitted && f.name === required && !(form[f.name] ?? "").trim()) out[f.name] = "Required";
    }
    return out;
  }, [shown, flow, record, form, submitted, required]);

  const reset = () => {
    setForm({});
    setSubmitted(false);
    setKind("drawing");
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!(form[required] ?? "").trim() || Object.keys(errors).length > 0) return;
    let values = toStoredValues(shown, form);
    if (record === "drawing-eo" && kind === "drawing" && !values.sheetNumber) values = { ...values, sheetNumber: "1" };
    let note = "Saved. The 1979 view finds it too.";
    if (record === "correspondence") {
      const stamped = stampCorrespondence(values, env.store.list(record), new Date());
      values = stamped.values;
      note = `Saved. Its input date-code in the 1979 view is ${stamped.dateCode}.`;
    }
    const saved = env.store.add(record, values);
    reset();
    onOpenChange(false);
    onCreated(saved, note);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>New {RECORD_LABELS[record].singular}</DialogTitle>
          <DialogDescription>
            The items and their limits come from the 1979 field layout. Entries are stored in capitals, as the terminal stores them.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} noValidate className="space-y-4">
          {record === "drawing-eo" && (
            <ToggleGroup
              type="single"
              variant="outline"
              value={kind}
              onValueChange={(v) => v && setKind(v as DrawingKind)}
              aria-label="Kind of record"
            >
              <ToggleGroupItem value="drawing">Drawing sheet</ToggleGroupItem>
              <ToggleGroupItem value="eo">Engineering order</ToggleGroupItem>
            </ToggleGroup>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            {shown.map((f) => (
              <RecordFormField
                key={f.name}
                field={f}
                value={form[f.name] ?? ""}
                error={errors[f.name]}
                required={f.name === required}
                onChange={(v) => setForm((s) => ({ ...s, [f.name]: v }))}
              />
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save record</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
