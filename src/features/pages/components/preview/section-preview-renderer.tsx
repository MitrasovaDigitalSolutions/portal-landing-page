import { Layers } from "lucide-react";
import { PreviewAbout } from "@/features/pages/components/preview/preview-about";
import { PreviewCta } from "@/features/pages/components/preview/preview-cta";
import { PreviewFeatured } from "@/features/pages/components/preview/preview-featured";
import { PreviewGeneric } from "@/features/pages/components/preview/preview-generic";
import { PreviewHero } from "@/features/pages/components/preview/preview-hero";
import { PreviewHistory } from "@/features/pages/components/preview/preview-history";
import { PreviewInstagram } from "@/features/pages/components/preview/preview-instagram";
import { PreviewOffice } from "@/features/pages/components/preview/preview-office";
import { PreviewStrategyValues } from "@/features/pages/components/preview/preview-strategy-values";
import { PreviewVisionMission } from "@/features/pages/components/preview/preview-vision-mission";
import type { SectionPreviewData } from "@/features/pages/utils/section-preview";

interface SectionPreviewRendererProps {
  data: SectionPreviewData;
  compact?: boolean;
}

export function SectionPreviewRenderer({
  data,
  compact = false,
}: SectionPreviewRendererProps): React.JSX.Element {
  const key = data.key.trim();

  if (!key) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 bg-slate-50/70 px-6 py-16 text-center">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-200/70 text-slate-400">
          <Layers className="size-5" />
        </div>
        <p className="text-xs font-bold text-slate-700">
          Pilih Tipe Section terlebih dahulu
        </p>
        <p className="max-w-xs text-[11px] text-slate-500">
          Begitu tipe dipilih, pratinjau tampilan di landing page akan muncul secara real-time di sini.
        </p>
      </div>
    );
  }

  switch (key) {
    case "hero":
      return <PreviewHero data={data} compact={compact} />;
    case "featured":
      return <PreviewFeatured data={data} compact={compact} />;
    case "about":
      return <PreviewAbout data={data} compact={compact} />;
    case "office":
      return <PreviewOffice data={data} compact={compact} />;
    case "cta":
      return <PreviewCta data={data} compact={compact} />;
    case "sejarah":
      return <PreviewHistory data={data} compact={compact} />;
    case "visi-misi":
    case "vision_mission":
      return <PreviewVisionMission data={data} compact={compact} />;
    case "strategi":
    case "program":
    case "values":
      return <PreviewStrategyValues data={data} compact={compact} />;
    case "instagram":
      return <PreviewInstagram data={data} compact={compact} />;
    default:
      return <PreviewGeneric data={data} compact={compact} />;
  }
}
