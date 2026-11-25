import { PreviewImage } from "@/features/pages/components/preview/preview-image";
import {
  resolvePreviewImage,
  splitParagraphs,
  type SectionPreviewData,
} from "@/features/pages/utils/section-preview";
import { cn } from "@/lib/utils";

interface PreviewHistoryProps {
  data: SectionPreviewData;
  compact?: boolean;
}

export function PreviewHistory({
  data,
  compact = false,
}: PreviewHistoryProps): React.JSX.Element {
  const badge = data.subtitle || "Perjalanan Lembaga";
  const title = data.title || "Sejarah Kami";
  const paragraphs = splitParagraphs(data.body);
  const imageSrc = resolvePreviewImage(data.payload, data.imageSrc);
  const hasTwoColumns = !compact && Boolean(imageSrc);

  return (
    <div className={cn("bg-white", compact ? "px-5 py-6" : "px-10 py-10")}>
      <div
        className={cn(
          "grid gap-8",
          hasTwoColumns ? "grid-cols-12" : "max-w-4xl grid-cols-1"
        )}
      >
        <div className={hasTwoColumns ? "col-span-5" : ""}>
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
          {imageSrc ? (
            <div className="relative mt-5 aspect-16/10 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <PreviewImage src={imageSrc} alt={title} />
            </div>
          ) : null}
        </div>

        <div className={cn("space-y-4", hasTwoColumns && "col-span-7")}>
          {paragraphs.length > 0 ? (
            paragraphs.map((text, idx) => (
              <p
                key={idx}
                className={cn(
                  "leading-relaxed text-slate-600",
                  compact ? "text-sm" : "text-base"
                )}
              >
                {text}
              </p>
            ))
          ) : (
            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs text-slate-400">
              Isi teks sejarah pada kolom Isi / Deskripsi Konten (pisahkan paragraf dengan baris kosong).
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
