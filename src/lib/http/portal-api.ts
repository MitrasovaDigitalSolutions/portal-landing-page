import { ApiError } from "@/lib/api-error";
import { getPortalSession } from "@/lib/auth/auth";
import { apiClient, type QueryParamValue } from "@/lib/http/api-client";
import { resolveActiveSiteContext } from "@/lib/tenant/active-tenant";
import type { ApiEnvelopeResult } from "@/types/http.types";

interface RequestConfig {
  query?: Record<string, QueryParamValue>;
  headers?: Record<string, string>;
  token?: string;
  siteKey?: string;
  signal?: AbortSignal;
}

async function resolveGlobalAuth(
  overrideToken?: string
): Promise<string> {
  if (overrideToken) {
    return overrideToken;
  }
  const session = await getPortalSession();
  if (!session?.accessToken) {
    throw new ApiError(401, "Sesi tidak ditemukan. Silakan login kembali.");
  }
  return session.accessToken;
}

async function resolveTenantAuth(
  config?: RequestConfig
): Promise<{ token: string; siteKey: string }> {
  const session = await getPortalSession();
  const token = config?.token ?? session?.accessToken;
  if (!token) {
    throw new ApiError(401, "Sesi tidak ditemukan. Silakan login kembali.");
  }

  let siteKey = config?.siteKey?.trim();
  if (!siteKey) {
    const context = await resolveActiveSiteContext(session);
    siteKey = context.activeSiteKey ?? undefined;
  }

  if (!siteKey) {
    throw new ApiError(
      400,
      "Tenant aktif tidak tersedia untuk akun Anda saat ini."
    );
  }

  return { token, siteKey };
}

export const portalApi = {
  async globalGet<T>(path: string, config?: RequestConfig): Promise<T> {
    const token = await resolveGlobalAuth(config?.token);
    return apiClient.get<T>(path, {
      scope: "global",
      token,
      query: config?.query,
      headers: config?.headers,
      signal: config?.signal,
    });
  },

  async globalPost<T>(
    path: string,
    body: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const token = await resolveGlobalAuth(config?.token);
    return apiClient.post<T>(path, body, {
      scope: "global",
      token,
      query: config?.query,
      headers: config?.headers,
      signal: config?.signal,
    });
  },

  async globalPut<T>(
    path: string,
    body: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const token = await resolveGlobalAuth(config?.token);
    return apiClient.put<T>(path, body, {
      scope: "global",
      token,
      query: config?.query,
      headers: config?.headers,
      signal: config?.signal,
    });
  },

  async globalDelete<T = undefined>(
    path: string,
    config?: RequestConfig
  ): Promise<T> {
    const token = await resolveGlobalAuth(config?.token);
    return apiClient.delete<T>(path, {
      scope: "global",
      token,
      query: config?.query,
      headers: config?.headers,
      signal: config?.signal,
    });
  },

  async tenantGet<T>(path: string, config?: RequestConfig): Promise<T> {
    const { token, siteKey } = await resolveTenantAuth(config);
    return apiClient.get<T>(path, {
      scope: "tenant",
      token,
      siteKey,
      query: config?.query,
      headers: config?.headers,
      signal: config?.signal,
    });
  },

  async tenantPost<T>(
    path: string,
    body: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const { token, siteKey } = await resolveTenantAuth(config);
    return apiClient.post<T>(path, body, {
      scope: "tenant",
      token,
      siteKey,
      query: config?.query,
      headers: config?.headers,
      signal: config?.signal,
    });
  },

  async tenantPostWithMeta<T>(
    path: string,
    body: unknown,
    config?: RequestConfig
  ): Promise<ApiEnvelopeResult<T>> {
    const { token, siteKey } = await resolveTenantAuth(config);
    return apiClient.postWithMeta<T>(path, body, {
      scope: "tenant",
      token,
      siteKey,
      query: config?.query,
      headers: config?.headers,
      signal: config?.signal,
    });
  },

  async tenantPut<T>(
    path: string,
    body: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const { token, siteKey } = await resolveTenantAuth(config);
    return apiClient.put<T>(path, body, {
      scope: "tenant",
      token,
      siteKey,
      query: config?.query,
      headers: config?.headers,
      signal: config?.signal,
    });
  },

  async tenantPutWithMeta<T>(
    path: string,
    body: unknown,
    config?: RequestConfig
  ): Promise<ApiEnvelopeResult<T>> {
    const { token, siteKey } = await resolveTenantAuth(config);
    return apiClient.putWithMeta<T>(path, body, {
      scope: "tenant",
      token,
      siteKey,
      query: config?.query,
      headers: config?.headers,
      signal: config?.signal,
    });
  },

  async tenantPatch<T>(
    path: string,
    body: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const { token, siteKey } = await resolveTenantAuth(config);
    return apiClient.patch<T>(path, body, {
      scope: "tenant",
      token,
      siteKey,
      query: config?.query,
      headers: config?.headers,
      signal: config?.signal,
    });
  },

  async tenantDelete<T = undefined>(
    path: string,
    config?: RequestConfig
  ): Promise<T> {
    const { token, siteKey } = await resolveTenantAuth(config);
    return apiClient.delete<T>(path, {
      scope: "tenant",
      token,
      siteKey,
      query: config?.query,
      headers: config?.headers,
      signal: config?.signal,
    });
  },
};
