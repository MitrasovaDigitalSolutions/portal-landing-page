import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Scrollable } from "@/components/ui/scrollable";
import { resolveUsageMeta } from "@/features/media/utils/media-format";
import type { MediaUsageRef } from "@/types/cms.types";

interface MediaUsageListProps {
  usage: MediaUsageRef[];
  onNavigate?: () => void;
}

export function MediaUsageList({
  usage,
  onNavigate,
}: MediaUsageListProps): React.JSX.Element {
  if (usage.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-4 text-center text-xs text-slate-500">
        Gambar ini tidak direferensikan oleh konten atau pengaturan mana pun.
      </div>
    );
  }

  return (
    <Scrollable className="max-h-44 rounded-xl border border-slate-200 bg-white">
      <ul className="divide-y divide-slate-100">
        {usage.map((ref, idx) => {
          const meta = resolveUsageMeta(ref);
          return (
            <li
              key={`${ref.type}-${ref.id}-${ref.field}-${idx}`}
              className="flex items-center justify-between gap-3 px-3.5 py-2.5"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">
                    {meta.typeLabel}
                  </Badge>
                  <span className="truncate text-xs font-semibold text-slate-800">
                    {ref.label ?? `#${ref.id}`}
                  </span>
                </div>
                <p className="mt-0.5 font-mono text-[10px] text-slate-400">
                  field: {ref.field}
                </p>
              </div>

              <Link
                href={meta.href}
                onClick={onNavigate}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-primary hover:bg-primary/5"
              >
                <span>Buka</span>
                <ArrowUpRight className="size-3" />
              </Link>
            </li>
          );
        })}
      </ul>
    </Scrollable>
  );
}
