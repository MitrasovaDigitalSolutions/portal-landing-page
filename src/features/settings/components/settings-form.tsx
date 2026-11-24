"use client";

import {
  Building2,
  LayoutGrid,
  Loader2,
  PhoneCall,
  Save,
  Search,
  Share2,
  SlidersHorizontal,
} from "lucide-react";
import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsContactTab } from "@/features/settings/components/settings-contact-tab";
import { SettingsDisplayTab } from "@/features/settings/components/settings-display-tab";
import { SettingsGeneralTab } from "@/features/settings/components/settings-general-tab";
import { SettingsModulesTab } from "@/features/settings/components/settings-modules-tab";
import { SettingsSeoTab } from "@/features/settings/components/settings-seo-tab";
import { SettingsSocialTab } from "@/features/settings/components/settings-social-tab";
import { useSettingsForm } from "@/features/settings/hooks/use-settings-form";
import type { SiteSettingsMap } from "@/types/cms.types";

interface SettingsFormProps {
  initialSettings: SiteSettingsMap;
  siteKey: string;
}

export function SettingsForm({
  initialSettings,
  siteKey,
}: SettingsFormProps): React.JSX.Element {
  const { methods, isSaving, logoUrl, onSubmit } = useSettingsForm(
    initialSettings,
    siteKey
  );

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(event) => {
          void onSubmit(event);
        }}
        className="space-y-6 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-6"
      >
        <Tabs defaultValue="general" className="space-y-5">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-xl border border-slate-200 bg-slate-100/80 p-1 sm:w-fit">
            <TabsTrigger value="general" className="gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold">
              <Building2 className="size-3.5" />
              <span>Identitas & Branding</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold">
              <PhoneCall className="size-3.5" />
              <span>Kontak & Lokasi</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold">
              <Share2 className="size-3.5" />
              <span>Media Sosial</span>
            </TabsTrigger>
            <TabsTrigger value="seo" className="gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold">
              <Search className="size-3.5" />
              <span>SEO & Pencarian</span>
            </TabsTrigger>
            <TabsTrigger value="modules" className="gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold">
              <SlidersHorizontal className="size-3.5" />
              <span>Visibilitas Modul</span>
            </TabsTrigger>
            <TabsTrigger value="display" className="gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold">
              <LayoutGrid className="size-3.5" />
              <span>Tampilan Layanan</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-0">
            <SettingsGeneralTab logoUrl={logoUrl} />
          </TabsContent>

          <TabsContent value="contact" className="mt-0">
            <SettingsContactTab />
          </TabsContent>

          <TabsContent value="social" className="mt-0">
            <SettingsSocialTab />
          </TabsContent>

          <TabsContent value="seo" className="mt-0">
            <SettingsSeoTab />
          </TabsContent>

          <TabsContent value="modules" className="mt-0">
            <SettingsModulesTab />
          </TabsContent>

          <TabsContent value="display" className="mt-0">
            <SettingsDisplayTab />
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-end border-t border-slate-100 pt-4">
          <Button
            type="submit"
            disabled={isSaving}
            className="h-10 gap-2 rounded-xl px-6 text-xs font-semibold shadow-xs"
          >
            {isSaving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            <span>
              {isSaving ? "Menyimpan Pengaturan..." : "Simpan Semua Pengaturan"}
            </span>
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
