"use client";

import { useCallback } from "react";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { FieldErrors } from "@/types/http.types";

export function applyServerFieldErrors<TFieldValues extends FieldValues>(
  setError: UseFormSetError<TFieldValues>,
  fieldErrors?: FieldErrors
): void {
  if (!fieldErrors) {
    return;
  }

  for (const [field, messages] of Object.entries(fieldErrors)) {
    const firstMessage = messages[0];
    if (firstMessage) {
      setError(field as Path<TFieldValues>, {
        type: "server",
        message: firstMessage,
      });
    }
  }
}

export function useServerErrors<TFieldValues extends FieldValues>(
  setError: UseFormSetError<TFieldValues>
): (fieldErrors?: FieldErrors) => void {
  return useCallback(
    (fieldErrors?: FieldErrors) => {
      applyServerFieldErrors(setError, fieldErrors);
    },
    [setError]
  );
}
