import { cache } from "react";
import type { Session } from "next-auth";
import { cookies } from "next/headers";
import { apiClient } from "@/lib/http/api-client";
import type { AuthSiteSummary } from "@/types/auth.types";

export const ACTIVE_SITE_COOKIE_NAME = "active_site_key";

interface AdminSiteSummaryDto {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
}

export interface ActiveSiteContext {
  availableSites: AuthSiteSummary[];
  activeSite: AuthSiteSummary | null;
  activeSiteKey: string | null;
  needsCookieSync: boolean;
}

export const getAvailableSitesForSession = cache(
  async (session: Session | null): Promise<AuthSiteSummary[]> => {
    if (!session?.accessToken) {
      return [];
    }

    if (!session.user.is_superadmin) {
      return session.user.sites;
    }

    try {
      const allSites = await apiClient.get<AdminSiteSummaryDto[]>(
        "/admin/sites",
        {
          scope: "global",
          token: session.accessToken,
        }
      );

      const activeSites: AuthSiteSummary[] = allSites
        .filter((site) => site.is_active)
        .map((site) => ({
          id: site.id,
          name: site.name,
          slug: site.slug,
          role: "admin",
        }));

      return activeSites.length > 0 ? activeSites : session.user.sites;
    } catch {
      return session.user.sites;
    }
  }
);

export const getStoredSiteKeyCookie = cache(
  async (): Promise<string | null> => {
    const store = await cookies();
    const value = store.get(ACTIVE_SITE_COOKIE_NAME)?.value.trim();
    return value && value.length > 0 ? value : null;
  }
);

export const resolveActiveSiteContext = cache(
  async (session: Session | null): Promise<ActiveSiteContext> => {
    const [availableSites, cookieKey] = await Promise.all([
      getAvailableSitesForSession(session),
      getStoredSiteKeyCookie(),
    ]);

    if (availableSites.length === 0) {
      return {
        availableSites: [],
        activeSite: null,
        activeSiteKey: null,
        needsCookieSync: false,
      };
    }

    const matched = cookieKey
      ? availableSites.find((site) => site.slug === cookieKey)
      : undefined;

    if (matched) {
      return {
        availableSites,
        activeSite: matched,
        activeSiteKey: matched.slug,
        needsCookieSync: false,
      };
    }

    const fallback = availableSites[0];
    return {
      availableSites,
      activeSite: fallback,
      activeSiteKey: fallback.slug,
      needsCookieSync: true,
    };
  }
);
