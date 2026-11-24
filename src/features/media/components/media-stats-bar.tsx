import { CheckCircle2, FolderOpen, HardDrive, ImageOff } from "lucide-react";
import { formatMediaSize } from "@/features/media/utils/media-format";
import type { MediaItem } from "@/types/cms.types";

interface MediaStatsBarProps {
  items: MediaItem[];
}

export function MediaStatsBar({
  items,
}: MediaStatsBarProps): React.JSX.Element {
  const usedCount = items.filter((item) => item.usage.length > 0).length;
  const unusedCount = items.length - usedCount;
  const totalBytes = items.reduce((sum, item) => sum + item.size, 0);

  const stats = [
    {
      label: "Total Gambar",
      value: String(items.length),
      icon: FolderOpen,
      tone: "bg-primary/10 text-primary",
    },
    {
      label: "Dipakai Konten",
      value: String(usedCount),
      icon: CheckCircle2,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Tidak Terpakai",
      value: String(unusedCount),
      icon: ImageOff,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      label: "Ukuran Storage",
      value: formatMediaSize(totalBytes),
      icon: HardDrive,
      tone: "bg-slate-100 text-slate-700",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white px-4 py-3.5 shadow-2xs"
          >
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${stat.tone}`}
            >
              <Icon className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-medium text-slate-500">
                {stat.label}
              </p>
              <p className="text-base font-extrabold text-slate-900 tabular-nums">
                {stat.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
