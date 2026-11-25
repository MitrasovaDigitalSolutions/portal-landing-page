import { env } from "@/config/env";
import { ApiError } from "@/lib/api-error";
import type { ApiEnvelopeResult, ApiResponse } from "@/types/http.types";

export type ApiScope = "global" | "tenant";

export type QueryParamValue = string | number | boolean | null | undefined;

export interface ApiRequestOptions {
  scope: ApiScope;
  token?: string | null;
  siteKey?: string | null;
  query?: Record<string, QueryParamValue>;
  headers?: Record<string, string>;
  cache?: RequestCache;
  signal?: AbortSignal;
}

function buildRequestUrl(
  path: string,
  query?: Record<string, QueryParamValue>
): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${env.NEXT_PUBLIC_API_URL}${normalizedPath}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

function buildHeaders(
  options: ApiRequestOptions,
  hasJsonBody: boolean
): Headers {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (hasJsonBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  if (options.scope === "tenant") {
    const siteKey = options.siteKey?.trim();
    if (!siteKey) {
      throw new ApiError(400, "Tenant aktif belum dipilih.");
    }
    headers.set("X-Site-Key", siteKey);
  }

  return headers;
}

function parseJsonSafely(rawText: string): unknown {
  if (!rawText.trim()) {
    return null;
  }
  try {
    return JSON.parse(rawText) as unknown;
  } catch {
    return { message: rawText };
  }
}

function unwrapPayload(status: number, payload: unknown): unknown {
  if (
    payload &&
    typeof payload === "object" &&
    "success" in payload &&
    "data" in payload
  ) {
    const wrapped = payload as Partial<ApiResponse<unknown>>;
    if (wrapped.success === false) {
      throw ApiError.fromPayload(status || 400, payload);
    }
    if (wrapped.data !== undefined) {
      return wrapped.data;
    }
  }
  return payload;
}

function unwrapEnvelope<T>(
  status: number,
  payload: unknown
): ApiEnvelopeResult<T> {
  if (payload && typeof payload === "object") {
    const wrapped = payload as Partial<ApiResponse<unknown>>;
    if (wrapped.success === false) {
      throw ApiError.fromPayload(status || 400, payload);
    }
    const rawWarnings: unknown = wrapped.warnings;
    const warnings = Array.isArray(rawWarnings)
      ? rawWarnings.filter((w): w is string => typeof w === "string" && w.length > 0)
      : [];
    const data = (
      wrapped.data !== undefined ? wrapped.data : payload
    ) as T;
    return {
      data,
      warnings,
      message: typeof wrapped.message === "string" ? wrapped.message : undefined,
    };
  }
  return {
    data: payload as T,
    warnings: [],
  };
}

async function performFetch(
  method: string,
  path: string,
  body: unknown,
  options: ApiRequestOptions
): Promise<{ status: number; payload: unknown }> {
  const isFormData = body instanceof FormData;
  const hasJsonBody = body !== undefined && !isFormData;
  const headers = buildHeaders(options, hasJsonBody);
  const url = buildRequestUrl(path, options.query);

  let effectiveMethod = method;
  if ((method === "PUT" || method === "PATCH") && isFormData) {
    effectiveMethod = "POST";
    headers.set("X-HTTP-Method-Override", method);
    if (!body.has("_method")) {
      body.append("_method", method);
    }
  }

  let serializedBody: BodyInit | undefined;
  if (isFormData) {
    serializedBody = body;
  } else if (hasJsonBody) {
    serializedBody = JSON.stringify(body);
  }

  const response = await fetch(url, {
    method: effectiveMethod,
    headers,
    body: serializedBody,
    cache: options.cache ?? "no-store",
    signal: options.signal,
  });

  const rawText = response.status === 204 ? "" : await response.text();
  const payload = parseJsonSafely(rawText);

  if (!response.ok) {
    throw ApiError.fromPayload(response.status, payload);
  }

  return { status: response.status, payload };
}

async function executeRequest<T>(
  method: string,
  path: string,
  body: unknown,
  options: ApiRequestOptions
): Promise<T> {
  const { status, payload } = await performFetch(method, path, body, options);
  return unwrapPayload(status, payload) as T;
}

async function executeEnvelopeRequest<T>(
  method: string,
  path: string,
  body: unknown,
  options: ApiRequestOptions
): Promise<ApiEnvelopeResult<T>> {
  const { status, payload } = await performFetch(method, path, body, options);
  return unwrapEnvelope<T>(status, payload);
}

export const apiClient = {
  get<T>(path: string, options: ApiRequestOptions): Promise<T> {
    return executeRequest<T>("GET", path, undefined, options);
  },

  post<T>(
    path: string,
    body: unknown,
    options: ApiRequestOptions
  ): Promise<T> {
    return executeRequest<T>("POST", path, body, options);
  },

  postWithMeta<T>(
    path: string,
    body: unknown,
    options: ApiRequestOptions
  ): Promise<ApiEnvelopeResult<T>> {
    return executeEnvelopeRequest<T>("POST", path, body, options);
  },

  put<T>(
    path: string,
    body: unknown,
    options: ApiRequestOptions
  ): Promise<T> {
    return executeRequest<T>("PUT", path, body, options);
  },

  putWithMeta<T>(
    path: string,
    body: unknown,
    options: ApiRequestOptions
  ): Promise<ApiEnvelopeResult<T>> {
    return executeEnvelopeRequest<T>("PUT", path, body, options);
  },

  patch<T>(
    path: string,
    body: unknown,
    options: ApiRequestOptions
  ): Promise<T> {
    return executeRequest<T>("PATCH", path, body, options);
  },

  delete<T = undefined>(
    path: string,
    options: ApiRequestOptions
  ): Promise<T> {
    return executeRequest<T>("DELETE", path, undefined, options);
  },
};
