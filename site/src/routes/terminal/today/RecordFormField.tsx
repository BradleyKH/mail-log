import { Input } from "@/components/ui/input";
import type { Field } from "@/content/types";
import { fieldMax, isDateField } from "./todayModel";

type Props = { field: Field; value: string; error: string | undefined; required: boolean; onChange: (v: string) => void };

export default function RecordFormField({ field, value, error, required, onChange }: Props) {
  const id = `field-${field.name}`;
  const date = isDateField(field.name);
  const describedBy = [date && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium">
        {field.label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <Input
        id={id}
        type={date ? "date" : "text"}
        value={value}
        min={date ? "1970-01-01" : undefined}
        max={date ? "2069-12-31" : undefined}
        maxLength={date ? undefined : fieldMax(field)}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        onChange={(e) => onChange(e.target.value)}
        className={date ? "" : "font-mono uppercase"}
      />
      {date && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          Saved as MMDDYY, as in 1979; two-digit years read as 1970 to 2069.
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
