"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import {
  extractModulesState,
  isTenantModuleActive,
  resolveModuleKeyByPageSlug,
} from "@/config/modules";
import { saveSettingsAction } from "@/features/settings/actions/settings.actions";
import {
  SERVICES_LAYOUT_VALUES,
  settingsFormSchema,
  type ServicesLayoutOption,
  type SettingsFormValues,
} from "@/features/settings/schemas/settings.schema";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useServerErrors } from "@/hooks/use-server-errors";
import { queryKeys } from "@/lib/query-keys";
import type { PageSummary, SiteSettingsMap } from "@/types/cms.types";

function readSettingText(
  group: Record<string, unknown> | undefined,
  key: string,
  fallback = ""
): string {
  const val = group?.[key];
  return typeof val === "string" ? val : fallback;
}

function readSettingBoolean(
  group: Record<string, unknown> | undefined,
  key: string,
  fallback = true
): boolean {
  const val = group?.[key];
  if (typeof val === "boolean") {
    return val;
  }
  if (typeof val === "string") {
    return val !== "false";
  }
  return fallback;
}

function readServicesLayout(
  group: Record<string, unknown> | undefined
): ServicesLayoutOption {
  const val = group?.layout;
  if (
    typeof val === "string" &&
    SERVICES_LAYOUT_VALUES.includes(val as ServicesLayoutOption)
  ) {
    return val as ServicesLayoutOption;
  }
  return "accordion";
}

function buildExtraPagesInitialState(
  pages: PageSummary[]
): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  for (const page of pages) {
    if (
      page.slug.trim().toLowerCase() !== "home" &&
      resolveModuleKeyByPageSlug(page.slug) === null
    ) {
      result[String(page.id)] = page.is_active;
    }
  }
  return result;
}

function buildInitialValues(
  settings: SiteSettingsMap,
  pages: PageSummary[]
): SettingsFormValues {
  const general = settings.general;
  const legal = settings.legal;
  const contact = settings.contact;
  const social = settings.social;
  const seo = settings.seo;
  const modules = extractModulesState(settings);

  return {
    logo: null,
    site_title: readSettingText(general, "site_title"),
    tagline: readSettingText(general, "tagline"),
    meta_keywords: readSettingText(general, "meta_keywords"),
    brand_color: readSettingText(general, "brand_color", "#1E3A8A"),
    badan_hukum: readSettingText(legal, "badan_hukum"),
    copyright: readSettingText(legal, "copyright"),
    phone: readSettingText(contact, "phone"),
    whatsapp: readSettingText(contact, "whatsapp"),
    email: readSettingText(contact, "email"),
    address: readSettingText(contact, "address"),
    maps_embed:
      readSettingText(contact, "maps_embed") ||
      readSettingText(contact, "maps_embed_url"),
    instagram: readSettingText(social, "instagram"),
    facebook: readSettingText(social, "facebook"),
    linkedin: readSettingText(social, "linkedin"),
    tiktok: readSettingText(social, "tiktok"),
    modules_services: isTenantModuleActive(modules, "services"),
    modules_portfolios: isTenantModuleActive(modules, "portfolios"),
    modules_business_units: isTenantModuleActive(modules, "business_units"),
    modules_branches: isTenantModuleActive(modules, "branches"),
    modules_careers: isTenantModuleActive(modules, "careers"),
    modules_news: isTenantModuleActive(modules, "news"),
    modules_contact: isTenantModuleActive(modules, "contact"),
    extra_pages_active: buildExtraPagesInitialState(pages),
    seo_meta_title: readSettingText(seo, "meta_title"),
    seo_meta_description: readSettingText(seo, "meta_description"),
    seo_alternate_names: readSettingText(seo, "alternate_names"),
    seo_canonical_domain: readSettingText(seo, "canonical_domain"),
    seo_schema_type:
      readSettingText(seo, "schema_type", "Organization") || "Organization",
    seo_google_verification: readSettingText(seo, "google_verification"),
    seo_robots_index: readSettingBoolean(seo, "robots_index", true),
    services_layout: readServicesLayout(settings.services),
  };
}

export interface UseSettingsFormReturn {
  methods: UseFormReturn<SettingsFormValues>;
  isSaving: boolean;
  logoUrl: string | undefined;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
}

export function useSettingsForm(
  initialSettings: SiteSettingsMap,
  pages: PageSummary[],
  siteKey: string
): UseSettingsFormReturn {
  const initialValues = useMemo(
    () => buildInitialValues(initialSettings, pages),
    [initialSettings, pages]
  );

  const methods = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    values: initialValues,
  });

  const applyServerErrors = useServerErrors(methods.setError);

  const mutation = useCrudMutation({
    mutationFn: (values: SettingsFormValues) => {
      const { logo, ...jsonValues } = values;
      if (logo instanceof File) {
        const logoFormData = new FormData();
        logoFormData.append("logo", logo);
        return saveSettingsAction(jsonValues, logoFormData);
      }
      return saveSettingsAction(jsonValues);
    },
    invalidateKeys: [queryKeys.settings.all(siteKey), queryKeys.pages.all(siteKey)],
    onSuccess: () => {
      methods.setValue("logo", null);
    },
    onError: (result) => {
      applyServerErrors(result.fieldErrors);
    },
  });

  const onSubmit = methods.handleSubmit((values) => {
    mutation.mutate(values);
  });

  const rawLogo =
    readSettingText(initialSettings.general, "logo_url").trim() ||
    readSettingText(initialSettings.general, "logo_path").trim();
  const logoUrl = rawLogo.length > 0 ? rawLogo : undefined;

  return {
    methods,
    isSaving: mutation.isPending,
    logoUrl,
    onSubmit,
  };
}
