"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, Mail, MessageCircle, Phone } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormInputOption } from "@/components/forms/form-input-option";
import { FormTextarea } from "@/components/forms/form-textarea";
import { BaseDialog } from "@/components/ui/base-dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { updateInquiryStatusAction } from "@/features/inquiries/actions/inquiries.actions";
import {
  inquiryStatusSchema,
  type InquiryStatusValues,
} from "@/features/inquiries/schemas/inquiry.schemas";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { InquiryItem } from "@/types/cms.types";
import { resolveMediaUrl } from "@/utils/media";

interface InquiryReplyDialogProps {
  inquiry: InquiryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STATUS_OPTIONS = [
  { value: "new", label: "Baru (New)" },
  { value: "contacted", label: "Sudah Dihubungi (Contacted)" },
  { value: "closed", label: "Selesai / Ditutup (Closed)" },
];

export function InquiryReplyDialog({
  inquiry,
  open,
  onOpenChange,
}: InquiryReplyDialogProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";

  const methods = useForm<InquiryStatusValues>({
    resolver: zodResolver(inquiryStatusSchema),
    values: {
      status: inquiry?.status ?? "contacted",
      notes: inquiry?.notes ?? "",
    },
  });

  const mutation = useCrudMutation({
    mutationFn: async (values: InquiryStatusValues) => {
      if (!inquiry) {
        return { success: false, message: "Pesan masuk tidak ditemukan." };
      }
      return updateInquiryStatusAction(inquiry.id, values);
    },
    invalidateKeys: [queryKeys.contacts.all(siteKey)],
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  const cleanWa = inquiry?.phone.replace(/[^0-9]/g, "") ?? "";
  const attachmentHref =
    resolveMediaUrl(inquiry?.attachment_url) ?? inquiry?.attachment_url;

  const handleSubmit = methods.handleSubmit((values) => {
    mutation.mutate(values);
  });

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Detail & Tindak Lanjut Pesan"
      description="Tinjau pesan pengirim dan perbarui status tindak lanjut."
      size="xl"
      headerRight={inquiry ? <StatusBadge status={inquiry.status} /> : undefined}
    >
      {inquiry ? (
        <div className="space-y-4">
          <div className="space-y-2.5 rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-bold text-slate-900">
                {inquiry.name}
              </span>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Phone className="size-3 text-slate-400" />
                  {inquiry.phone}
                </span>
                {inquiry.email ? (
                  <span className="inline-flex items-center gap-1">
                    <Mail className="size-3 text-slate-400" />
                    {inquiry.email}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="font-semibold text-slate-700">
              Subjek: {inquiry.subject ?? "Konsultasi Layanan"}
            </div>
            <p className="whitespace-pre-wrap leading-relaxed text-slate-600">
              {inquiry.message}
            </p>
            {attachmentHref ? (
              <a
                href={attachmentHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 pt-1 text-xs font-semibold text-primary underline"
              >
                <span>Buka Berkas Lampiran</span>
                <ExternalLink className="size-3" />
              </a>
            ) : null}
          </div>

          {cleanWa ? (
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`https://wa.me/${cleanWa}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              >
                <MessageCircle className="size-3.5" />
                <span>Hubungi Pengirim via WhatsApp</span>
              </a>
            </div>
          ) : null}

          <FormProvider {...methods}>
            <form
              onSubmit={(event) => {
                void handleSubmit(event);
              }}
              className="space-y-4 border-t border-slate-100 pt-4"
            >
              <FormInputOption<InquiryStatusValues>
                name="status"
                label="Status Penanganan"
                searchable={false}
                options={STATUS_OPTIONS}
              />

              <FormTextarea<InquiryStatusValues>
                name="notes"
                label="Catatan Internal Admin"
                placeholder="Catat hasil tindak lanjut atau kesepakatan konsultasi..."
                rows={3}
              />

              <FormDialogFooter
                onCancel={() => {
                  onOpenChange(false);
                }}
                cancelLabel="Tutup"
                submitLabel="Simpan Status & Catatan"
                isSubmitting={mutation.isPending}
              />
            </form>
          </FormProvider>
        </div>
      ) : null}
    </BaseDialog>
  );
}
