"use client";

import { Search, X } from "lucide-react";

interface TenantSwitcherSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function TenantSwitcherSearch({
  value,
  onChange,
}: TenantSwitcherSearchProps): React.JSX.Element {
  return (
    <div className="border-b border-slate-100 p-1.5">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          placeholder="Cari tenant atau slug..."
          aria-label="Cari tenant"
          className="h-7 w-full rounded-md border border-slate-200 bg-slate-50/80 pr-7 pl-7.5 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
        />
        {value.length > 0 ? (
          <button
            type="button"
            onClick={() => {
              onChange("");
            }}
            aria-label="Hapus pencarian"
            className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded p-0.5 text-slate-400 transition-colors hover:bg-slate-200/70 hover:text-slate-600"
          >
            <X className="size-3" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
