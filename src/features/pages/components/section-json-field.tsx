"use client";

import { Wand2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { FormTextarea } from "@/components/forms/form-textarea";
import { Button } from "@/components/ui/button";
import { parseSectionPayloadJson } from "@/features/pages/schemas/page.schemas";

export interface SectionJsonFormShape {
  payload_json: string;
}

export function SectionJsonField(): React.JSX.Element {
  const { getValues, setValue, setError, clearErrors } =
    useFormContext<SectionJsonFormShape>();

  const handleFormat = (): void => {
    const raw = getValues("payload_json");
    if (!raw.trim()) {
      return;
    }
    const parsed = parseSectionPayloadJson(raw);
    if (!parsed.ok) {
      setError("payload_json", { message: parsed.error });
      toast.error(parsed.error);
      return;
    }
    clearErrors("payload_json");
    setValue("payload_json", JSON.stringify(parsed.value, null, 2));
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-700">
          Payload JSON Terstruktur (Opsional)
        </span>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={handleFormat}
          className="h-7 gap-1 rounded-lg px-2 text-[11px] font-semibold text-slate-600 hover:text-primary"
        >
          <Wand2 className="size-3" />
          <span>Rapikan JSON</span>
        </Button>
      </div>

      <FormTextarea<SectionJsonFormShape>
        name="payload_json"
        placeholder={'{\n  "badge": "Layanan Kami",\n  "cta_label": "Pelajari"\n}'}
        rows={6}
        className="font-mono text-xs leading-relaxed"
        helperText="Menyimpan data lanjutan seperti slides, stats, cards, visi/misi, items, posts, atau maps_embed."
      />
    </div>
  );
}
