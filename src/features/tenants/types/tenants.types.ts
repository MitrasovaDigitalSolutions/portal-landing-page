import type { TenantRole } from "@/types/auth.types";

export interface ManagedSite {
  id: string;
  name: string;
  slug: string;
  api_key: string;
  domain: string | null;
  is_active: boolean;
  users_count?: number;
  services_count?: number;
  articles_count?: number;
  portfolios_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface UserAssignedSite {
  id: string;
  name: string;
  slug: string;
  domain?: string | null;
  role?: TenantRole;
  pivot?: {
    user_id?: number;
    site_id?: string;
    role: TenantRole;
  };
}

export interface ManagedUser {
  id: number;
  name: string;
  email: string;
  is_superadmin: boolean;
  created_at?: string;
  sites?: UserAssignedSite[];
}

export interface UpsertSitePayload {
  name: string;
  slug?: string;
  domain?: string;
  is_active: boolean;
}

export interface UpsertUserPayload {
  name: string;
  email: string;
  password?: string;
  is_superadmin: boolean;
}

export interface AssignUserSitePayload {
  user_id: number;
  role: TenantRole;
}
