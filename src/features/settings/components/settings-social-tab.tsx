"use client";

import { FormInput } from "@/components/forms/form-input";
import type { SettingsFormValues } from "@/features/settings/schemas/settings.schema";

export function SettingsSocialTab(): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormInput<SettingsFormValues>
        name="instagram"
        label="Instagram URL"
        placeholder="https://instagram.com/mitrasova"
      />
      <FormInput<SettingsFormValues>
        name="facebook"
        label="Facebook URL"
        placeholder="https://facebook.com/mitrasova"
      />
      <FormInput<SettingsFormValues>
        name="linkedin"
        label="LinkedIn URL"
        placeholder="https://linkedin.com/company/mitrasova"
      />
      <FormInput<SettingsFormValues>
        name="tiktok"
        label="TikTok URL"
        placeholder="https://tiktok.com/@mitrasova"
      />
    </div>
  );
}
