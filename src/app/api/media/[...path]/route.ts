import { env } from "@/config/env";
import type { NextRequest } from "next/server";
import sharp from "sharp";

interface MediaRouteContext {
  params: Promise<{ path: string[] }>;
}

interface TransformOptions {
  width: number;
  quality: number;
}

const DEFAULT_API_ORIGIN = "http://43.157.197.42:8088";
const UPSTREAM_TIMEOUT_MS = 15_000;
const MAX_OPTIMIZE_BYTES = 20 * 1024 * 1024;
const RAW_CACHE_CONTROL =
  "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";
const OPTIMIZED_CACHE_CONTROL =
  "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000";

const ALLOWED_WIDTHS = [32, 256, 384, 640, 828, 1080, 1280, 1600, 1920] as const;
const SAFE_RASTER_MIME_TYPES = new Set([
  "image/jpeg", "image/jpg", "image/png", "image/webp",
  "image/avif", "image/gif", "image/x-icon", "image/vnd.microsoft.icon",
]);
const OPTIMIZABLE_MIME_TYPES = new Set([
  "image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif",
]);
const HEAD_PASSTHROUGH_HEADERS = ["content-length", "etag", "last-modified", "accept-ranges"] as const;
const META_HEADERS = ["etag", "last-modified"] as const;

function getBackendOrigin(): string {
  try {
    return new URL(env.NEXT_PUBLIC_API_URL).origin;
  } catch {
    return DEFAULT_API_ORIGIN;
  }
}

function isValidPathSegments(segments: string[] | undefined): segments is string[] {
  if (!Array.isArray(segments) || segments.length === 0) return false;
  return segments.every(
    (s) => s.length > 0 && s !== "." && s !== ".." && !s.includes("/") && !s.includes("\\") && !s.includes("\0")
  );
}

function parseTransformOptions(searchParams: URLSearchParams): TransformOptions | null {
  const rawW = searchParams.get("w");
  if (!rawW) return null;
  const parsedW = Number.parseInt(rawW, 10);
  if (!Number.isFinite(parsedW) || parsedW <= 0) return null;

  const width = ALLOWED_WIDTHS.find((w) => parsedW <= w) ?? 1920;
  const defaultQuality = width <= 64 ? 25 : 80;
  const rawQ = searchParams.get("q");
  const parsedQ = rawQ ? Number.parseInt(rawQ, 10) : defaultQuality;
  const quality = Number.isFinite(parsedQ) ? Math.min(85, Math.max(20, parsedQ)) : defaultQuality;
  return { width, quality };
}

function buildTargetUrl(segments: string[], searchParams: URLSearchParams, apiOrigin: string): URL | null {
  const cleanSearch = new URLSearchParams(searchParams);
  cleanSearch.delete("w");
  cleanSearch.delete("q");
  const qs = cleanSearch.toString();
  const encodedPath = segments.map((s) => encodeURIComponent(s)).join("/");
  try {
    const targetUrl = new URL(`/storage/${encodedPath}`, apiOrigin);
    if (qs) targetUrl.search = `?${qs}`;
    if (targetUrl.origin !== apiOrigin || !targetUrl.pathname.startsWith("/storage/")) return null;
    return targetUrl;
  } catch {
    return null;
  }
}

function buildSecurityHeaders(contentType: string, cacheControl: string, contentLength?: number): Headers {
  const mimeType = contentType.split(";")[0]?.trim().toLowerCase() ?? "";
  const headers = new Headers({
    "Content-Type": contentType,
    "Cache-Control": cacheControl,
    "X-Content-Type-Options": "nosniff",
  });
  if (!SAFE_RASTER_MIME_TYPES.has(mimeType)) {
    headers.set("Content-Security-Policy", "default-src 'self'; script-src 'none'; sandbox;");
  }
  if (contentLength !== undefined) headers.set("Content-Length", String(contentLength));
  return headers;
}

function copyHeaders(source: Headers, target: Headers, names: readonly string[]): void {
  for (const name of names) {
    const val = source.get(name);
    if (val) target.set(name, val);
  }
}

async function readUpstreamBuffer(upstream: Response): Promise<Buffer | Response> {
  const declaredBytes = Number.parseInt(upstream.headers.get("content-length") ?? "0", 10);
  let data: ArrayBuffer;
  try {
    data = await upstream.arrayBuffer();
  } catch {
    return new Response("Media upstream incomplete", { status: 502 });
  }
  const hasContentEncoding = Boolean(upstream.headers.get("content-encoding"));
  if (!hasContentEncoding && Number.isFinite(declaredBytes) && declaredBytes > 0 && data.byteLength !== declaredBytes) {
    return new Response("Media upstream truncated", { status: 502 });
  }
  return Buffer.from(data);
}

async function buildPassthroughResponse(upstream: Response, method: "GET" | "HEAD"): Promise<Response> {
  const rawType = upstream.headers.get("content-type") ?? "application/octet-stream";
  if (method === "HEAD") {
    const headers = buildSecurityHeaders(rawType, RAW_CACHE_CONTROL);
    copyHeaders(upstream.headers, headers, HEAD_PASSTHROUGH_HEADERS);
    return new Response(null, { status: upstream.status, headers });
  }

  const declaredBytes = Number.parseInt(upstream.headers.get("content-length") ?? "0", 10);
  if (Number.isFinite(declaredBytes) && declaredBytes > MAX_OPTIMIZE_BYTES) {
    const headers = buildSecurityHeaders(rawType, RAW_CACHE_CONTROL);
    copyHeaders(upstream.headers, headers, META_HEADERS);
    return new Response(upstream.body, { status: upstream.status, headers });
  }

  const inputOrErr = await readUpstreamBuffer(upstream);
  if (inputOrErr instanceof Response) return inputOrErr;

  const headers = buildSecurityHeaders(rawType, RAW_CACHE_CONTROL, inputOrErr.byteLength);
  copyHeaders(upstream.headers, headers, META_HEADERS);
  return new Response(new Uint8Array(inputOrErr), { status: upstream.status, headers });
}

async function optimizeImageResponse(upstream: Response, transform: TransformOptions): Promise<Response> {
  const rawType = upstream.headers.get("content-type") ?? "application/octet-stream";
  const mimeType = rawType.split(";")[0]?.trim().toLowerCase() ?? "";
  const declaredBytes = Number.parseInt(upstream.headers.get("content-length") ?? "0", 10);

  if (!OPTIMIZABLE_MIME_TYPES.has(mimeType) || (Number.isFinite(declaredBytes) && declaredBytes > MAX_OPTIMIZE_BYTES)) {
    return buildPassthroughResponse(upstream, "GET");
  }

  const inputOrErr = await readUpstreamBuffer(upstream);
  if (inputOrErr instanceof Response) return inputOrErr;

  if (inputOrErr.byteLength > MAX_OPTIMIZE_BYTES) {
    return new Response(new Uint8Array(inputOrErr), {
      status: upstream.status,
      headers: buildSecurityHeaders(rawType, RAW_CACHE_CONTROL, inputOrErr.byteLength),
    });
  }

  try {
    const output = await sharp(inputOrErr)
      .rotate()
      .resize({ width: transform.width, withoutEnlargement: true })
      .webp({ quality: transform.quality, effort: transform.width <= 64 ? 2 : 4 })
      .toBuffer();

    return new Response(new Uint8Array(output), {
      status: 200,
      headers: buildSecurityHeaders("image/webp", OPTIMIZED_CACHE_CONTROL, output.byteLength),
    });
  } catch {
    return new Response(new Uint8Array(inputOrErr), {
      status: upstream.status,
      headers: buildSecurityHeaders(rawType, RAW_CACHE_CONTROL, inputOrErr.byteLength),
    });
  }
}

async function proxyMedia(request: NextRequest, context: MediaRouteContext, method: "GET" | "HEAD"): Promise<Response> {
  const { path } = await context.params;
  if (!isValidPathSegments(path)) return new Response("Invalid media path", { status: 400 });

  const transform = parseTransformOptions(request.nextUrl.searchParams);
  const targetUrl = buildTargetUrl(path, request.nextUrl.searchParams, getBackendOrigin());
  if (!targetUrl) return new Response("Invalid media target", { status: 400 });

  const reqHeaders = new Headers({ Accept: request.headers.get("accept") ?? "*/*" });
  if (!transform) copyHeaders(request.headers, reqHeaders, ["if-none-match", "if-modified-since"]);

  let upstream: Response;
  try {
    upstream = await fetch(targetUrl.toString(), {
      method,
      headers: reqHeaders,
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch {
    return new Response("Media upstream unavailable", { status: 502 });
  }

  if (upstream.status === 304) {
    const headers304 = new Headers({ "Cache-Control": RAW_CACHE_CONTROL });
    copyHeaders(upstream.headers, headers304, META_HEADERS);
    return new Response(null, { status: 304, headers: headers304 });
  }

  if (!upstream.ok) return new Response(null, { status: upstream.status });
  if (transform && method === "GET") return optimizeImageResponse(upstream, transform);
  return buildPassthroughResponse(upstream, method);
}

export async function GET(request: NextRequest, context: MediaRouteContext): Promise<Response> {
  return proxyMedia(request, context, "GET");
}

export async function HEAD(request: NextRequest, context: MediaRouteContext): Promise<Response> {
  return proxyMedia(request, context, "HEAD");
}
