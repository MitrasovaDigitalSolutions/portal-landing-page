"use client";

import { useFormContext } from "react-hook-form";
import { FormInput } from "@/components/forms/form-input";

const SECTION_KEY_PRESETS = [
  "hero",
  "featured",
  "sejarah",
  "visi-misi",
  "strategi",
  "program",
  "office",
  "instagram",
  "cta",
];

interface SectionKeyFieldProps {
  showPresets: boolean;
}

export function SectionKeyField({
  showPresets,
}: SectionKeyFieldProps): React.JSX.Element {
  const { setValue } = useFormContext<{ key: string }>();

  return (
    <div className="space-y-2 sm:col-span-2">
      <FormInput<{ key: string }>
        name="key"
        label="Key Section"
        placeholder="Contoh: hero, sejarah, visi-misi, cta"
        maxLength={50}
        required
      />

      {showPresets ? (
        <div className="flex flex-wrap gap-1.5">
          {SECTION_KEY_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setValue("key", preset, { shouldValidate: true });
              }}
              className="cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-600 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
            >
              {preset}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
