export interface MapCoordinates {
  lat: number;
  lng: number;
}

export interface MapsSearchPlace {
  id: string;
  title: string;
  address: string;
  lat: number;
  lng: number;
}

export const DEFAULT_MAP_CENTER: MapCoordinates = {
  lat: -7.5755,
  lng: 110.8243,
};

function isValidCoordinates(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

function parseCoordinatePair(latStr: string, lngStr: string): MapCoordinates | null {
  const lat = Number.parseFloat(latStr);
  const lng = Number.parseFloat(lngStr);
  if (!isValidCoordinates(lat, lng)) {
    return null;
  }
  return { lat, lng };
}

export function buildGoogleMapsEmbedUrl(
  lat: number,
  lng: number,
  zoom = 16
): string {
  return `https://maps.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}&z=${zoom}&output=embed&hl=id`;
}

export function buildGoogleMapsExternalUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(6)},${lng.toFixed(6)}`;
}

export function extractMapsEmbedSrc(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    return "";
  }
  if (trimmed.toLowerCase().includes("<iframe")) {
    const srcMatch = /\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)')/i.exec(trimmed);
    const extracted = srcMatch?.[1] ?? srcMatch?.[2] ?? "";
    if (extracted.trim().length > 0) {
      return extracted.trim();
    }
  }
  return trimmed;
}

export function extractCoordinatesFromMapsUrl(
  rawUrl: string
): MapCoordinates | null {
  const src = extractMapsEmbedSrc(rawUrl);
  if (!src) {
    return null;
  }

  const queryMatch = /[?&](?:q|ll|center)=(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/i.exec(
    src
  );
  if (queryMatch?.[1] && queryMatch[2]) {
    const parsed = parseCoordinatePair(queryMatch[1], queryMatch[2]);
    if (parsed) return parsed;
  }

  const pbMatch = /!2d(-?\d+(?:\.\d+)?)!3d(-?\d+(?:\.\d+)?)/.exec(src);
  if (pbMatch?.[1] && pbMatch[2]) {
    const parsed = parseCoordinatePair(pbMatch[2], pbMatch[1]);
    if (parsed) return parsed;
  }

  const pbReverseMatch = /!3d(-?\d+(?:\.\d+)?)!2d(-?\d+(?:\.\d+)?)/.exec(src);
  if (pbReverseMatch?.[1] && pbReverseMatch[2]) {
    const parsed = parseCoordinatePair(pbReverseMatch[1], pbReverseMatch[2]);
    if (parsed) return parsed;
  }

  const atMatch = /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/.exec(src);
  if (atMatch?.[1] && atMatch[2]) {
    const parsed = parseCoordinatePair(atMatch[1], atMatch[2]);
    if (parsed) return parsed;
  }

  return null;
}
