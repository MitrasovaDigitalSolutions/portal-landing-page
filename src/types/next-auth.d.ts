import type { DefaultSession } from "next-auth";
import type {} from "next-auth/jwt";
import type { AuthSiteSummary } from "@/types/auth.types";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    accessToken: string;
    is_superadmin: boolean;
    sites: AuthSiteSummary[];
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      is_superadmin: boolean;
      sites: AuthSiteSummary[];
    } & DefaultSession["user"];
    accessToken: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    accessToken?: string;
    userId?: string;
    is_superadmin?: boolean;
    sites?: AuthSiteSummary[];
  }
}
