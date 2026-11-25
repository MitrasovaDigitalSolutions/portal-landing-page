"use client";

import * as React from "react";
import { EyeOff } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import {
  PreviewFrameToolbar,
  type PreviewViewport,
} from "@/features/pages/components/preview/preview-frame-toolbar";
import { PreviewScaledCanvas } from "@/features/pages/components/preview/preview-scaled-canvas";
import { SectionPreviewRenderer } from "@/features/pages/components/preview/section-preview-renderer";
import type { SectionFormValues } from "@/features/pages/schemas/page.schemas";
import {
  asRecord,
  type SectionPreviewData,
} from "@/features/pages/utils/section-preview";
import { cn } from "@/lib/utils";
import { useTenant } from "@/providers/tenant-provider";
import type { PageDetail, PageSection } from "@/types/cms.types";
import { resolveMediaUrl } from "@/utils/media";

interface SectionPreviewFrameProps {
  page: PageDetail;
  section: PageSection | null;
  extraKeys: Record<string, unknown>;
  fullWidth?: boolean;
  onExpand?: () => void;
}

export function SectionPreviewFrame({
  page,
  section,
  extraKeys,
  fullWidth = false,
  onExpand,
}: SectionPreviewFrameProps): React.JSX.Element {
  const [viewport, setViewport] = React.useState<PreviewViewport>("desktop");
  const [zoomPercent, setZoomPercent] = React.useState<number>(100);
  const [blobPreview, setBlobPreview] = React.useState<{
    file: File;
    url: string;
  } | null>(null);

  const { activeSite, siteTitle } = useTenant();
  const { control } = useFormContext<SectionFormValues>();

  const watchedKey = useWatch({ control, name: "key" });
  const watchedTitle = useWatch({ control, name: "title" });
  const watchedSubtitle = useWatch({ control, name: "subtitle" });
  const watchedBody = useWatch({ control, name: "body" });
  const watchedPayload = useWatch({ control, name: "payload" });
  const watchedIsActive = useWatch({ control, name: "is_active" });
  const watchedImage = useWatch({ control, name: "image" });

  React.useEffect(() => {
    if (!(watchedImage instanceof File) || watchedImage.size === 0) return;
    const objectUrl = URL.createObjectURL(watchedImage);
    const raf = window.requestAnimationFrame(() => {
      setBlobPreview({ file: watchedImage, url: objectUrl });
    });
    return () => {
      window.cancelAnimationFrame(raf);
      URL.revokeObjectURL(objectUrl);
    };
  }, [watchedImage]);

  let resolvedImageSrc = resolveMediaUrl(section?.image_url, section?.image_path);
  if (watchedImage instanceof File && blobPreview?.file === watchedImage) {
    resolvedImageSrc = blobPreview.url;
  }

  const domain = activeSite?.slug ?? "landing-page";
  const previewData: SectionPreviewData = {
    key: watchedKey,
    title: watchedTitle,
    subtitle: watchedSubtitle,
    body: watchedBody,
    isActive: watchedIsActive,
    imageSrc: resolvedImageSrc,
    payload: { ...extraKeys, ...asRecord(watchedPayload) },
    pageSlug: page.slug,
    pageTitle: page.title,
    siteName: siteTitle ?? activeSite?.name ?? "Site",
    siteDomain: domain,
  };

  const isMobile = viewport === "mobile";

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-100/90 shadow-xs">
      <PreviewFrameToolbar
        domain={domain}
        pageSlug={page.slug}
        sectionKey={watchedKey}
        zoomPercent={zoomPercent}
        viewport={viewport}
        onViewportChange={setViewport}
        fullWidth={fullWidth}
        onExpand={onExpand}
      />

      {!watchedIsActive ? (
        <div className="flex items-center gap-2 border-b border-amber-200 bg-amber-50 px-3.5 py-1.5 text-[11px] font-medium text-amber-800">
          <EyeOff className="size-3.5 shrink-0 text-amber-600" />
          <span>Section nonaktif di publik — pratinjau tetap ditampilkan.</span>
        </div>
      ) : null}

      <div
        className={cn(
          "p-3 sm:p-4",
          !fullWidth && "max-h-[calc(100vh-11rem)] overflow-y-auto",
          isMobile && "bg-slate-200/70"
        )}
      >
        <PreviewScaledCanvas viewport={viewport} onScaleChange={setZoomPercent}>
          <SectionPreviewRenderer data={previewData} compact={isMobile} />
        </PreviewScaledCanvas>
      </div>
    </div>
  );
}
