"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { TenantModulesState } from "@/config/modules";
import type { AuthSiteSummary } from "@/types/auth.types";

export interface TenantContextValue {
  activeSite: AuthSiteSummary | null;
  availableSites: AuthSiteSummary[];
  isSuperadmin: boolean;
  modules: TenantModulesState;
  brandColor?: string;
  siteTitle?: string;
  logoUrl?: string;
}

const TenantContext = createContext<TenantContextValue>({
  activeSite: null,
  availableSites: [],
  isSuperadmin: false,
  modules: {},
});

interface TenantProviderProps {
  value: TenantContextValue;
  children: ReactNode;
}

export function TenantProvider({
  value,
  children,
}: TenantProviderProps): React.JSX.Element {
  const memoizedValue = useMemo<TenantContextValue>(() => value, [value]);
  return (
    <TenantContext.Provider value={memoizedValue}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant(): TenantContextValue {
  return useContext(TenantContext);
}
