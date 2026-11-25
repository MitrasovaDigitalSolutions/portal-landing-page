"use client";

import { Image as ImageIcon } from "lucide-react";
import { SmartImage } from "@/components/shared/smart-image";
import { cn } from "@/lib/utils";

interface PreviewImageProps {
  src: string | null;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function PreviewImage({
  src,
  alt,
  className,
  fallbackLabel = "Belum ada gambar",
}: PreviewImageProps): React.JSX.Element {
  if (!src) {
    return (
      <div
        className={cn(
          "flex size-full flex-col items-center justify-center gap-1.5 bg-slate-100 px-4 text-center text-slate-400",
          className
        )}
      >
        <ImageIcon className="size-6 opacity-60" />
        <span className="text-[11px] font-medium">{fallbackLabel}</span>
      </div>
    );
  }

  if (src.startsWith("blob:")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={cn("absolute inset-0 size-full object-cover", className)}
      />
    );
  }

  return (
    <SmartImage
      src={src}
      alt={alt}
      fill
      sizes="640px"
      className={cn("object-cover", className)}
    />
  );
}
