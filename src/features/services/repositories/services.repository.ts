import { portalApi } from "@/lib/http/portal-api";
import { normalizeListResponse } from "@/lib/http/pagination";
import type { ServiceItem, ServiceType } from "@/types/cms.types";
import type { PaginatedResponse } from "@/types/http.types";

export interface UpsertServiceTypePayload {
  name: string;
  slug?: string;
  description: string | null;
  icon: string | null;
  order: number;
}

export const servicesRepository = {
  async listTypes(siteKey?: string): Promise<ServiceType[]> {
    const raw = await portalApi.tenantGet<
      ServiceType[] | PaginatedResponse<ServiceType>
    >("/admin/service-types", { siteKey });
    return normalizeListResponse(raw).items;
  },

  createType(
    payload: UpsertServiceTypePayload,
    siteKey?: string
  ): Promise<ServiceType> {
    return portalApi.tenantPost<ServiceType>("/admin/service-types", payload, {
      siteKey,
    });
  },

  updateType(
    id: number,
    payload: UpsertServiceTypePayload,
    siteKey?: string
  ): Promise<ServiceType> {
    return portalApi.tenantPut<ServiceType>(
      `/admin/service-types/${id}`,
      payload,
      { siteKey }
    );
  },

  deleteType(id: number, siteKey?: string): Promise<undefined> {
    return portalApi.tenantDelete(`/admin/service-types/${id}`, { siteKey });
  },

  async listServices(siteKey?: string): Promise<ServiceItem[]> {
    const raw = await portalApi.tenantGet<
      ServiceItem[] | PaginatedResponse<ServiceItem>
    >("/admin/services", { siteKey });
    return normalizeListResponse(raw).items;
  },

  createService(formData: FormData, siteKey?: string): Promise<ServiceItem> {
    return portalApi.tenantPost<ServiceItem>("/admin/services", formData, {
      siteKey,
    });
  },

  updateService(
    id: number,
    formData: FormData,
    siteKey?: string
  ): Promise<ServiceItem> {
    return portalApi.tenantPut<ServiceItem>(`/admin/services/${id}`, formData, {
      siteKey,
    });
  },

  deleteService(id: number, siteKey?: string): Promise<undefined> {
    return portalApi.tenantDelete(`/admin/services/${id}`, { siteKey });
  },
};
