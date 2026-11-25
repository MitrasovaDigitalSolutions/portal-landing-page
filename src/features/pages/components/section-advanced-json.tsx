"use client";

import * as React from "react";
import { ChevronDown, Code2, Lock, Wand2 } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { FormTextarea } from "@/components/forms/form-textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  parseSectionPayloadJson,
  type SectionFormValues,
} from "@/features/pages/schemas/page.schemas";
import {
  buildInitialPayloadValues,
  extractNonSchemaKeys,
  mergeSectionPayload,
} from "@/features/pages/utils/section-payload";
import { cn } from "@/lib/utils";
import type { SectionTypeDefinition } from "@/types/cms.types";

interface SectionAdvancedJsonProps {
  sectionType: SectionTypeDefinition | null;
  extraKeys: Record<string, unknown>;
  onExtraKeysChange: (nextExtras: Record<string, unknown>) => void;
  defaultOpen?: boolean;
}

type JsonSyncOutcome =
  | {
      ok: true;
      formatted: string;
      extraKeys: Record<string, unknown>;
      schemaPayload: Record<string, unknown>;
    }
  | { ok: false; error: string };

function resolveJsonSync(
  rawText: string,
  sectionType: SectionTypeDefinition | null
): JsonSyncOutcome {
  const parsed = parseSectionPayloadJson(rawText);
  if (!parsed.ok) {
    return { ok: false, error: parsed.error };
  }
  if (!parsed.value) {
    return {
      ok: true,
      formatted: "",
      extraKeys: {},
      schemaPayload: sectionType
        ? buildInitialPayloadValues(sectionType.fields, {})
        : {},
    };
  }
  const formatted = JSON.stringify(parsed.value, null, 2);
  if (sectionType) {
    return {
      ok: true,
      formatted,
      extraKeys: extractNonSchemaKeys(parsed.value, sectionType.fields),
      schemaPayload: buildInitialPayloadValues(sectionType.fields, parsed.value),
    };
  }
  return {
    ok: true,
    formatted,
    extraKeys: parsed.value,
    schemaPayload: {},
  };
}

export function SectionAdvancedJson({
  sectionType,
  extraKeys,
  onExtraKeysChange,
  defaultOpen = false,
}: SectionAdvancedJsonProps): React.JSX.Element {
  const [open, setOpen] = React.useState(defaultOpen);
  const isEditingRef = React.useRef(false);
  const { control, getValues, setValue, setError, clearErrors } =
    useFormContext<SectionFormValues>();

  const watchedPayload = useWatch({ control, name: "payload" });
  const extraKeyNames = Object.keys(extraKeys);
  const fields = sectionType?.fields ?? null;

  React.useEffect(() => {
    if (isEditingRef.current) return;
    const merged = mergeSectionPayload(extraKeys, watchedPayload, fields);
    const nextText = merged ? JSON.stringify(merged, null, 2) : "";
    if (getValues("payload_json") !== nextText) {
      setValue("payload_json", nextText);
    }
  }, [extraKeys, fields, getValues, setValue, watchedPayload]);

  const applySync = (rawText: string, reformat: boolean, toastErr: boolean): void => {
    const outcome = resolveJsonSync(rawText, sectionType);
    if (!outcome.ok) {
      setError("payload_json", { message: outcome.error });
      if (toastErr) toast.error(outcome.error);
      return;
    }
    clearErrors("payload_json");
    if (reformat) {
      setValue("payload_json", outcome.formatted);
    }
    onExtraKeysChange(outcome.extraKeys);
    setValue("payload", outcome.schemaPayload, { shouldDirty: true });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => {
          setOpen((prev) => !prev);
        }}
        className="flex w-full cursor-pointer items-center justify-between gap-2 px-3.5 py-2.5 text-left"
      >
        <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Code2 className="size-3.5 text-slate-500" />
          <span>Advanced (JSON)</span>
          {extraKeyNames.length > 0 ? (
            <Badge variant="secondary" className="text-[10px]">
              +{extraKeyNames.length} field warisan
            </Badge>
          ) : null}
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-slate-400 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open ? (
        <div className="space-y-3 border-t border-slate-200/80 p-3.5">
          {extraKeyNames.length > 0 ? (
            <div className="space-y-1 rounded-lg border border-slate-200 bg-white p-2.5">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                <Lock className="size-3 text-slate-400" />
                <span>Field ekstra di luar schema tetap dipertahankan:</span>
              </p>
              <div className="flex flex-wrap gap-1">
                {extraKeyNames.map((key) => (
                  <code
                    key={key}
                    className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700"
                  >
                    {key}
                  </code>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-500">
              Sinkron dua arah dengan form di atas.
            </span>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => {
                applySync(getValues("payload_json"), true, true);
              }}
              className="h-7 gap-1 rounded-lg px-2 text-[11px] font-semibold text-slate-600 hover:text-primary"
            >
              <Wand2 className="size-3" />
              <span>Rapikan &amp; Terapkan</span>
            </Button>
          </div>

          <FormTextarea<SectionFormValues>
            name="payload_json"
            placeholder={'{\n  "badge": "Layanan Kami"\n}'}
            rows={6}
            onFocus={() => {
              isEditingRef.current = true;
            }}
            onBlur={(event) => {
              isEditingRef.current = false;
              applySync(event.target.value, false, false);
            }}
            className="bg-white font-mono text-xs leading-relaxed"
          />
        </div>
      ) : null}
    </div>
  );
}
