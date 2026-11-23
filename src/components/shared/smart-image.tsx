"use client";

import { cn } from "@/lib/utils";
import {
  buildMediaVariantUrl,
  isOptimizableProxyMedia,
  resolveMediaUrl,
} from "@/utils/media";
import { ImageOff } from "lucide-react";
import Image, { type ImageLoaderProps } from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface SmartImageProps {
  src?: string | null;
  fallbackPath?: string | null;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  blurPreview?: boolean;
  className?: string;
  fallbackClassName?: string;
  fallback?: ReactNode;
}

function mediaImageLoader({ src, width, quality }: ImageLoaderProps): string {
  return buildMediaVariantUrl(src, width, quality ?? 80);
}

export function SmartImage({
  src,
  fallbackPath,
  alt,
  fill = false,
  width = 800,
  height = 600,
  sizes,
  priority = false,
  blurPreview,
  className,
  fallbackClassName,
  fallback,
}: SmartImageProps): React.JSX.Element {
  const resolvedSrc = resolveMediaUrl(src, fallbackPath);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!resolvedSrc || !img?.complete || img.naturalWidth === 0) {
      return;
    }
    const rafId = window.requestAnimationFrame(() => {
      setLoadedSrc(resolvedSrc);
    });
    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [resolvedSrc]);

  if (!resolvedSrc || failedSrc === resolvedSrc) {
    return (
      <div
        className={cn(
          "flex size-full items-center justify-center bg-slate-100 text-slate-400",
          fallbackClassName
        )}
      >
        {fallback ?? <ImageOff className="size-6 opacity-50" />}
      </div>
    );
  }

  const [basePath = ""] = resolvedSrc.toLowerCase().split("?");
  const isContainOrVector =
    Boolean(className?.includes("object-contain")) || basePath.endsWith(".svg");
  const shouldBlurUp = blurPreview ?? !isContainOrVector;
  const canOptimize = isOptimizableProxyMedia(resolvedSrc);
  const lqipSrc =
    shouldBlurUp && canOptimize
      ? buildMediaVariantUrl(resolvedSrc, 32, 25)
      : null;
  const isLoaded = loadedSrc === resolvedSrc;
  const effectiveSizes =
    sizes ??
    (fill ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1200px" : undefined);

  const layers = (
    <>
      {shouldBlurUp && !isLoaded ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 animate-pulse bg-slate-200/75"
        />
      ) : null}

      {lqipSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={lqipSrc}
          alt=""
          aria-hidden="true"
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          className={cn(
            "pointer-events-none absolute inset-0 size-full scale-110 object-cover blur-xl transition-opacity duration-500 ease-out",
            isLoaded ? "opacity-0" : "opacity-100"
          )}
        />
      ) : null}

      <Image
        key={resolvedSrc}
        ref={imgRef}
        src={resolvedSrc}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        sizes={effectiveSizes}
        quality={canOptimize ? 80 : undefined}
        loader={canOptimize ? mediaImageLoader : undefined}
        unoptimized={!canOptimize}
        decoding="async"
        {...(priority ? { preload: true } : { loading: "lazy" })}
        className={cn(
          className,
          shouldBlurUp &&
          "transition-[opacity,filter,transform] duration-500 ease-out",
          shouldBlurUp && !isLoaded && "scale-[1.02] opacity-0 blur-sm",
          shouldBlurUp && isLoaded && "scale-100 opacity-100 blur-0"
        )}
        onLoad={() => {
          setLoadedSrc(resolvedSrc);
        }}
        onError={() => {
          setFailedSrc(resolvedSrc);
        }}
      />
    </>
  );

  if (fill) {
    return layers;
  }

  return (
    <span className="relative inline-block overflow-hidden">{layers}</span>
  );
}
