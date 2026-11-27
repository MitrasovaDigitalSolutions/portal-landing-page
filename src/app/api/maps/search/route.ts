import { type NextRequest, NextResponse } from "next/server";
import type { MapsSearchPlace } from "@/utils/maps-embed";
import { getPortalSession } from "@/lib/auth/auth";

const GEOCODER_USER_AGENT = "MitrasovaPortalCMS/1.0 (+https://mitrasova.id)";

interface NominatimSearchItem {
  place_id?: number | string;
  name?: string;
  display_name?: string;
  lat?: string;
  lon?: string;
}

interface PhotonFeature {
  properties?: {
    osm_id?: number;
    name?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  geometry?: {
    coordinates?: number[];
  };
}

function mapNominatimResults(items: NominatimSearchItem[]): MapsSearchPlace[] {
  const mapped: MapsSearchPlace[] = [];
  for (let idx = 0; idx < items.length; idx += 1) {
    const item = items[idx];
    const lat = Number.parseFloat(item.lat ?? "");
    const lng = Number.parseFloat(item.lon ?? "");
    const displayName = item.display_name?.trim() ?? "";
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || !displayName) {
      continue;
    }
    const rawName = item.name?.trim();
    const shortTitle =
      rawName && rawName.length > 0
        ? rawName
        : displayName.split(",")[0].trim();
    mapped.push({
      id: String(item.place_id ?? idx),
      title: shortTitle,
      address: displayName,
      lat,
      lng,
    });
  }
  return mapped;
}

function mapPhotonResults(features: PhotonFeature[]): MapsSearchPlace[] {
  const mapped: MapsSearchPlace[] = [];
  for (let idx = 0; idx < features.length; idx += 1) {
    const feature = features[idx];
    const coords = feature.geometry?.coordinates ?? [];
    const lng = coords[0];
    const lat = coords[1];
    if (typeof lat !== "number" || typeof lng !== "number") {
      continue;
    }
    const props = feature.properties;
    const parts = [
      props?.name,
      props?.street,
      props?.city,
      props?.state,
      props?.country,
    ].filter((part): part is string => Boolean(part?.trim()));
    if (parts.length === 0) {
      continue;
    }
    mapped.push({
      id: `photon-${props?.osm_id ?? idx}`,
      title: parts[0],
      address: parts.join(", "),
      lat,
      lng,
    });
  }
  return mapped;
}

async function queryNominatim(
  query: string,
  restrictIndonesia: boolean
): Promise<MapsSearchPlace[]> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "6");
  url.searchParams.set("accept-language", "id");
  url.searchParams.set("q", query);
  if (restrictIndonesia) {
    url.searchParams.set("countrycodes", "id");
  }

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": GEOCODER_USER_AGENT,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Nominatim HTTP ${res.status}`);
  }
  const raw = (await res.json()) as unknown;
  if (!Array.isArray(raw)) {
    return [];
  }
  return mapNominatimResults(raw as NominatimSearchItem[]);
}

async function queryPhoton(query: string): Promise<MapsSearchPlace[]> {
  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "6");

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });
  if (!res.ok) {
    return [];
  }
  const raw = (await res.json()) as { features?: PhotonFeature[] };
  return Array.isArray(raw.features) ? mapPhotonResults(raw.features) : [];
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getPortalSession();
  if (!session?.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (query.length < 2) {
    return NextResponse.json({ items: [] });
  }

  try {
    let items = await queryNominatim(query, true);
    if (items.length === 0) {
      items = await queryNominatim(query, false);
    }
    return NextResponse.json({ items });
  } catch {
    try {
      const fallbackItems = await queryPhoton(query);
      return NextResponse.json({ items: fallbackItems });
    } catch {
      return NextResponse.json({ items: [] });
    }
  }
}
