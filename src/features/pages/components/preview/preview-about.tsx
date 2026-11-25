import { Award } from "lucide-react";
import { PreviewImage } from "@/features/pages/components/preview/preview-image";
import {
  asRecordArray,
  asString,
  resolvePreviewImage,
  splitParagraphs,
  type SectionPreviewData,
} from "@/features/pages/utils/section-preview";
import { cn } from "@/lib/utils";

interface PreviewAboutProps {
  data: SectionPreviewData;
  compact?: boolean;
}

function getAboutStatsCols(count: number, compact: boolean): string {
  if (count <= 1) return "grid-cols-1";
  if (compact || count === 2) return "grid-cols-2";
  return "grid-cols-3";
}

export function PreviewAbout({
  data,
  compact = false,
}: PreviewAboutProps): React.JSX.Element {
  const badge = asString(data.payload.badge, data.subtitle || "Profil Institusi");
  const title = data.title || "Tentang Kami";
  const stats = asRecordArray(data.payload.stats);
  const paragraphs = splitParagraphs(data.body);
  const imageSrc = resolvePreviewImage(data.payload, data.imageSrc);
  const hasTwoColumns = !compact && Boolean(imageSrc);

  return (
    <div className={cn("bg-white", compact ? "px-5 py-6" : "px-10 py-10")}>
      <div
        className={cn(
          "grid items-center gap-8",
          hasTwoColumns ? "grid-cols-12" : "max-w-4xl grid-cols-1"
        )}
      >
        <div className={hasTwoColumns ? "col-span-6" : ""}>
          <div className="mb-2.5 inline-flex items-center gap-2.5">
            <span className="h-1 w-6 rounded-full bg-primary" />
            <span className="text-xs font-bold tracking-wider text-primary uppercase">
              {badge}
            </span>
          </div>

          <h2
            className={cn(
              "font-extrabold tracking-tight text-slate-900",
              compact ? "text-2xl" : "text-3xl"
            )}
          >
            {title}
          </h2>

          {paragraphs.length > 0 ? (
            <div className="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-600">
              {paragraphs.map((text, idx) => (
                <p key={idx}>{text}</p>
              ))}
            </div>
          ) : null}

          {stats.length > 0 ? (
            <div
              className={cn(
                "mt-6 grid gap-3.5",
                getAboutStatsCols(stats.length, compact)
              )}
            >
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 via-white to-sky-50/50 p-4 shadow-2xs"
                >
                  <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Award className="size-4" />
                  </div>
                  <p className="mt-3 text-xl font-extrabold text-slate-900 tabular-nums">
                    {asString(stat.value, "-")}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-600">
                    {asString(stat.label, "-")}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {imageSrc ? (
          <div
            className={cn(
              "relative aspect-16/10 overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-lg",
              hasTwoColumns && "col-span-6"
            )}
          >
            <PreviewImage src={imageSrc} alt={title} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
