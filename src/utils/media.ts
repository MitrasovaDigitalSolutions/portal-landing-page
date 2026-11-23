import { env } from "@/config/env";

export const MEDIA_PROXY_PREFIX = "/api/media";

function getApiOriginUrl(): URL {
  try {
    return new URL(env.NEXT_PUBLIC_API_URL);
  } catch {
    return new URL("http://43.157.197.42:8088");
  }
}

function isInvalidValue(value?: string | null): boolean {
  if (!value) {
    return true;
  }
  const trimmed = value.trim().toLowerCase();
  return (
    trimmed.length === 0 ||
    trimmed === "string" ||
    trimmed === "null" ||
    trimmed === "undefined"
  );
}

function extractStorageSubpath(pathname: string): string | null {
  const clean = pathname.replace(/^\/+/, "");
  if (!clean.startsWith("storage/")) {
    return null;
  }
  const subpath = clean.slice("storage/".length).replace(/^\/+/, "");
  return subpath.length > 0 ? subpath : null;
}

function toProxyPath(storageSubpath: string, search = ""): string {
  const clean = storageSubpath.replace(/^\/+/, "");
  return `${MEDIA_PROXY_PREFIX}/${clean}${search}`;
}

function normalizeAbsoluteUrl(rawUrl: string, apiOriginUrl: URL): string {
  try {
    const parsed = new URL(rawUrl);
    const isLocalhost =
      parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
    const isSameBackendHost = parsed.hostname === apiOriginUrl.hostname;
    const storageSubpath = extractStorageSubpath(parsed.pathname);

    if (
      storageSubpath &&
      parsed.protocol === "http:" &&
      (isSameBackendHost || isLocalhost)
    ) {
      if (isLocalhost && apiOriginUrl.protocol === "https:") {
        return `${apiOriginUrl.origin}/storage/${storageSubpath}${parsed.search}`;
      }
      return toProxyPath(storageSubpath, parsed.search);
    }

    if (isLocalhost) {
      return `${apiOriginUrl.origin}${parsed.pathname}${parsed.search}`;
    }

    return parsed.toString();
  } catch {
    return rawUrl;
  }
}

function buildStorageUrl(pathValue: string, apiOriginUrl: URL): string {
  const cleanPath = pathValue.replace(/^\/+/, "");
  const storageSubpath = cleanPath.startsWith("storage/")
    ? cleanPath.slice("storage/".length).replace(/^\/+/, "")
    : cleanPath;

  if (!storageSubpath) {
    return apiOriginUrl.origin;
  }

  if (apiOriginUrl.protocol === "http:") {
    return toProxyPath(storageSubpath);
  }

  return `${apiOriginUrl.origin}/storage/${storageSubpath}`;
}

export function resolveMediaUrl(
  url?: string | null,
  fallbackPath?: string | null
): string | null {
  const apiOriginUrl = getApiOriginUrl();

  if (!isInvalidValue(url) && url) {
    const trimmed = url.trim();
    if (
      trimmed.startsWith(`${MEDIA_PROXY_PREFIX}/`) ||
      trimmed.startsWith("/images/")
    ) {
      return trimmed;
    }
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return normalizeAbsoluteUrl(trimmed, apiOriginUrl);
    }
    return buildStorageUrl(trimmed, apiOriginUrl);
  }

  if (!isInvalidValue(fallbackPath) && fallbackPath) {
    const trimmedFallback = fallbackPath.trim();
    if (
      trimmedFallback.startsWith(`${MEDIA_PROXY_PREFIX}/`) ||
      trimmedFallback.startsWith("/images/")
    ) {
      return trimmedFallback;
    }
    return buildStorageUrl(trimmedFallback, apiOriginUrl);
  }

  return null;
}

export function rewriteEmbeddedMediaUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed.toLowerCase().startsWith("http://")) {
    return rawUrl;
  }
  return normalizeAbsoluteUrl(trimmed, getApiOriginUrl());
}

export function isOptimizableProxyMedia(url: string): boolean {
  if (!url.startsWith(`${MEDIA_PROXY_PREFIX}/`)) {
    return false;
  }
  const pathWithoutQuery = url.split("?")[0]?.toLowerCase() ?? "";
  return !pathWithoutQuery.endsWith(".svg") && !pathWithoutQuery.endsWith(".gif");
}

export function buildMediaVariantUrl(
  proxyUrl: string,
  width: number,
  quality = 80
): string {
  try {
    const parsed = new URL(proxyUrl, "http://placeholder.local");
    parsed.searchParams.set("w", String(width));
    parsed.searchParams.set("q", String(quality));
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return proxyUrl;
  }
}

export function resolveGalleryUrls(
  galleryUrls?: string[] | null,
  galleryPaths?: string[] | null
): string[] {
  const rawList =
    galleryUrls && galleryUrls.length > 0 ? galleryUrls : (galleryPaths ?? []);

  const resolved: string[] = [];
  for (const item of rawList) {
    const validUrl = resolveMediaUrl(item);
    if (validUrl && !resolved.includes(validUrl)) {
      resolved.push(validUrl);
    }
  }

  return resolved;
}
