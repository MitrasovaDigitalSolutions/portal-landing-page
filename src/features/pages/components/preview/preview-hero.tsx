"use client";

import { PreviewHeroSlides } from "@/features/pages/components/preview/preview-hero-slides";
import { PreviewHeroSplit } from "@/features/pages/components/preview/preview-hero-split";
import {
  asRecordArray,
  asString,
  resolvePreviewImage,
  type SectionPreviewData,
} from "@/features/pages/utils/section-preview";
import { cn } from "@/lib/utils";

interface PreviewHeroProps {
  data: SectionPreviewData;
  compact?: boolean;
}

function getHeroStatsCols(count: number, compact: boolean): string {
  if (count <= 1) return "grid-cols-1";
  if (compact || count === 2) return "grid-cols-2";
  return "grid-cols-3";
}

export function PreviewHero({
  data,
  compact = false,
}: PreviewHeroProps): React.JSX.Element {
  const slides = asRecordArray(data.payload.slides);
  if (slides.length > 0) {
    return <PreviewHeroSlides data={data} slides={slides} compact={compact} />;
  }

  const stats = asRecordArray(data.payload.stats);
  const splitImage = resolvePreviewImage(data.payload, data.imageSrc);
  const badge = asString(data.payload.badge, data.subtitle || data.pageTitle);
  const title = data.title || data.pageTitle || "Judul Hero Halaman";

  if (splitImage) {
    return (
      <PreviewHeroSplit
        data={data}
        badge={badge}
        title={title}
        imageSrc={splitImage}
        compact={compact}
      />
    );
  }

  return (
    <div
      className={cn(
        "border-b border-slate-200/80 bg-gradient-to-b from-[#F4F8F5] to-white",
        compact ? "px-5 py-6" : "px-10 py-10"
      )}
    >
      <div
        className={cn(
          "flex justify-between gap-6",
          compact ? "flex-col items-start" : "flex-row items-end"
        )}
      >
        <div className="max-w-2xl">
          <div className="mb-2.5 inline-flex items-center gap-2.5">
            <span className="h-0.5 w-6 rounded-full bg-primary" />
            <span className="text-xs font-bold tracking-[0.14em] text-primary uppercase">
              {badge}
            </span>
          </div>
          <h2
            className={cn(
              "font-extrabold tracking-tight text-slate-900",
              compact ? "text-2xl" : "text-3xl leading-tight"
            )}
          >
            {title}
          </h2>
          {data.body ? (
            <p
              className={cn(
                "mt-2.5 leading-relaxed text-slate-600",
                compact ? "text-sm" : "text-base"
              )}
            >
              {data.body}
            </p>
          ) : null}
        </div>

        {stats.length > 0 ? (
          <dl
            className={cn(
              "grid shrink-0 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-2xs",
              compact && "w-full",
              getHeroStatsCols(stats.length, compact)
            )}
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="px-5 py-3.5 text-center">
                <dd className="text-xl font-extrabold text-primary tabular-nums">
                  {asString(stat.value, "-")}
                </dd>
                <dt className="mt-0.5 text-[11px] font-semibold text-slate-500 uppercase">
                  {asString(stat.label, "-")}
                </dt>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </div>
  );
}
