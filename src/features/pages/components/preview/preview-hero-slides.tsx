"use client";

import * as React from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { PreviewImage } from "@/features/pages/components/preview/preview-image";
import {
  asRecord,
  asRecordArray,
  asString,
  resolvePreviewImage,
  type SectionPreviewData,
} from "@/features/pages/utils/section-preview";
import { cn } from "@/lib/utils";

interface PreviewHeroSlidesProps {
  data: SectionPreviewData;
  slides: Record<string, unknown>[];
  compact?: boolean;
}

function resolveSlideState(
  data: SectionPreviewData,
  activeSlide: Record<string, unknown>
) {
  const ctaPrimary = asRecord(data.payload.cta_primary);
  const ctaSecondary = asRecord(data.payload.cta_secondary);
  const rawPrimary = asString(ctaPrimary.text);
  const rawSecondary = asString(ctaSecondary.text);
  const showDefaults = !rawPrimary && !rawSecondary;

  return {
    title: asString(activeSlide.title, data.title || "Judul Slide Hero"),
    desc: asString(activeSlide.description, data.body),
    badge: asString(
      activeSlide.badge,
      asString(data.payload.badge, data.subtitle)
    ),
    image: resolvePreviewImage(activeSlide, data.imageSrc),
    showPrimary: Boolean(rawPrimary) || showDefaults,
    showSecondary: Boolean(rawSecondary) || showDefaults,
    primaryText: rawPrimary || "Pelajari Lebih Lanjut",
    secondaryText: rawSecondary || "Hubungi Kami",
    stats: asRecordArray(data.payload.stats),
  };
}

export function PreviewHeroSlides({
  data,
  slides,
  compact = false,
}: PreviewHeroSlidesProps): React.JSX.Element {
  const [slideIdx, setSlideIdx] = React.useState(0);
  const safeIdx = slideIdx < slides.length ? slideIdx : 0;
  const view = resolveSlideState(data, slides[safeIdx] ?? {});

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between overflow-hidden bg-slate-950 text-white",
        compact ? "min-h-[300px] px-5 py-8" : "min-h-[400px] px-10 py-12"
      )}
    >
      {view.image ? (
        <div className="absolute inset-0">
          <PreviewImage src={view.image} alt={view.title} />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-primary/40" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/30" />

      <div className="relative z-10 max-w-2xl space-y-3.5">
        {view.badge ? (
          <div className="inline-flex items-center gap-2.5">
            <span className="h-0.5 w-6 rounded-full bg-primary" />
            <span className="text-xs font-bold tracking-[0.14em] text-white/90 uppercase">
              {view.badge}
            </span>
          </div>
        ) : null}

        <h2
          className={cn(
            "font-extrabold tracking-tight",
            compact ? "text-2xl leading-snug" : "text-4xl leading-[1.14]"
          )}
        >
          {view.title}
        </h2>

        {view.desc ? (
          <p
            className={cn(
              "max-w-xl leading-relaxed text-slate-200",
              compact ? "text-xs" : "text-base"
            )}
          >
            {view.desc}
          </p>
        ) : null}

        <div className={cn("flex flex-wrap gap-3 pt-2", compact && "gap-2")}>
          {view.showPrimary ? (
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-xl bg-primary font-bold text-white shadow-md",
                compact ? "h-9 px-4 text-xs" : "h-11 px-6 text-sm"
              )}
            >
              <span>{view.primaryText}</span>
              <ArrowRight className="size-4" />
            </span>
          ) : null}
          {view.showSecondary ? (
            <span
              className={cn(
                "inline-flex items-center rounded-xl border border-white/30 bg-white/10 font-semibold text-white",
                compact ? "h-9 px-4 text-xs" : "h-11 px-6 text-sm"
              )}
            >
              {view.secondaryText}
            </span>
          ) : null}
        </div>
      </div>

      <div className="relative z-10 mt-8 flex flex-wrap items-center justify-between gap-4">
        {view.stats.length > 0 ? (
          <div className="flex flex-wrap items-center gap-5 rounded-xl border border-white/15 bg-slate-950/45 px-4 py-2.5 backdrop-blur-xs">
            {view.stats.slice(0, 4).map((stat, idx) => (
              <div key={idx}>
                <p className="text-base font-extrabold text-white tabular-nums">
                  {asString(stat.value, "-")}
                </p>
                <p className="text-[10px] font-semibold text-slate-300 uppercase">
                  {asString(stat.label, "-")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <span />
        )}

        {slides.length > 1 ? (
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full border border-white/20 bg-slate-950/50 px-3 py-1 font-bold tabular-nums">
              {String(safeIdx + 1).padStart(2, "0")} /{" "}
              {String(slides.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              aria-label="Slide sebelumnya"
              onClick={() => {
                setSlideIdx((safeIdx - 1 + slides.length) % slides.length);
              }}
              className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-white/20 bg-slate-950/50 hover:bg-white/20"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Slide berikutnya"
              onClick={() => {
                setSlideIdx((safeIdx + 1) % slides.length);
              }}
              className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-white/20 bg-slate-950/50 hover:bg-white/20"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
