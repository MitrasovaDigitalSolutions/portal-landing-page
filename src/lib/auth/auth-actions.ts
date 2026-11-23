"use server";

import { cookies } from "next/headers";
import { getPortalSession, signOut } from "@/lib/auth/auth";
import { apiClient } from "@/lib/http/api-client";
import { ACTIVE_SITE_COOKIE_NAME } from "@/lib/tenant/active-tenant";

export async function logoutPortalAction(): Promise<void> {
  const session = await getPortalSession();

  if (session?.accessToken) {
    try {
      await apiClient.post("/auth/logout", undefined, {
        scope: "global",
        token: session.accessToken,
      });
    } catch {
      // Ignore upstream errors so local session termination always succeeds.
    }
  }

  const cookieStore = await cookies();
  cookieStore.delete(ACTIVE_SITE_COOKIE_NAME);

  await signOut({ redirectTo: "/login" });
}
