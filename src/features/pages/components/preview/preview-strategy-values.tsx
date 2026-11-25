import { Briefcase, Calendar, CheckCircle2, MapPin } from "lucide-react";
import {
  asRecordArray,
  asString,
  type SectionPreviewData,
} from "@/features/pages/utils/section-preview";
import { cn } from "@/lib/utils";

interface PreviewStrategyValuesProps {
  data: SectionPreviewData;
  compact?: boolean;
}

function getDefaultLabels(key: string): { badge: string; title: string } {
  if (key === "program") {
    return { badge: "Inisiatif Kerja", title: "Program Kerja" };
  }
  if (key === "strategi") {
    return { badge: "Arah Strategis", title: "Strategi" };
  }
  return { badge: "Keunggulan", title: "Nilai & Budaya Kerja" };
}

export function PreviewStrategyValues({
  data,
  compact = false,
}: PreviewStrategyValuesProps): React.JSX.Element {
  const defaults = getDefaultLabels(data.key);
  const badge = asString(data.payload.badge, data.subtitle || defaults.badge);
  const title = data.title || defaults.title;
  const items = asRecordArray(data.payload.items);
  const openings = asRecordArray(data.payload.openings);
  const isValues = data.key === "values";

  let desktopGrid = "grid-cols-2 gap-5";
  if (items.length <= 1) {
    desktopGrid = "grid-cols-1 gap-5";
  } else if (isValues && items.length >= 3) {
    desktopGrid = "grid-cols-3 gap-5";
  }

  return (
    <div className={cn("bg-white", compact ? "px-5 py-6" : "px-10 py-10")}>
      <div className="mb-6 max-w-2xl">
        <div className="mb-2.5 inline-flex items-center gap-2.5">
          <span className="h-0.5 w-6 rounded-full bg-primary" />
          <span className="text-xs font-bold tracking-[0.14em] text-primary uppercase">
            {badge}
          </span>
        </div>
        <h2
          className={cn(
            "font-extrabold tracking-tight text-slate-900",
            compact ? "text-xl" : "text-3xl"
          )}
        >
          {title}
        </h2>
        {data.body ? (
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {data.body}
          </p>
        ) : null}
      </div>

      {items.length > 0 ? (
        <div className={cn("grid", compact ? "grid-cols-1 gap-3.5" : desktopGrid)}>
          {items.map((item, idx) => {
            const points = [
              asString(item.desc1),
              asString(item.desc2),
              asString(item.description),
            ].filter(Boolean);
            return (
              <article
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-extrabold text-primary tabular-nums">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {asString(item.title, `Item #${idx + 1}`)}
                  </h3>
                </div>
                {points.length > 0 ? (
                  <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                    {points.map((pt, pIdx) => (
                      <p
                        key={pIdx}
                        className="flex items-start gap-2 text-sm leading-relaxed text-slate-600"
                      >
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{pt}</span>
                      </p>
                    ))}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : null}

      {openings.length > 0 ? (
        <div className="mt-8 space-y-3 border-t border-slate-100 pt-6">
          <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-800">
            <Briefcase className="size-4 text-primary" />
            <span>Lowongan Terbuka ({openings.length})</span>
          </div>
          <div
            className={cn(
              "grid",
              compact || openings.length === 1
                ? "grid-cols-1 gap-3.5"
                : "grid-cols-2 gap-4"
            )}
          >
            {openings.map((job, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {asString(job.type) ? (
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
                      {asString(job.type)}
                    </span>
                  ) : null}
                  {asString(job.location) ? (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="size-3 text-primary" />
                      {asString(job.location)}
                    </span>
                  ) : null}
                </div>
                <h4 className="mt-2 text-base font-bold text-slate-900">
                  {asString(job.title, `Lowongan #${idx + 1}`)}
                </h4>
                {asString(job.description) ? (
                  <p className="mt-1.5 text-sm text-slate-600">
                    {asString(job.description)}
                  </p>
                ) : null}
                {asString(job.deadline) ? (
                  <p className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                    <Calendar className="size-3" />
                    <span>Batas: {asString(job.deadline)}</span>
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {items.length === 0 && openings.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-8 text-center text-xs text-slate-400">
          Tambahkan item pada form untuk melihat kartu pratinjau.
        </p>
      ) : null}
    </div>
  );
}
