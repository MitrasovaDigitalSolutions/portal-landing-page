"use client";

import { useEffect, useRef, useState } from "react";
import {
  useFormContext,
  useWatch,
  type FieldPath,
  type FieldValues,
  type PathValue,
} from "react-hook-form";
import { MapPickerCanvas } from "@/components/maps/map-picker-canvas";
import { MapsSearchBox } from "@/components/maps/maps-search-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  buildGoogleMapsEmbedUrl,
  extractCoordinatesFromMapsUrl,
  extractMapsEmbedSrc,
  resolveDirectMapsUrl,
  type MapCoordinates,
  type MapsSearchPlace,
} from "@/utils/maps-embed";

interface FormMapsLocationPickerProps<T extends FieldValues> {
  name: FieldPath<T>;
  addressFieldName?: FieldPath<T>;
  label?: string;
  mapHeightClassName?: string;
}

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

export function FormMapsLocationPicker<T extends FieldValues>({
  name,
  addressFieldName,
  label = "Titik Lokasi Peta (Google Maps)",
  mapHeightClassName = "h-[290px]",
}: FormMapsLocationPickerProps<T>): React.JSX.Element {
  const { control, setValue } = useFormContext<T>();
  const mapsEmbedRaw = useWatch({ control, name });
  const addressRaw = useWatch({ control, name: addressFieldName ?? name });

  const mapsEmbedValue = typeof mapsEmbedRaw === "string" ? mapsEmbedRaw : "";
  const addressValue =
    addressFieldName && typeof addressRaw === "string" ? addressRaw : "";

  const parsedCoords = extractCoordinatesFromMapsUrl(mapsEmbedValue);
  const directMapsHref = resolveDirectMapsUrl(mapsEmbedValue);
  const [suggestedAddress, setSuggestedAddress] = useState<string | null>(null);
  const [showManual, setShowManual] = useState(false);
  const reverseAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      reverseAbortRef.current?.abort();
    };
  }, []);

  const updateMapsValue = (nextVal: string): void => {
    setValue(name, nextVal as PathValue<T, FieldPath<T>>, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleMapClickOrDrag = (coords: MapCoordinates): void => {
    updateMapsValue(buildGoogleMapsEmbedUrl(coords.lat, coords.lng));
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
    updateMapsValue(buildGoogleMapsEmbedUrl(place.lat, place.lng));
    setSuggestedAddress(place.address);
  };

  const hasEmbedValue = mapsEmbedValue.trim().length > 0;
  const statusText = formatPickerStatusText(parsedCoords, hasEmbedValue);

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-700">{label}</span>
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

      <MapsSearchBox currentAddress={addressValue} onSelectPlace={handleSelectPlace} />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <MapPickerCanvas
          coordinates={parsedCoords}
          onSelectCoordinates={handleMapClickOrDrag}
          heightClassName={mapHeightClassName}
        />

        {suggestedAddress && addressFieldName ? (
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-primary/5 px-3 py-2 text-xs">
            <p className="min-w-0 flex-1 truncate text-slate-700">
              <strong className="font-semibold">Lokasi pin:</strong> {suggestedAddress}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setValue(
                  addressFieldName,
                  suggestedAddress as PathValue<T, FieldPath<T>>,
                  { shouldDirty: true, shouldValidate: true }
                );
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
            {directMapsHref ? (
              <a
                href={directMapsHref}
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
                  updateMapsValue("");
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
              updateMapsValue(extractMapsEmbedSrc(e.target.value));
            }}
            placeholder="https://www.google.com/maps/embed?... atau tempel kode <iframe>"
          />
          <p className="text-[11px] text-slate-500">
            Tempel URL Google Maps, link embed, atau kode HTML{" "}
            <code className="font-mono">&lt;iframe&gt;</code>; atribut{" "}
            <code className="font-mono">src</code> diekstrak otomatis.
          </p>
        </div>
      ) : null}
    </div>
  );
}
