"use server";

import {
  revalidatePortalPaths,
  withSuperadminAction,
} from "@/lib/actions/action-runner";
import { tenantsRepository } from "@/features/tenants/repositories/tenants.repository";
import {
  assignUserSiteSchema,
  createUserSchema,
  siteFormSchema,
  updateUserSchema,
  type AssignUserSiteValues,
  type SiteFormValues,
  type UserFormValues,
} from "@/features/tenants/schemas/tenant.schemas";
import type {
  ManagedSite,
  ManagedUser,
  UpsertSitePayload,
  UpsertUserPayload,
} from "@/features/tenants/types/tenants.types";
import type { ActionResult } from "@/types/http.types";
import { extractZodFieldErrors } from "@/utils/zod-errors";

function toSitePayload(values: SiteFormValues): UpsertSitePayload {
  return {
    name: values.name,
    ...(values.slug ? { slug: values.slug } : {}),
    ...(values.domain ? { domain: values.domain } : {}),
    is_active: values.is_active,
  };
}

export async function createSiteAction(
  values: SiteFormValues
): Promise<ActionResult<ManagedSite>> {
  const parsed = siteFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: "Data unit usaha belum valid.",
      fieldErrors: extractZodFieldErrors(parsed.error),
    };
  }

  return withSuperadminAction(async ({ accessToken }) => {
    const data = await tenantsRepository.createSite(
      toSitePayload(parsed.data),
      accessToken
    );
    revalidatePortalPaths(["/sites", "/users", "/"]);
    return {
      success: true,
      data,
      message: "Unit usaha baru berhasil ditambahkan.",
    };
  });
}

export async function updateSiteAction(
  id: string,
  values: SiteFormValues
): Promise<ActionResult<ManagedSite>> {
  const parsed = siteFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: "Data unit usaha belum valid.",
      fieldErrors: extractZodFieldErrors(parsed.error),
    };
  }

  return withSuperadminAction(async ({ accessToken }) => {
    const data = await tenantsRepository.updateSite(
      id,
      toSitePayload(parsed.data),
      accessToken
    );
    revalidatePortalPaths(["/sites", "/users", "/"]);
    return {
      success: true,
      data,
      message: "Konfigurasi unit usaha berhasil diperbarui.",
    };
  });
}

export async function deleteSiteAction(
  id: string
): Promise<ActionResult> {
  return withSuperadminAction(async ({ accessToken }) => {
    await tenantsRepository.deleteSite(id, accessToken);
    revalidatePortalPaths(["/sites", "/users", "/"]);
    return {
      success: true,
      data: undefined,
      message: "Unit usaha berhasil dihapus.",
    };
  });
}

export async function createUserAction(
  values: UserFormValues
): Promise<ActionResult<ManagedUser>> {
  const parsed = createUserSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: "Data pengguna belum valid.",
      fieldErrors: extractZodFieldErrors(parsed.error),
    };
  }

  return withSuperadminAction(async ({ accessToken }) => {
    const data = await tenantsRepository.createUser(parsed.data, accessToken);
    revalidatePortalPaths(["/users", "/sites"]);
    return {
      success: true,
      data,
      message: "Pengguna admin baru berhasil ditambahkan.",
    };
  });
}

export async function updateUserAction(
  id: number,
  values: UserFormValues
): Promise<ActionResult<ManagedUser>> {
  const parsed = updateUserSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: "Data pengguna belum valid.",
      fieldErrors: extractZodFieldErrors(parsed.error),
    };
  }

  return withSuperadminAction(async ({ accessToken }) => {
    const payload: UpsertUserPayload = {
      name: parsed.data.name,
      email: parsed.data.email,
      is_superadmin: parsed.data.is_superadmin,
      ...(parsed.data.password ? { password: parsed.data.password } : {}),
    };
    const data = await tenantsRepository.updateUser(id, payload, accessToken);
    revalidatePortalPaths(["/users", "/sites"]);
    return {
      success: true,
      data,
      message: "Profil pengguna berhasil diperbarui.",
    };
  });
}

export async function assignUserToSiteAction(
  userId: number,
  values: AssignUserSiteValues
): Promise<ActionResult> {
  const parsed = assignUserSiteSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: "Pilih tenant dan role akses terlebih dahulu.",
      fieldErrors: extractZodFieldErrors(parsed.error),
    };
  }

  return withSuperadminAction(async ({ accessToken }) => {
    await tenantsRepository.assignUserToSite(
      parsed.data.site_id,
      { user_id: userId, role: parsed.data.role },
      accessToken
    );
    revalidatePortalPaths(["/users", "/sites", "/"]);
    return {
      success: true,
      data: undefined,
      message: "Penugasan tenant berhasil disimpan.",
    };
  });
}

export async function detachUserFromSiteAction(
  siteId: string,
  userId: number
): Promise<ActionResult> {
  return withSuperadminAction(async ({ accessToken }) => {
    await tenantsRepository.detachUserFromSite(siteId, userId, accessToken);
    revalidatePortalPaths(["/users", "/sites", "/"]);
    return {
      success: true,
      data: undefined,
      message: "Akses tenant pengguna berhasil dicabut.",
    };
  });
}
