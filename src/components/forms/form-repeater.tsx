"use client";

import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import {
  useFieldArray,
  useFormContext,
  useWatch,
  type FieldValues,
} from "react-hook-form";
import { FormRepeaterItem } from "@/components/forms/form-repeater-item";
import { getFieldError } from "@/components/forms/form-utils";
import { Button } from "@/components/ui/button";

interface FormRepeaterProps {
  name: string;
  label: string;
  addLabel?: string;
  emptyHint?: string;
  defaultItem: () => Record<string, unknown>;
  getItemTitle?: (item: Record<string, unknown>, index: number) => string;
  renderItem: (index: number, fieldPrefix: string) => ReactNode;
}

function resolveDefaultTitle(
  item: Record<string, unknown>,
  index: number,
  getItemTitle?: (item: Record<string, unknown>, index: number) => string
): string {
  if (getItemTitle) {
    return getItemTitle(item, index);
  }
  const titleVal = item.title ?? item.label ?? item.name;
  if (typeof titleVal === "string" && titleVal.trim()) {
    return titleVal.trim();
  }
  return `Item #${index + 1}`;
}

export function FormRepeater({
  name,
  label,
  addLabel = "Tambah Item",
  emptyHint = "Belum ada item. Klik tombol Tambah untuk menambahkan data.",
  defaultItem,
  getItemTitle,
  renderItem,
}: FormRepeaterProps): React.JSX.Element {
  const {
    control,
    formState: { errors },
  } = useFormContext<FieldValues>();

  const { fields, append, remove, move } = useFieldArray({ control, name });
  const watchedItems = useWatch({ control, name }) as unknown;
  const listError = getFieldError(errors, name);

  return (
    <div className="space-y-2.5 rounded-xl border border-slate-200 bg-slate-50/40 p-3.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800">{label}</span>
          <span className="rounded-md bg-slate-200/70 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 tabular-nums">
            {fields.length}
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={() => {
            append(defaultItem());
          }}
          className="h-7 gap-1 rounded-lg border-primary/30 bg-white px-2.5 text-[11px] font-semibold text-primary hover:bg-primary/5"
        >
          <Plus className="size-3.5" />
          <span>{addLabel}</span>
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-white/80 px-3 py-4 text-center text-xs text-slate-500">
          {emptyHint}
        </div>
      ) : (
        <div className="space-y-2.5">
          {fields.map((fieldEntry, idx) => {
            const rawItem = Array.isArray(watchedItems)
              ? (watchedItems[idx] as unknown)
              : undefined;
            const itemRecord =
              rawItem && typeof rawItem === "object"
                ? (rawItem as Record<string, unknown>)
                : {};
            const cardTitle = resolveDefaultTitle(itemRecord, idx, getItemTitle);

            return (
              <FormRepeaterItem
                key={fieldEntry.id}
                index={idx}
                total={fields.length}
                title={cardTitle}
                onMoveUp={() => {
                  if (idx > 0) move(idx, idx - 1);
                }}
                onMoveDown={() => {
                  if (idx < fields.length - 1) move(idx, idx + 1);
                }}
                onRemove={() => {
                  remove(idx);
                }}
              >
                {renderItem(idx, `${name}.${idx}`)}
              </FormRepeaterItem>
            );
          })}
        </div>
      )}

      {listError ? (
        <p className="text-[11px] font-medium text-rose-500">{listError}</p>
      ) : null}
    </div>
  );
}
