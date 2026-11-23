"use client";

import { FormSwitch } from "@/components/forms/form-switch";
import {
  TENANT_MODULE_DEFINITIONS,
  type TenantModuleKey,
} from "@/config/modules";
import type { SettingsFormValues } from "@/features/settings/schemas/settings.schema";

const MODULE_FIELD_MAP: Record<TenantModuleKey, keyof SettingsFormValues> = {
  services: "modules_services",
  portfolios: "modules_portfolios",
  business_units: "modules_business_units",
  branches: "modules_branches",
  careers: "modules_careers",
  news: "modules_news",
  contact: "modules_contact",
};

export function SettingsModulesTab(): React.JSX.Element {
  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">
        Nonaktifkan modul jika fitur tersebut belum atau tidak digunakan pada
        website publik tenant ini.
      </p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {TENANT_MODULE_DEFINITIONS.map((moduleDef) => (
          <FormSwitch<SettingsFormValues>
            key={moduleDef.key}
            name={MODULE_FIELD_MAP[moduleDef.key]}
            label={moduleDef.label}
            description={moduleDef.description}
          />
        ))}
      </div>
    </div>
  );
}
