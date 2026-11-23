/**
 * Fluent builder to assemble Laravel-compatible multipart FormData cleanly.
 */
export class FormDataBuilder {
  private readonly formData = new FormData();

  public appendText(key: string, value: string | null | undefined): this {
    if (value !== undefined && value !== null && value !== "") {
      this.formData.append(key, value);
    }
    return this;
  }

  public appendOptionalText(
    key: string,
    value: string | null | undefined
  ): this {
    if (value === undefined) {
      return this;
    }
    this.formData.append(key, value ?? "");
    return this;
  }

  public appendNumber(key: string, value: number | null | undefined): this {
    if (value !== undefined && value !== null && Number.isFinite(value)) {
      this.formData.append(key, String(value));
    }
    return this;
  }

  public appendBoolean(key: string, value: boolean | undefined): this {
    if (value !== undefined) {
      this.formData.append(key, value ? "1" : "0");
    }
    return this;
  }

  public appendFile(key: string, file: File | null | undefined): this {
    if (file instanceof File && file.size > 0) {
      this.formData.append(key, file);
    }
    return this;
  }

  public appendFiles(
    key: string,
    files: readonly File[] | null | undefined
  ): this {
    if (!files || files.length === 0) {
      return this;
    }
    for (const file of files) {
      if (file instanceof File && file.size > 0) {
        this.formData.append(`${key}[]`, file);
      }
    }
    return this;
  }

  public appendNested(key: string, value: unknown): this {
    if (value === undefined || value === null) {
      return this;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        this.appendNested(`${key}[${index}]`, item);
      });
      return this;
    }

    if (typeof value === "object") {
      for (const [childKey, childVal] of Object.entries(value)) {
        this.appendNested(`${key}[${childKey}]`, childVal);
      }
      return this;
    }

    if (typeof value === "boolean") {
      this.formData.append(key, value ? "1" : "0");
      return this;
    }

    if (typeof value === "string" || typeof value === "number") {
      this.formData.append(key, String(value));
    }

    return this;
  }

  public appendMethodOverride(method: "PUT" | "PATCH" | "DELETE"): this {
    this.formData.append("_method", method);
    return this;
  }

  public appendJson(key: string, value: unknown): this {
    if (value !== undefined) {
      this.formData.append(key, JSON.stringify(value));
    }
    return this;
  }

  public build(): FormData {
    return this.formData;
  }
}

export function readFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}
