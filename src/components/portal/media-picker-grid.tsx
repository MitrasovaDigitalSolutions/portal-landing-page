"use client";

import { Check, ImageOff } from "lucide-react";
import { SmartImage } from "@/components/shared/smart-image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MediaItem } from "@/types/cms.types";

interface MediaPickerGridProps {
  items: MediaItem[];
  selectedPath: string;
  onSelect: (path: string) => void;
}

function getFilename(path: string): string {
  const parts = path.split("/").filter(Boolean);
  return parts.at(-1) ?? path;
}

export function MediaPickerGrid({
  items,
  selectedPath,
  onSelect,
}: MediaPickerGridProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {items.map((item) => {
        const isSelected = selectedPath === item.path;
        return (
          <button
            key={item.path}
            type="button"
            onClick={() => {
              onSelect(item.path);
            }}
            className={cn(
              "group flex cursor-pointer flex-col overflow-hidden rounded-xl border text-left transition-all",
              isSelected
                ? "border-primary bg-primary/5 ring-2 ring-primary/25"
                : "border-slate-200 bg-white hover:border-primary/40 hover:shadow-xs"
            )}
          >
            <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
              <SmartImage
                src={item.url}
                fallbackPath={item.path}
                alt={getFilename(item.path)}
                fill
                sizes="200px"
                className="object-cover transition-transform duration-200 group-hover:scale-105"
                fallback={<ImageOff className="size-5 text-slate-400" />}
              />
              {isSelected ? (
                <span className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-white shadow-xs">
                  <Check className="size-3" />
                </span>
              ) : null}
            </div>

            <div className="space-y-1 p-2">
              <p className="truncate text-[11px] font-semibold text-slate-800">
                {getFilename(item.path)}
              </p>
              <div className="flex items-center justify-between gap-1">
                <span className="truncate font-mono text-[10px] text-slate-400">
                  {item.path}
                </span>
                {item.usage.length > 0 ? (
                  <Badge variant="secondary" className="px-1.5 py-0 text-[9px]">
                    {item.usage.length}x
                  </Badge>
                ) : null}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
