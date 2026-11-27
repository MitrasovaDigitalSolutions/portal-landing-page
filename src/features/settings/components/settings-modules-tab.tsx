"use client";

import Link from "next/link";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import {
  findLinkedPageForModule,
  resolveModuleKeyByPageSlug,
  TENANT_MODULE_DEFINITIONS,
  type TenantModuleKey,
} from "@/config/modules";
import type { SettingsFormValues } from "@/features/settings/schemas/settings.schema";
import type { PageSummary } from "@/types/cms.types";

interface SettingsModulesTabProps {
  pages: PageSummary[];
}

type ModuleFieldName =
  | "modules_services"
  | "modules_portfolios"
  | "modules_business_units"
  | "modules_branches"
  | "modules_careers"
  | "modules_news"
  | "modules_contact";

type ExtraPageFieldName = `extra_pages_active.${string}`;
type VisibilityFieldName = ModuleFieldName | ExtraPageFieldName;

interface VisibilityToggleItem {
  id: string;
  fieldName: VisibilityFieldName;
  label: string;
  description: string;
  linkedPage: PageSummary | null;
}

const MODULE_FIELD_MAP: Record<TenantModuleKey, ModuleFieldName> = {
  services: "modules_services",
  portfolios: "modules_portfolios",
  business_units: "modules_business_units",
  branches: "modules_branches",
  careers: "modules_careers",
  news: "modules_news",
  contact: "modules_contact",
};

const MODULE_FIELD_NAMES: ModuleFieldName[] = [
  "modules_services",
  "modules_portfolios",
  "modules_business_units",
  "modules_branches",
  "modules_careers",
  "modules_news",
  "modules_contact",
];

function buildVisibilityItems(pages: PageSummary[]): VisibilityToggleItem[] {
  const coreItems: VisibilityToggleItem[] = TENANT_MODULE_DEFINITIONS.map(
    (moduleDef) => ({
      id: `module-${moduleDef.key}`,
      fieldName: MODULE_FIELD_MAP[moduleDef.key],
      label: moduleDef.label,
      description: moduleDef.description,
      linkedPage: findLinkedPageForModule(pages, moduleDef.key),
    })
  );

  const extraItems: VisibilityToggleItem[] = pages
    .filter(
      (page) =>
        page.slug.trim().toLowerCase() !== "home" &&
        resolveModuleKeyByPageSlug(page.slug) === null
    )
    .map((page) => {
      const trimmedMeta = page.meta_title?.trim() ?? "";
      return {
        id: `page-${page.id}`,
        fieldName: `extra_pages_active.${page.id}`,
        label: page.title,
        description:
          trimmedMeta.length > 0
            ? trimmedMeta
            : "Halaman khusus di navigasi website.",
        linkedPage: page,
      };
    });

  return [...coreItems, ...extraItems];
}

export function SettingsModulesTab({
  pages,
}: SettingsModulesTabProps): React.JSX.Element {
  const { control } = useFormContext<SettingsFormValues>();
  const watchedModules = useWatch({
    control,
    name: MODULE_FIELD_NAMES,
  });
  const watchedExtraPages = useWatch({
    control,
    name: "extra_pages_active",
  });

  const items = buildVisibilityItems(pages);
  const activeCount =
    watchedModules.filter(Boolean).length +
    Object.values(watchedExtraPages).filter(Boolean).length;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 px-0.5">
        <p className="text-xs text-slate-500">
          Atur modul dan halaman website yang tampil di situs publik. Perubahan
          otomatis disinkronkan saat disimpan.
        </p>
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
          {activeCount}/{items.length} aktif
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 transition-colors hover:border-slate-300"
          >
            <div className="min-w-0 flex-1">
              <label
                htmlFor={item.fieldName}
                className="mr-1.5 cursor-pointer text-xs font-semibold text-slate-800"
              >
                {item.label}
              </label>
              {item.linkedPage ? (
                <Link
                  href={`/pages/${item.linkedPage.id}`}
                  className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 align-middle font-mono text-[10px] font-medium text-slate-600 transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  /{item.linkedPage.slug} ↗
                </Link>
              ) : null}
              <p className="mt-0.5 truncate text-[11px] text-slate-500">
                {item.description}
              </p>
            </div>

            <Controller
              control={control}
              name={item.fieldName}
              render={({ field }) => (
                <Switch
                  id={item.fieldName}
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                  }}
                />
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
