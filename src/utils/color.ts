interface RgbColor {
  r: number;
  g: number;
  b: number;
}

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

  const num = parseInt(expandedHex, 16);
  if (Number.isNaN(num)) {
    return null;
  }

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function generateBrandCssVariables(
  hexBrandColor?: string
): Record<string, string> {
  if (!hexBrandColor) {
    return {};
  }

  const rgb = hexToRgb(hexBrandColor);
  if (!rgb) {
    return {};
  }

  return {
    "--primary": hexBrandColor,
    "--ring": hexBrandColor,
    "--sidebar-primary": hexBrandColor,
    "--brand-rgb": `${rgb.r} ${rgb.g} ${rgb.b}`,
  };
}
