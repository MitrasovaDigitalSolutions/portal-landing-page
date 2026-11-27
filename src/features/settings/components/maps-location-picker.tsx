"use client";

import { useEffect, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPickerCanvas } from "@/features/settings/components/map-picker-canvas";
import { MapsSearchBox } from "@/features/settings/components/maps-search-box";
import type { SettingsFormValues } from "@/features/settings/schemas/settings.schema";
import {
  buildGoogleMapsEmbedUrl,
  buildGoogleMapsExternalUrl,
  extractCoordinatesFromMapsUrl,
  extractMapsEmbedSrc,
  type MapCoordinates,
  type MapsSearchPlace,
} from "@/features/settings/utils/maps-embed";

async function fetchReverseAddress(
  coords: MapCoordinates,
  signal: AbortSignal
): Promise<string | null> {
  const res = await fetch(
    `/api/maps/reverse?lat=${coords.lat.toFixed(6)}&lng=${coords.lng.toFixed(6)}`,
    { signal }
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { address?: string | null };
  return data.address?.trim() ?? null;
}

function formatPickerStatusText(
  coords: MapCoordinates | null,
  hasEmbedValue: boolean
): string {
  if (coords) {
    return `Pin aktif: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`;
  }
  if (hasEmbedValue) {
    return "URL embed Google Maps kustom aktif.";
  }
  return "Klik peta atau cari lokasi untuk memasang pin.";
}

export function MapsLocationPicker(): React.JSX.Element {
  const { control, setValue } = useFormContext<SettingsFormValues>();
  const [mapsEmbedValue, addressValue] = useWatch({
    control,
    name: ["maps_embed", "address"],
  });

  const parsedCoords = extractCoordinatesFromMapsUrl(mapsEmbedValue);
  const [suggestedAddress, setSuggestedAddress] = useState<string | null>(null);
  const [showManual, setShowManual] = useState(false);
  const reverseAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      reverseAbortRef.current?.abort();
    };
  }, []);

  const applyCoordinates = (coords: MapCoordinates): void => {
    setValue("maps_embed", buildGoogleMapsEmbedUrl(coords.lat, coords.lng), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleMapClickOrDrag = (coords: MapCoordinates): void => {
    applyCoordinates(coords);
    reverseAbortRef.current?.abort();
    const controller = new AbortController();
    reverseAbortRef.current = controller;

    void fetchReverseAddress(coords, controller.signal)
      .then((resolved) => {
        if (!controller.signal.aborted) setSuggestedAddress(resolved);
      })
      .catch(() => undefined);
  };

  const handleSelectPlace = (place: MapsSearchPlace): void => {
    applyCoordinates({ lat: place.lat, lng: place.lng });
    setSuggestedAddress(place.address);
  };

  const hasEmbedValue = mapsEmbedValue.trim().length > 0;
  const statusText = formatPickerStatusText(parsedCoords, hasEmbedValue);

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-700">
          Titik Lokasi Peta (Google Maps)
        </span>
        <button
          type="button"
          onClick={() => {
            setShowManual((prev) => !prev);
          }}
          className="text-[11px] font-semibold text-primary hover:underline"
        >
          {showManual ? "Tutup Input Manual" : "Input URL / Iframe Manual"}
        </button>
      </div>

      <MapsSearchBox
        currentAddress={addressValue}
        onSelectPlace={handleSelectPlace}
      />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <MapPickerCanvas
          coordinates={parsedCoords}
          onSelectCoordinates={handleMapClickOrDrag}
        />

        {suggestedAddress ? (
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-primary/5 px-3 py-2 text-xs">
            <p className="min-w-0 flex-1 truncate text-slate-700">
              <strong className="font-semibold">Lokasi pin:</strong> {suggestedAddress}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setValue("address", suggestedAddress, { shouldDirty: true, shouldValidate: true });
              }}
              className="h-7 shrink-0 rounded-lg border-primary/30 bg-white px-2.5 text-[11px] font-semibold text-primary hover:bg-primary/10"
            >
              Pakai sebagai Alamat
            </Button>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/80 px-3 py-2 text-[11px] text-slate-600">
          <span className="font-mono text-slate-600">{statusText}</span>

          <div className="flex items-center gap-3">
            {parsedCoords ? (
              <a
                href={buildGoogleMapsExternalUrl(parsedCoords.lat, parsedCoords.lng)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                Buka Google Maps ↗
              </a>
            ) : null}
            {hasEmbedValue ? (
              <button
                type="button"
                onClick={() => {
                  setValue("maps_embed", "", { shouldDirty: true, shouldValidate: true });
                  setSuggestedAddress(null);
                }}
                className="font-semibold text-rose-600 hover:underline"
              >
                Hapus Lokasi
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {showManual ? (
        <div className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <Input
            type="text"
            value={mapsEmbedValue}
            onChange={(e) => {
              setValue("maps_embed", extractMapsEmbedSrc(e.target.value), { shouldDirty: true, shouldValidate: true });
            }}
            placeholder="https://www.google.com/maps/embed?... atau tempel kode <iframe>"
          />
          <p className="text-[11px] text-slate-500">
            Opsional: tempel URL embed Google Maps atau kode <code className="font-mono">&lt;iframe&gt;</code>; atribut <code className="font-mono">src</code> diekstrak otomatis.
          </p>
        </div>
      ) : null}
    </div>
  );
}
