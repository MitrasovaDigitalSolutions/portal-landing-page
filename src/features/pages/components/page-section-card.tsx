"use client";

import { Edit2, Image as ImageIcon, Trash2 } from "lucide-react";
import { SmartImage } from "@/components/shared/smart-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { PageSection } from "@/types/cms.types";
import { resolveMediaUrl } from "@/utils/media";

interface PageSectionCardProps {
  section: PageSection;
  onEdit: (section: PageSection) => void;
  onDelete: (section: PageSection) => void;
}

function summarizePayloadKeys(
  payload: Record<string, unknown> | null
): string[] {
  if (!payload || typeof payload !== "object") {
    return [];
  }
  const summary: string[] = [];
  for (const [key, value] of Object.entries(payload)) {
    if (value === null || value === undefined || value === "") {
      continue;
    }
    summary.push(Array.isArray(value) ? `${key} (${value.length})` : key);
  }
  return summary;
}

export function PageSectionCard({
  section,
  onEdit,
  onDelete,
}: PageSectionCardProps): React.JSX.Element {
  const imageUrl = resolveMediaUrl(section.image_url, section.image_path);
  const payloadKeys = summarizePayloadKeys(section.payload);

  return (
    <Card className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs transition-colors hover:border-slate-300 sm:p-5">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 tabular-nums">
              #{section.order}
            </span>
            <Badge
              variant="secondary"
              className="rounded-md font-mono text-[10px] font-bold text-primary"
            >
              {section.key}
            </Badge>
            <StatusBadge
              status={section.is_active ? "active" : "inactive"}
            />
            {section.subtitle ? (
              <span className="truncate rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                {section.subtitle}
              </span>
            ) : null}
          </div>

          <h3 className="truncate text-sm font-bold text-slate-900 sm:text-base">
            {section.title ?? "(Tanpa judul)"}
          </h3>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Edit section ${section.key}`}
            onClick={() => {
              onEdit(section);
            }}
            className="text-amber-600 hover:bg-amber-50 hover:text-amber-700"
          >
            <Edit2 className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Hapus section ${section.key}`}
            onClick={() => {
              onDelete(section);
            }}
            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-start gap-3">
        {imageUrl ? (
          <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <SmartImage
              src={imageUrl}
              alt={section.title ?? section.key}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-300">
            <ImageIcon className="size-5" />
          </div>
        )}

        <div className="min-w-0 flex-1 space-y-2">
          <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">
            {section.body ?? "Tidak ada isi teks deskripsi."}
          </p>

          {payloadKeys.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {payloadKeys.map((key) => (
                <code
                  key={key}
                  className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
                >
                  {key}
                </code>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
