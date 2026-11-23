import { revalidatePath } from "next/cache";
import { ApiError } from "@/lib/api-error";
import { getPortalSession } from "@/lib/auth/auth";
import { resolveActiveSiteContext } from "@/lib/tenant/active-tenant";
import type { ActionResult } from "@/types/http.types";

export interface TenantActionContext {
  accessToken: string;
  siteKey: string;
  isSuperadmin: boolean;
}

export interface GlobalActionContext {
  accessToken: string;
  isSuperadmin: boolean;
}

export function toActionError<T = undefined>(error: unknown): ActionResult<T> {
  if (ApiError.isApiError(error)) {
    return {
      success: false,
      message: error.message,
      fieldErrors: error.fieldErrors,
      status: error.status,
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: false,
    message: "Terjadi kesalahan sistem yang tidak diketahui.",
  };
}

export async function withTenantAction<T>(
  handler: (ctx: TenantActionContext) => Promise<ActionResult<T>>
): Promise<ActionResult<T>> {
  try {
    const session = await getPortalSession();
    if (!session?.accessToken) {
      return {
        success: false,
        message: "Sesi login tidak ditemukan atau telah berakhir.",
        status: 401,
      };
    }

    const context = await resolveActiveSiteContext(session);
    if (!context.activeSiteKey) {
      return {
        success: false,
        message: "Tenant aktif tidak tersedia. Pilih atau buat tenant terlebih dahulu.",
        status: 400,
      };
    }

    return await handler({
      accessToken: session.accessToken,
      siteKey: context.activeSiteKey,
      isSuperadmin: session.user.is_superadmin,
    });
  } catch (error) {
    return toActionError<T>(error);
  }
}

export async function withSuperadminAction<T>(
  handler: (ctx: GlobalActionContext) => Promise<ActionResult<T>>
): Promise<ActionResult<T>> {
  try {
    const session = await getPortalSession();
    if (!session?.accessToken) {
      return {
        success: false,
        message: "Sesi login tidak ditemukan atau telah berakhir.",
        status: 401,
      };
    }

    if (!session.user.is_superadmin) {
      return {
        success: false,
        message: "Akses ditolak. Fitur ini khusus untuk Superadmin.",
        status: 403,
      };
    }

    return await handler({
      accessToken: session.accessToken,
      isSuperadmin: true,
    });
  } catch (error) {
    return toActionError<T>(error);
  }
}

export function revalidatePortalPaths(paths: readonly string[]): void {
  for (const path of paths) {
    revalidatePath(path);
  }
}
