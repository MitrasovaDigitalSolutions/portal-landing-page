import type { PaginatedResponse } from "@/types/http.types";

export interface NormalizedList<T> {
  items: T[];
  total: number;
}

export function normalizeListResponse<T>(
  payload: T[] | PaginatedResponse<T> | null | undefined
): NormalizedList<T> {
  if (!payload) {
    return { items: [], total: 0 };
  }

  if (Array.isArray(payload)) {
    return {
      items: payload,
      total: payload.length,
    };
  }

  if (Array.isArray(payload.data)) {
    return {
      items: payload.data,
      total: typeof payload.total === "number" ? payload.total : payload.data.length,
    };
  }

  return { items: [], total: 0 };
}
