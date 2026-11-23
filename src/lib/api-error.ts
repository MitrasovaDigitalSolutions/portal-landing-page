export interface ApiErrorData {
  message?: string;
  errors?: Record<string, string[] | string>;
}

function extractFieldErrors(
  rawErrors: unknown
): Record<string, string[]> | undefined {
  if (!rawErrors || typeof rawErrors !== "object") {
    return undefined;
  }

  const normalized: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(rawErrors)) {
    if (Array.isArray(value)) {
      normalized[key] = value.map((item) => String(item));
    } else if (value !== null && value !== undefined) {
      normalized[key] = [String(value)];
    }
  }

  return Object.keys(normalized).length > 0 ? normalized : undefined;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly fieldErrors?: Record<string, string[]>;

  public constructor(
    status: number,
    message: string,
    fieldErrors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }

  public static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
  }

  public static fromPayload(status: number, payload: unknown): ApiError {
    if (typeof payload === "object" && payload !== null) {
      const parsed = payload as ApiErrorData;
      const message =
        parsed.message ?? `Permintaan gagal dengan status ${status}`;
      const fieldErrors = extractFieldErrors(parsed.errors);

      return new ApiError(status, message, fieldErrors);
    }

    return new ApiError(status, `Permintaan gagal dengan status ${status}`);
  }
}
