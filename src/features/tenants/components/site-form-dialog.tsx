"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Globe, KeyRound } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormInput } from "@/components/forms/form-input";
import { FormSwitch } from "@/components/forms/form-switch";
import { BaseDialog } from "@/components/ui/base-dialog";
import {
  createSiteAction,
  updateSiteAction,
} from "@/features/tenants/actions/tenants.actions";
import {
  siteFormSchema,
  type SiteFormValues,
} from "@/features/tenants/schemas/tenant.schemas";
import type { ManagedSite } from "@/features/tenants/types/tenants.types";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useServerErrors } from "@/hooks/use-server-errors";
import { queryKeys } from "@/lib/query-keys";

interface SiteFormDialogProps {
  site: ManagedSite | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SiteFormDialog({
  site,
  open,
  onOpenChange,
}: SiteFormDialogProps): React.JSX.Element {
  const methods = useForm<SiteFormValues>({
    resolver: zodResolver(siteFormSchema),
    values: {
      name: site?.name ?? "",
      slug: site?.slug ?? "",
      domain: site?.domain ?? "",
      is_active: site?.is_active ?? true,
    },
  });

  const applyServerErrors = useServerErrors(methods.setError);

  const mutation = useCrudMutation({
    mutationFn: (values: SiteFormValues) =>
      site ? updateSiteAction(site.id, values) : createSiteAction(values),
    invalidateKeys: [queryKeys.sites.all],
    onSuccess: () => {
      onOpenChange(false);
    },
    onError: (result) => {
      applyServerErrors(result.fieldErrors);
    },
  });

  const handleSubmit = methods.handleSubmit((values) => {
    mutation.mutate(values);
  });

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={site ? "Edit Unit Usaha (Tenant)" : "Tambah Unit Usaha Baru"}
      description="Konfigurasi identitas tenant, slug X-Site-Key, dan domain unit usaha."
      size="lg"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          className="space-y-4"
        >
          <FormInput<SiteFormValues>
            name="name"
            label="Nama Unit Usaha"
            placeholder="KSP Mitra Sejati Persada"
            leftIcon={<Building2 className="size-4" />}
            required
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput<SiteFormValues>
              name="slug"
              label="Slug Tenant"
              placeholder="ksp"
              helperText="Dipakai sebagai identifier X-Site-Key (opsional saat buat baru)."
            />
            <FormInput<SiteFormValues>
              name="domain"
              label="Domain"
              placeholder="ksp.mitrasova.id"
              leftIcon={<Globe className="size-4" />}
            />
          </div>

          {site?.api_key ? (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
              <KeyRound className="size-4 shrink-0 text-primary" />
              <span className="font-medium">API Key:</span>
              <code className="truncate font-mono text-[11px] font-semibold text-slate-800">
                {site.api_key}
              </code>
            </div>
          ) : null}

          <FormSwitch<SiteFormValues>
            name="is_active"
            label="Status Unit Usaha Aktif"
            description="Aktifkan tenant agar landing page publik dan portal CMS dapat diakses."
          />

          <FormDialogFooter
            onCancel={() => {
              onOpenChange(false);
            }}
            submitLabel={site ? "Simpan Perubahan" : "Simpan Tenant"}
            isSubmitting={mutation.isPending}
          />
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
