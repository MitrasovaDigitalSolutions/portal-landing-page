"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ActionResult } from "@/types/http.types";

type ActionFailure<TData> = Extract<ActionResult<TData>, { success: false }>;

export interface UseCrudMutationOptions<TVariables, TData> {
  mutationFn: (variables: TVariables) => Promise<ActionResult<TData>>;
  invalidateKeys?: readonly (readonly unknown[])[];
  refreshRouter?: boolean;
  successToast?: string | false;
  errorToast?: boolean;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (result: ActionFailure<TData>, variables: TVariables) => void;
}

export function useCrudMutation<TVariables, TData = undefined>({
  mutationFn,
  invalidateKeys,
  refreshRouter = true,
  successToast,
  errorToast = true,
  onSuccess,
  onError,
}: UseCrudMutationOptions<TVariables, TData>): UseMutationResult<
  ActionResult<TData>,
  Error,
  TVariables
> {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (result, variables) => {
      if (result.success) {
        if (successToast !== false) {
          const message = result.message ?? successToast;
          if (message) {
            toast.success(message);
          }
        }

        if (invalidateKeys) {
          for (const key of invalidateKeys) {
            void queryClient.invalidateQueries({ queryKey: key });
          }
        }

        if (refreshRouter) {
          router.refresh();
        }

        onSuccess?.(result.data, variables);
        return;
      }

      if (errorToast) {
        toast.error(result.message);
      }
      onError?.(result, variables);
    },
    onError: (error) => {
      if (errorToast) {
        toast.error(
          error.message || "Terjadi kendala jaringan saat memproses permintaan."
        );
      }
    },
  });
}
