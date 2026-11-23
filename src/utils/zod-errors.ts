import type { z } from "zod";
import type { FieldErrors } from "@/types/http.types";

export function extractZodFieldErrors(error: z.ZodError): FieldErrors {
  const result: FieldErrors = {};

  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join(".") : "_root";
    result[key] ??= [];
    result[key].push(issue.message);
  }

  return result;
}
