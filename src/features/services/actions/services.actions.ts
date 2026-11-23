"use server";

import { revalidatePortalPaths, withTenantAction } from "@/lib/actions/action-runner";
import {
  servicesRepository,
  type UpsertServiceTypePayload,
} from "@/features/services/repositories/services.repository";
import {
  serviceTypeSchema,
  type ServiceTypeFormValues,
} from "@/features/services/schemas/service.schemas";
import type { ServiceItem, ServiceType } from "@/types/cms.types";
import type { ActionResult } from "@/types/http.types";
import { readFormString } from "@/utils/form-data";
import { extractZodFieldErrors } from "@/utils/zod-errors";

function toTypePayload(
  values: ServiceTypeFormValues
): UpsertServiceTypePayload {
  return {
    name: values.name,
    ...(values.slug ? { slug: values.slug } : {}),
    description: values.description || null,
    icon: values.icon || null,
    order: values.order,
  };
}

export async function saveServiceTypeAction(
  id: number | null,
  values: ServiceTypeFormValues
): Promise<ActionResult<ServiceType>> {
  const parsed = serviceTypeSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: "Data tipe layanan belum valid.",
      fieldErrors: extractZodFieldErrors(parsed.error),
    };
  }

  return withTenantAction(async ({ siteKey }) => {
    const payload = toTypePayload(parsed.data);
    const data = id
      ? await servicesRepository.updateType(id, payload, siteKey)
      : await servicesRepository.createType(payload, siteKey);

    revalidatePortalPaths(["/services", "/portfolios", "/"]);
    return {
      success: true,
      data,
      message: id
        ? "Tipe layanan berhasil diperbarui."
        : "Tipe layanan baru berhasil ditambahkan.",
    };
  });
}

export async function deleteServiceTypeAction(id: number): Promise<ActionResult> {
  return withTenantAction(async ({ siteKey }) => {
    await servicesRepository.deleteType(id, siteKey);
    revalidatePortalPaths(["/services", "/portfolios", "/"]);
    return {
      success: true,
      data: undefined,
      message: "Tipe layanan berhasil dihapus.",
    };
  });
}

export async function saveServiceAction(
  id: number | null,
  formData: FormData
): Promise<ActionResult<ServiceItem>> {
  const name = readFormString(formData, "name");
  const serviceTypeId = readFormString(formData, "service_type_id");
  const shortDesc = readFormString(formData, "short_desc");
  const body = readFormString(formData, "body");

  if (!name || !serviceTypeId || !shortDesc || !body) {
    return {
      success: false,
      message:
        "Nama layanan, tipe layanan, ringkasan singkat, dan deskripsi lengkap wajib diisi.",
    };
  }

  return withTenantAction(async ({ siteKey }) => {
    const data = id
      ? await servicesRepository.updateService(id, formData, siteKey)
      : await servicesRepository.createService(formData, siteKey);

    revalidatePortalPaths(["/services", "/"]);
    return {
      success: true,
      data,
      message: id
        ? "Layanan berhasil diperbarui."
        : "Layanan baru berhasil ditambahkan.",
    };
  });
}

export async function deleteServiceAction(id: number): Promise<ActionResult> {
  return withTenantAction(async ({ siteKey }) => {
    await servicesRepository.deleteService(id, siteKey);
    revalidatePortalPaths(["/services", "/"]);
    return {
      success: true,
      data: undefined,
      message: "Layanan berhasil dihapus.",
    };
  });
}
