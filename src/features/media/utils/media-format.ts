import type { MediaItem, MediaUsageRef } from "@/types/cms.types";
import { MEDIA_PROXY_PREFIX } from "@/utils/media";

const DIR_LABEL_MAP: Record<string, string> = {
  services: "Produk & Layanan",
  branches: "Kantor & Cabang",
  "business-units": "Unit Usaha",
  articles: "Artikel & Berita",
  partners: "Mitra",
  portfolios: "Portfolio",
  sections: "Section Halaman",
  testimonials: "Testimoni",
  hero: "Hero Banner",
  career: "Karir",
  pages: "Halaman",
  branding: "Branding & Logo",
  root: "Lainnya",
};

const USAGE_TYPE_LABEL_MAP: Record<string, string> = {
  service: "Produk & Layanan",
  portfolio: "Portfolio",
  branch: "Kantor & Cabang",
  business_unit: "Unit Usaha",
  article: "Artikel & Berita",
  partner: "Mitra",
  testimonial: "Testimoni",
  page_section: "Section Halaman",
  setting: "Pengaturan Situs",
};

export function formatMediaSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 1024) {
    return `${Math.max(0, Math.round(bytes))} B`;
  }
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`;
  }
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

export function extractMediaDir(path: string): string {
  const parts = path.split("/").filter(Boolean);
  return parts.length > 1 ? (parts[0] ?? "root") : "root";
}

export function extractMediaFilename(path: string): string {
  const parts = path.split("/").filter(Boolean);
  return parts.at(-1) ?? path;
}

export function formatMediaDirLabel(dir: string): string {
  return (
    DIR_LABEL_MAP[dir] ??
    dir.replaceAll("-", " ").replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

export function resolveUsageMeta(ref: MediaUsageRef): {
  typeLabel: string;
  href: string;
} {
  const typeLabel = USAGE_TYPE_LABEL_MAP[ref.type] ?? ref.type;

  switch (ref.type) {
    case "service":
      return { typeLabel, href: `/services/${ref.id}/edit` };
    case "portfolio":
      return { typeLabel, href: "/portfolios" };
    case "branch":
      return { typeLabel, href: "/branches" };
    case "business_unit":
      return { typeLabel, href: "/business-units" };
    case "article":
      return { typeLabel, href: `/articles/${ref.id}/edit` };
    case "partner":
      return { typeLabel, href: "/showcase?tab=partners" };
    case "testimonial":
      return { typeLabel, href: "/showcase?tab=testimonials" };
    case "page_section":
      return { typeLabel, href: "/pages" };
    case "setting":
      return { typeLabel, href: "/settings" };
    default:
      return { typeLabel, href: "/" };
  }
}

export function toMediaProxyPath(
  item: Pick<MediaItem, "path" | "url">
): string {
  const cleanPath = item.path.replace(/^\/+/, "");
  let search = "";
  if (item.url) {
    try {
      search = new URL(item.url, "http://placeholder.local").search;
    } catch {
      search = "";
    }
  }
  return `${MEDIA_PROXY_PREFIX}/${cleanPath}${search}`;
}

export function toAbsoluteProxyUrl(
  item: Pick<MediaItem, "path" | "url">
): string {
  const proxyPath = toMediaProxyPath(item);
  if (typeof window !== "undefined") {
    return `${window.location.origin}${proxyPath}`;
  }
  return proxyPath;
}
