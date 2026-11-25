import { MapPin } from "lucide-react";
import { PreviewImage } from "@/features/pages/components/preview/preview-image";
import {
  asString,
  type SectionPreviewData,
} from "@/features/pages/utils/section-preview";
import { cn } from "@/lib/utils";

interface PreviewHeroSplitProps {
  data: SectionPreviewData;
  badge: string;
  title: string;
  imageSrc: string;
  compact?: boolean;
}

export function PreviewHeroSplit({
  data,
  badge,
  title,
  imageSrc,
  compact = false,
}: PreviewHeroSplitProps): React.JSX.Element {
  const imageLabel = asString(data.payload.image_label);
  const imageCaption = asString(data.payload.image_caption);

  return (
    <div
      className={cn(
        "border-b border-slate-200/80 bg-gradient-to-b from-[#F4F8F5] to-white",
        compact ? "px-5 py-6" : "px-10 py-10"
      )}
    >
      <div
        className={cn(
          "grid items-center",
          compact ? "grid-cols-1 gap-5" : "grid-cols-12 gap-8"
        )}
      >
        <div className={compact ? "" : "col-span-6"}>
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
                "mt-3 leading-relaxed text-slate-600",
                compact ? "text-sm" : "text-base"
              )}
            >
              {data.body}
            </p>
          ) : null}
        </div>

        <figure
          className={cn(
            "overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm",
            compact ? "" : "col-span-6"
          )}
        >
          <div className="relative aspect-16/10 w-full">
            <PreviewImage src={imageSrc} alt={title} />
          </div>
          {imageLabel || imageCaption ? (
            <figcaption className="flex items-start gap-2.5 border-t border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                {imageLabel ? (
                  <p className="font-bold text-slate-900">{imageLabel}</p>
                ) : null}
                {imageCaption ? <p className="mt-0.5">{imageCaption}</p> : null}
              </div>
            </figcaption>
          ) : null}
        </figure>
      </div>
    </div>
  );
}
