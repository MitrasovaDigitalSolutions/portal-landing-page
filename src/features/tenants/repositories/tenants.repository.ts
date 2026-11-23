import { portalApi } from "@/lib/http/portal-api";
import type {
  AssignUserSitePayload,
  ManagedSite,
  ManagedUser,
  UpsertSitePayload,
  UpsertUserPayload,
} from "@/features/tenants/types/tenants.types";

export const tenantsRepository = {
  listSites(token?: string): Promise<ManagedSite[]> {
    return portalApi.globalGet<ManagedSite[]>("/admin/sites", { token });
  },

  createSite(
    payload: UpsertSitePayload,
    token?: string
  ): Promise<ManagedSite> {
    return portalApi.globalPost<ManagedSite>("/admin/sites", payload, {
      token,
    });
  },

  updateSite(
    id: string,
    payload: UpsertSitePayload,
    token?: string
  ): Promise<ManagedSite> {
    return portalApi.globalPut<ManagedSite>(`/admin/sites/${id}`, payload, {
      token,
    });
  },

  deleteSite(id: string, token?: string): Promise<undefined> {
    return portalApi.globalDelete(`/admin/sites/${id}`, { token });
  },

  listUsers(token?: string): Promise<ManagedUser[]> {
    return portalApi.globalGet<ManagedUser[]>("/admin/users", { token });
  },

  createUser(
    payload: UpsertUserPayload,
    token?: string
  ): Promise<ManagedUser> {
    return portalApi.globalPost<ManagedUser>("/admin/users", payload, {
      token,
    });
  },

  updateUser(
    id: number,
    payload: UpsertUserPayload,
    token?: string
  ): Promise<ManagedUser> {
    return portalApi.globalPut<ManagedUser>(`/admin/users/${id}`, payload, {
      token,
    });
  },

  assignUserToSite(
    siteId: string,
    payload: AssignUserSitePayload,
    token?: string
  ): Promise<unknown> {
    return portalApi.globalPost(`/admin/sites/${siteId}/users`, payload, {
      token,
    });
  },

  detachUserFromSite(
    siteId: string,
    userId: number,
    token?: string
  ): Promise<undefined> {
    return portalApi.globalDelete(`/admin/sites/${siteId}/users/${userId}`, {
      token,
    });
  },
};
