import { ArrowRight, PhoneCall } from "lucide-react";
import { asString, type SectionPreviewData } from "@/features/pages/utils/section-preview";
import { cn } from "@/lib/utils";

interface PreviewCtaProps {
  data: SectionPreviewData;
  compact?: boolean;
}

export function PreviewCta({
  data,
  compact = false,
}: PreviewCtaProps): React.JSX.Element {
  const title = data.title || "Siap Bermitra Bersama Kami?";
  const subtitle = data.subtitle || "Konsultasi & Penawaran Solusi Terbaik";
  const body =
    data.body ||
    "Diskusikan kebutuhan Anda bersama tim layanan resmi kami untuk solusi terbaik.";
  const buttonLabel = asString(
    data.payload.button_label,
    asString(data.payload.button_text, "Hubungi Kami")
  );

  return (
    <div className={cn("bg-white", compact ? "px-5 py-6" : "px-10 py-10")}>
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl bg-primary text-white shadow-xl",
          compact ? "px-6 py-8" : "px-10 py-12"
        )}
      >
        <div className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-white/10 blur-3xl" />
        <div
          className={cn(
            "relative z-10 flex justify-between gap-6",
            compact ? "flex-col items-start" : "flex-row items-center"
          )}
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3.5 py-1 text-xs font-bold tracking-wider uppercase">
              <PhoneCall className="size-3.5" />
              <span>{subtitle}</span>
            </div>
            <h2
              className={cn(
                "mt-3.5 font-extrabold tracking-tight",
                compact ? "text-xl" : "text-3xl"
              )}
            >
              {title}
            </h2>
            <p
              className={cn(
                "mt-2.5 leading-relaxed text-white/90",
                compact ? "text-xs" : "text-base"
              )}
            >
              {body}
            </p>
          </div>

          <span className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-primary shadow-lg">
            <span>{buttonLabel}</span>
            <ArrowRight className="size-4" />
          </span>
        </div>
      </div>
    </div>
  );
}
