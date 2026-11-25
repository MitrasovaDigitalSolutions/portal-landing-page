export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  warnings?: string[];
  errors?: Record<string, string[]>;
}

export interface ApiEnvelopeResult<T> {
  data: T;
  warnings: string[];
  message?: string;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedResponse<T> extends PaginationMeta {
  data: T[];
}

export type FieldErrors = Record<string, string[]>;

export type ActionResult<T = undefined> =
  | {
      success: true;
      message?: string;
      warnings?: string[];
      data: T;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: FieldErrors;
      status?: number;
    };
