import type { CSSProperties } from "react";

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

type BrandCssVariables = CSSProperties & Record<`--${string}`, string>;

const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

const DEFAULT_TENANT_BRAND_COLORS = new Map<string, string>([
  ["ksp", "#1E3A8A"],
  ["konveksi", "#0F766E"],
  ["miset", "#0F766E"],
  ["teknologi", "#2563EB"],
  ["percetakan", "#D97706"],
  ["transportasi", "#059669"],
  ["bengkel-las", "#4B5563"],
]);

function hexToRgb(hex: string): RgbColor | null {
  const cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length !== 3 && cleanHex.length !== 6) {
    return null;
  }

  const expandedHex =
    cleanHex.length === 3
      ? cleanHex
          .split("")
          .map((char) => char + char)
          .join("")
      : cleanHex;

  const num = Number.parseInt(expandedHex, 16);
  if (Number.isNaN(num)) {
    return null;
  }

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function isValidHexColor(hex?: string | null): hex is string {
  return typeof hex === "string" && HEX_COLOR_REGEX.test(hex.trim());
}

export function resolveSiteBrandColor(
  brandColor?: string | null,
  siteSlug?: string | null
): string | undefined {
  if (isValidHexColor(brandColor)) {
    return brandColor.trim();
  }

  const normalizedSlug = siteSlug?.trim().toLowerCase();
  if (!normalizedSlug) {
    return undefined;
  }

  return DEFAULT_TENANT_BRAND_COLORS.get(normalizedSlug);
}

export function generatePreviewBrandStyle(
  hexBrandColor?: string
): CSSProperties {
  if (!isValidHexColor(hexBrandColor)) {
    return {};
  }

  const normalizedHex = hexBrandColor.trim();
  const rgb = hexToRgb(normalizedHex);
  if (!rgb) {
    return {};
  }

  const vars: BrandCssVariables = {
    "--primary": normalizedHex,
    "--color-primary": normalizedHex,
    "--ring": normalizedHex,
    "--color-ring": normalizedHex,
    "--brand-rgb": `${rgb.r} ${rgb.g} ${rgb.b}`,
  };
  return vars;
}
