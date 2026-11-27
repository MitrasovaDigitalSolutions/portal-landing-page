"use client";

import { useRouter } from "next/navigation";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { saveServiceAction } from "@/features/services/actions/services.actions";
import { ServiceEditorMainFields } from "@/features/services/components/service-editor-main-fields";
import { ServiceEditorSidebar } from "@/features/services/components/service-editor-sidebar";
import { ServiceEditorToolbar } from "@/features/services/components/service-editor-toolbar";
import type { ServiceFormValues } from "@/features/services/schemas/service.schemas";
import {
  buildServiceFormData,
  getInitialServiceFormValues,
} from "@/features/services/utils/service-form";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useServerErrors } from "@/hooks/use-server-errors";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { ServiceItem, ServiceType } from "@/types/cms.types";

interface ServiceEditorFormProps {
  service: ServiceItem | null;
  types: ServiceType[];
}

export function ServiceEditorForm({
  service,
  types,
}: ServiceEditorFormProps): React.JSX.Element {
  const router = useRouter();
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";
  const isEdit = Boolean(service);

  const methods = useForm<ServiceFormValues>({
    defaultValues: getInitialServiceFormValues(service, types),
  });

  const applyServerErrors = useServerErrors(methods.setError);
  const [isActive, isFeatured] = useWatch({
    control: methods.control,
    name: ["is_active", "is_featured"],
  });

  const mutation = useCrudMutation({
    mutationFn: (values: ServiceFormValues) =>
      saveServiceAction(service?.id ?? null, buildServiceFormData(values)),
    invalidateKeys: [queryKeys.services.all(siteKey)],
    onSuccess: () => {
      router.push("/services");
    },
    onError: (result) => {
      applyServerErrors(result.fieldErrors);
    },
  });

  const handleSubmit = methods.handleSubmit((values) => {
    if (!values.name.trim()) {
      methods.setError("name", { message: "Nama layanan wajib diisi." });
      return;
    }
    if (!values.service_type_id) {
      methods.setError("service_type_id", {
        message: "Pilih tipe layanan terlebih dahulu.",
      });
      return;
    }
    if (!values.short_desc.trim()) {
      methods.setError("short_desc", {
        message: "Ringkasan singkat wajib diisi.",
      });
      return;
    }
    mutation.mutate(values);
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
        className="space-y-5"
      >
        <ServiceEditorToolbar
          isEdit={isEdit}
          isActive={isActive}
          isFeatured={isFeatured}
          isSubmitting={mutation.isPending}
        />

        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <ServiceEditorMainFields service={service} />
          <ServiceEditorSidebar service={service} types={types} />
        </div>
      </form>
    </FormProvider>
  );
}
