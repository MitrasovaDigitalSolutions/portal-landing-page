"use server";

import { revalidatePortalPaths, withTenantAction } from "@/lib/actions/action-runner";
import { inquiriesRepository } from "@/features/inquiries/repositories/inquiries.repository";
import {
  inquiryStatusSchema,
  type InquiryStatusValues,
} from "@/features/inquiries/schemas/inquiry.schemas";
import type { InquiryItem } from "@/types/cms.types";
import type { ActionResult } from "@/types/http.types";
import { extractZodFieldErrors } from "@/utils/zod-errors";

export async function updateInquiryStatusAction(
  id: number,
  values: InquiryStatusValues
): Promise<ActionResult<InquiryItem>> {
  const parsed = inquiryStatusSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: "Status tindak lanjut tidak valid.",
      fieldErrors: extractZodFieldErrors(parsed.error),
    };
  }

  return withTenantAction(async ({ siteKey }) => {
    const trimmedNotes = parsed.data.notes?.trim() ?? "";
    const data = await inquiriesRepository.updateStatus(
      id,
      {
        status: parsed.data.status,
        notes: trimmedNotes.length > 0 ? trimmedNotes : null,
      },
      siteKey
    );

    revalidatePortalPaths(["/inquiries", "/"]);
    return {
      success: true,
      data,
      message: "Status dan catatan pesan masuk berhasil diperbarui.",
    };
  });
}

export async function deleteInquiryAction(id: number): Promise<ActionResult> {
  return withTenantAction(async ({ siteKey }) => {
    await inquiriesRepository.delete(id, siteKey);
    revalidatePortalPaths(["/inquiries", "/"]);
    return {
      success: true,
      data: undefined,
      message: "Pesan masuk berhasil dihapus.",
    };
  });
}
