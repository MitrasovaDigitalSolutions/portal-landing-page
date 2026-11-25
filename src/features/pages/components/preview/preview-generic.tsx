import { ArrowUpRight } from "lucide-react";
import { PreviewImage } from "@/features/pages/components/preview/preview-image";
import {
  asRecord,
  asString,
  resolvePreviewImage,
  splitParagraphs,
  type SectionPreviewData,
} from "@/features/pages/utils/section-preview";
import { cn } from "@/lib/utils";

interface PreviewGenericProps {
  data: SectionPreviewData;
  compact?: boolean;
}

export function PreviewGeneric({
  data,
  compact = false,
}: PreviewGenericProps): React.JSX.Element {
  const badge = asString(data.payload.badge, data.subtitle);
  const paragraphs = splitParagraphs(data.body);
  const imageSrc = resolvePreviewImage(data.payload, data.imageSrc);
  const ctaPrimary = asRecord(data.payload.cta_primary);
  const ctaLabel =
    asString(ctaPrimary.text) ||
    asString(data.payload.button_label) ||
    asString(data.payload.button_text) ||
    asString(data.payload.cta_text);

  if (!data.title && paragraphs.length === 0 && !imageSrc) {
    return (
      <div className="bg-white p-10 text-center text-xs text-slate-400">
        Isi judul, deskripsi konten, atau pilih gambar untuk melihat pratinjau section ini.
      </div>
    );
  }

  const hasTwoColumns = !compact && Boolean(imageSrc);

  return (
    <div className={cn("bg-white", compact ? "px-5 py-6" : "px-10 py-10")}>
      <div
        className={cn(
          "grid items-center gap-8",
          hasTwoColumns ? "grid-cols-12" : "max-w-4xl grid-cols-1"
        )}
      >
        <div className={hasTwoColumns ? "col-span-7" : ""}>
          {badge ? (
            <div className="mb-2 inline-flex items-center gap-2.5">
              <span className="h-0.5 w-6 rounded-full bg-primary" />
              <span className="text-xs font-bold tracking-[0.14em] text-primary uppercase">
                {badge}
              </span>
            </div>
          ) : null}

          {data.title ? (
            <h2
              className={cn(
                "font-extrabold tracking-tight text-slate-900",
                compact ? "text-xl" : "text-3xl"
              )}
            >
              {data.title}
            </h2>
          ) : null}

          {paragraphs.length > 0 ? (
            <div className="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-600">
              {paragraphs.map((text, idx) => (
                <p key={idx}>{text}</p>
              ))}
            </div>
          ) : null}

          {ctaLabel ? (
            <div className="mt-5">
              <span className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-5 text-xs font-bold text-white">
                <span>{ctaLabel}</span>
                <ArrowUpRight className="size-3.5" />
              </span>
            </div>
          ) : null}
        </div>

        {imageSrc ? (
          <div
            className={cn(
              "relative aspect-16/10 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100",
              hasTwoColumns && "col-span-5"
            )}
          >
            <PreviewImage src={imageSrc} alt={data.title || "Ilustrasi"} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
