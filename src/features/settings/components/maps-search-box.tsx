"use client";

import { Compass, Loader2, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MapsSearchPlace } from "@/features/settings/utils/maps-embed";

interface MapsSearchBoxProps {
  currentAddress: string;
  onSelectPlace: (place: MapsSearchPlace) => void;
}

async function fetchPlacesSearch(
  term: string,
  signal: AbortSignal
): Promise<MapsSearchPlace[]> {
  const res = await fetch(`/api/maps/search?q=${encodeURIComponent(term)}`, { signal });
  if (!res.ok) return [];
  const data = (await res.json()) as { items?: MapsSearchPlace[] };
  return Array.isArray(data.items) ? data.items : [];
}

export function MapsSearchBox({
  currentAddress,
  onSelectPlace,
}: MapsSearchBoxProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MapsSearchPlace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const runSearch = async (term: string): Promise<void> => {
    const trimmed = term.trim();
    if (trimmed.length < 2) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);
    try {
      setResults(await fetchPlacesSearch(trimmed, controller.signal));
      setHasSearched(true);
      setIsOpen(true);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setResults([]);
      setHasSearched(true);
    } finally {
      if (abortRef.current === controller) setIsLoading(false);
    }
  };

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    const timer = window.setTimeout(() => {
      void runSearch(trimmed);
    }, 350);
    return () => { window.clearTimeout(timer); };
  }, [query]);

  useEffect(() => {
    const onOutside = (event: MouseEvent): void => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    return () => { document.removeEventListener("mousedown", onOutside); abortRef.current?.abort(); };
  }, []);

  const clearSearch = (): void => {
    abortRef.current?.abort();
    setQuery("");
    setResults([]);
    setHasSearched(false);
    setIsOpen(false);
  };

  const handleInputChange = (next: string): void => {
    setQuery(next);
    if (next.trim().length < 2) {
      abortRef.current?.abort();
      setResults([]);
      setHasSearched(false);
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  const showDropdown = isOpen && (results.length > 0 || hasSearched);

  return (
    <div ref={containerRef} className="relative space-y-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            value={query}
            onChange={(e) => { handleInputChange(e.target.value); }}
            onFocus={() => { if (results.length > 0) setIsOpen(true); }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void runSearch(query); } }}
            placeholder="Cari nama lokasi, gedung, jalan, atau kota..."
            className="pr-9 pl-9"
          />
          {isLoading ? <Loader2 className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-primary" /> : null}
          {!isLoading && query.length > 0 ? (
            <button type="button" aria-label="Hapus pencarian" onClick={clearSearch} className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-700">
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>
        {currentAddress.trim().length > 0 ? (
          <Button type="button" variant="outline" size="sm" onClick={() => { setQuery(currentAddress.trim()); void runSearch(currentAddress); }} className="h-9 gap-1.5 rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:border-primary/40 hover:text-primary">
            <Compass className="size-3.5" />
            <span>Cari dari Alamat</span>
          </Button>
        ) : null}
      </div>
      {showDropdown ? (
        <ul className="absolute z-30 max-h-60 w-full divide-y divide-slate-100 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
          {results.length > 0 ? (
            results.map((item) => (
              <li key={item.id}>
                <button type="button" onClick={() => { onSelectPlace(item); setQuery(item.title); setIsOpen(false); }} className="w-full px-3.5 py-2 text-left transition-colors hover:bg-slate-50">
                  <p className="truncate text-xs font-semibold text-slate-800">{item.title}</p>
                  <p className="truncate text-[11px] text-slate-500">{item.address}</p>
                </button>
              </li>
            ))
          ) : (
            <li className="px-3.5 py-2.5 text-xs text-slate-500">Lokasi tidak ditemukan. Coba kata kunci lebih umum atau klik langsung pada peta.</li>
          )}
        </ul>
      ) : null}
    </div>
  );
}
