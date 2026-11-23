import { cache } from "react";
import NextAuth, { type NextAuthConfig, type Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { apiClient } from "@/lib/http/api-client";
import type { LoginResponseData } from "@/types/auth.types";

const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Portal Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials.email === "string" ? credentials.email.trim() : "";
        const password =
          typeof credentials.password === "string" ? credentials.password : "";

        if (!email || !password) {
          return null;
        }

        try {
          const result = await apiClient.post<LoginResponseData>(
            "/auth/login",
            { email, password },
            { scope: "global" }
          );

          if (!result.token) {
            return null;
          }

          return {
            id: String(result.user.id),
            name: result.user.name,
            email: result.user.email,
            accessToken: result.token,
            is_superadmin: result.user.is_superadmin,
            sites: Array.isArray(result.user.sites) ? result.user.sites : [],
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    jwt({ token, user }) {
      // Initial sign-in guarantees user fields from authorize().
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (user) {
        token.accessToken = user.accessToken;
        token.userId = user.id;
        token.is_superadmin = user.is_superadmin;
        token.sites = user.sites;
      }
      return token;
    },
    session({ session, token }) {
      session.accessToken =
        typeof token.accessToken === "string" ? token.accessToken : "";
      session.user.id = typeof token.userId === "string" ? token.userId : "";
      session.user.is_superadmin = Boolean(token.is_superadmin);
      session.user.sites = Array.isArray(token.sites) ? token.sites : [];
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export const getPortalSession = cache(
  async (): Promise<Session | null> => auth()
);
