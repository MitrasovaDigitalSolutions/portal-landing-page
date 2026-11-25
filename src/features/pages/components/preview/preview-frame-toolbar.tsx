"use client";

import { Maximize2, Monitor, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PreviewViewport = "desktop" | "mobile";

interface PreviewFrameToolbarProps {
  domain: string;
  pageSlug: string;
  sectionKey: string;
  zoomPercent: number;
  viewport: PreviewViewport;
  onViewportChange: (viewport: PreviewViewport) => void;
  fullWidth: boolean;
  onExpand?: () => void;
}

export function PreviewFrameToolbar({
  domain,
  pageSlug,
  sectionKey,
  zoomPercent,
  viewport,
  onViewportChange,
  fullWidth,
  onExpand,
}: PreviewFrameToolbarProps): React.JSX.Element {
  const isMobile = viewport === "mobile";

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-2">
      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1">
        <Badge
          variant="success"
          className="rounded px-1.5 py-0 text-[9px] font-bold uppercase"
        >
          Live
        </Badge>
        <span className="truncate font-mono text-[10px] text-slate-500">
          {domain}/{pageSlug}
          {sectionKey ? `#${sectionKey}` : ""}
        </span>
        <span className="ml-auto shrink-0 font-mono text-[10px] font-semibold text-slate-400 tabular-nums">
          {zoomPercent}%
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
          <button
            type="button"
            onClick={() => {
              onViewportChange("desktop");
            }}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold",
              !isMobile ? "bg-white text-primary shadow-2xs" : "text-slate-500"
            )}
          >
            <Monitor className="size-3" />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onViewportChange("mobile");
            }}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold",
              isMobile ? "bg-white text-primary shadow-2xs" : "text-slate-500"
            )}
          >
            <Smartphone className="size-3" />
            <span>Mobile</span>
          </button>
        </div>

        {onExpand && !fullWidth ? (
          <Button
            type="button"
            variant="outline"
            size="icon-xs"
            title="Perluas preview"
            aria-label="Perluas preview"
            onClick={onExpand}
            className="size-7 rounded-lg border-slate-200 text-slate-600"
          >
            <Maximize2 className="size-3.5" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
