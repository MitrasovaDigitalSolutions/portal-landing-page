function normalizeApiUrl(rawUrl: string | undefined): string {
  const fallback = "http://43.157.197.42:8088/api/v1";
  const value = rawUrl?.trim();
  if (!value) {
    return fallback;
  }
  return value.replace(/\/+$/, "");
}

export const env = {
  NEXT_PUBLIC_API_URL: normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL),
  NEXT_PUBLIC_APP_NAME:
    process.env.NEXT_PUBLIC_APP_NAME?.trim() ?? "Mitrasova Portal CMS",
} as const;
