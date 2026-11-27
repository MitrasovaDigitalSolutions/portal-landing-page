"use client";

import "leaflet/dist/leaflet.css";
import type * as Leaflet from "leaflet";
import { useEffect, useRef, type RefObject } from "react";
import {
  DEFAULT_MAP_CENTER,
  type MapCoordinates,
} from "@/features/settings/utils/maps-embed";

interface MapPickerCanvasProps {
  coordinates: MapCoordinates | null;
  onSelectCoordinates: (coords: MapCoordinates) => void;
}

function createPinIcon(L: typeof Leaflet): Leaflet.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div style="display:flex;align-items:center;justify-content:center;width:34px;height:42px;filter:drop-shadow(0 4px 6px rgba(15,23,42,0.35));"><svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 0C7.163 0 0 7.163 0 16c0 11.11 14.37 22.92 14.98 23.42a1.65 1.65 0 0 0 2.04 0C17.63 38.92 32 27.11 32 16 32 7.163 24.837 0 16 0Z" fill="#2563EB"/><circle cx="16" cy="15" r="6" fill="#FFFFFF"/></svg></div>`,
    iconSize: [34, 42],
    iconAnchor: [17, 41],
  });
}

function upsertDraggableMarker(
  L: typeof Leaflet,
  map: Leaflet.Map,
  markerRef: RefObject<Leaflet.Marker | null>,
  coords: MapCoordinates,
  onSelectRef: RefObject<(coords: MapCoordinates) => void>
): void {
  if (markerRef.current) {
    markerRef.current.setLatLng([coords.lat, coords.lng]);
    return;
  }

  const marker = L.marker([coords.lat, coords.lng], {
    draggable: true,
    icon: createPinIcon(L),
  }).addTo(map);

  marker.on("dragend", () => {
    const nextPos = marker.getLatLng();
    onSelectRef.current({ lat: nextPos.lat, lng: nextPos.lng });
  });

  markerRef.current = marker;
}

export function MapPickerCanvas({
  coordinates,
  onSelectCoordinates,
}: MapPickerCanvasProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const leafletRef = useRef<typeof Leaflet | null>(null);
  const markerRef = useRef<Leaflet.Marker | null>(null);
  const initialCoordsRef = useRef<MapCoordinates | null>(coordinates);
  const onSelectRef = useRef(onSelectCoordinates);

  useEffect(() => {
    onSelectRef.current = onSelectCoordinates;
  }, [onSelectCoordinates]);

  useEffect(() => {
    initialCoordsRef.current = coordinates;
  }, [coordinates]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    let disposed = false;
    let resizeObserver: ResizeObserver | null = null;

    void import("leaflet").then((mod) => {
      if (disposed || !containerRef.current) {
        return;
      }

      const L = mod;
      leafletRef.current = L;

      const startCoords = initialCoordsRef.current ?? DEFAULT_MAP_CENTER;
      const startZoom = initialCoordsRef.current ? 16 : 5;

      const map = L.map(containerRef.current, {
        center: [startCoords.lat, startCoords.lng],
        zoom: startZoom,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      if (initialCoordsRef.current) {
        upsertDraggableMarker(
          L,
          map,
          markerRef,
          initialCoordsRef.current,
          onSelectRef
        );
      }

      map.on("click", (event: Leaflet.LeafletMouseEvent) => {
        const picked = { lat: event.latlng.lat, lng: event.latlng.lng };
        upsertDraggableMarker(L, map, markerRef, picked, onSelectRef);
        onSelectRef.current(picked);
      });

      mapRef.current = map;

      resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(containerRef.current);
      requestAnimationFrame(() => {
        map.invalidateSize();
      });
    });

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  const lat = coordinates?.lat;
  const lng = coordinates?.lng;

  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) {
      return;
    }

    if (typeof lat !== "number" || typeof lng !== "number") {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }

    upsertDraggableMarker(L, map, markerRef, { lat, lng }, onSelectRef);
    map.setView([lat, lng], Math.max(map.getZoom(), 16), { animate: true });
  }, [lat, lng]);

  return (
    <div
      ref={containerRef}
      className="z-0 h-[290px] w-full bg-slate-100"
      aria-label="Peta interaktif pemilihan lokasi"
    />
  );
}
