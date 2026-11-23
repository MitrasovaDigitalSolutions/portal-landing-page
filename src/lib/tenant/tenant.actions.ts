"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getPortalSession } from "@/lib/auth/auth";
import {
  ACTIVE_SITE_COOKIE_NAME,
  getAvailableSitesForSession,
} from "@/lib/tenant/active-tenant";
import type { ActionResult } from "@/types/http.types";

export async function switchActiveSiteAction(
  siteSlug: string
): Promise<ActionResult<{ siteKey: string }>> {
  const normalizedSlug = siteSlug.trim();
  if (!normalizedSlug) {
    return {
      success: false,
      message: "Tenant tujuan tidak valid.",
    };
  }

  const session = await getPortalSession();
  if (!session?.accessToken) {
    return {
      success: false,
      message: "Sesi berakhir. Silakan login kembali.",
      status: 401,
    };
  }

  const availableSites = await getAvailableSitesForSession(session);
  const target = availableSites.find((site) => site.slug === normalizedSlug);

  if (!target) {
    return {
      success: false,
      message: "Anda tidak memiliki izin akses untuk tenant tersebut.",
      status: 403,
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_SITE_COOKIE_NAME, target.slug, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });

  revalidatePath("/", "layout");

  return {
    success: true,
    data: { siteKey: target.slug },
    message: `Berhasil beralih ke ${target.name}.`,
  };
}
