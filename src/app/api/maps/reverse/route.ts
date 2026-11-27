import { type NextRequest, NextResponse } from "next/server";
import { getPortalSession } from "@/lib/auth/auth";

const GEOCODER_USER_AGENT = "MitrasovaPortalCMS/1.0 (+https://mitrasova.id)";

interface NominatimReverseResponse {
  display_name?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getPortalSession();
  if (!session?.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const latParam = request.nextUrl.searchParams.get("lat") ?? "";
  const lngParam = request.nextUrl.searchParams.get("lng") ?? "";
  const lat = Number.parseFloat(latParam);
  const lng = Number.parseFloat(lngParam);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json(
      { address: null, message: "Koordinat tidak valid." },
      { status: 400 }
    );
  }

  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("accept-language", "id");
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lng));

    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": GEOCODER_USER_AGENT,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ address: null });
    }

    const payload = (await res.json()) as NominatimReverseResponse;
    const address = payload.display_name?.trim() ?? "";
    return NextResponse.json({
      address: address.length > 0 ? address : null,
    });
  } catch {
    return NextResponse.json({ address: null });
  }
}
