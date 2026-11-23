export type TenantRole = "admin" | "editor";

export interface AuthSiteSummary {
  id: string;
  name: string;
  slug: string;
  role: TenantRole;
}

export interface PortalUser {
  id: number;
  name: string;
  email: string;
  is_superadmin: boolean;
  sites: AuthSiteSummary[];
}

export interface LoginResponseData {
  token: string;
  user: PortalUser;
}
