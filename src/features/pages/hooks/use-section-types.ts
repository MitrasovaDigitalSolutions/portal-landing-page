"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { listSectionTypesAction } from "@/features/pages/actions/section-types.actions";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { SectionTypeDefinition } from "@/types/cms.types";

export function useSectionTypes(
  initialData?: SectionTypeDefinition[]
): UseQueryResult<SectionTypeDefinition[]> {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";

  return useQuery({
    queryKey: queryKeys.sectionTypes.all(siteKey),
    queryFn: async (): Promise<SectionTypeDefinition[]> => {
      const result = await listSectionTypesAction();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    initialData,
    staleTime: 5 * 60 * 1000,
  });
}
