"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface PreviewScaledCanvasProps {
  viewport: "desktop" | "mobile";
  onScaleChange?: (percent: number) => void;
  children: React.ReactNode;
}

export function PreviewScaledCanvas({
  viewport,
  onScaleChange,
  children,
}: PreviewScaledCanvasProps): React.JSX.Element {
  const targetWidth = viewport === "mobile" ? 390 : 960;
  const outerRef = React.useRef<HTMLDivElement | null>(null);
  const innerRef = React.useRef<HTMLDivElement | null>(null);
  const onScaleRef = React.useRef(onScaleChange);

  React.useEffect(() => {
    onScaleRef.current = onScaleChange;
  }, [onScaleChange]);

  const [size, setSize] = React.useState<{
    outerWidth: number;
    innerHeight: number;
  }>({
    outerWidth: targetWidth,
    innerHeight: 0,
  });

  React.useEffect(() => {
    const outerEl = outerRef.current;
    const innerEl = innerRef.current;
    if (!outerEl || !innerEl) {
      return;
    }

    const measure = (): void => {
      const nextOuterWidth = outerEl.clientWidth;
      const nextInnerHeight = innerEl.offsetHeight;
      setSize((prev) => {
        if (
          prev.outerWidth === nextOuterWidth &&
          prev.innerHeight === nextInnerHeight
        ) {
          return prev;
        }
        return { outerWidth: nextOuterWidth, innerHeight: nextInnerHeight };
      });
      const nextScale =
        nextOuterWidth > 0 ? Math.min(1, nextOuterWidth / targetWidth) : 1;
      onScaleRef.current?.(Math.round(nextScale * 100));
    };

    const observer = new ResizeObserver(() => {
      measure();
    });
    observer.observe(outerEl);
    observer.observe(innerEl);

    const raf = window.requestAnimationFrame(measure);
    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [targetWidth]);

  const isUnscaled = size.outerWidth >= targetWidth;
  const isMobileBezel = viewport === "mobile" && isUnscaled;
  const scale = isUnscaled
    ? 1
    : Math.min(1, (size.outerWidth || targetWidth) / targetWidth);
  const scaledHeight =
    size.innerHeight > 0 ? Math.ceil(size.innerHeight * scale) : undefined;

  return (
    <div
      ref={outerRef}
      className="w-full overflow-hidden"
      style={scaledHeight ? { height: `${scaledHeight}px` } : undefined}
    >
      <div
        ref={innerRef}
        className={cn(
          "overflow-hidden bg-white",
          isUnscaled && "mx-auto",
          isMobileBezel
            ? "rounded-2xl border border-slate-300/80 shadow-md ring-4 ring-slate-900/10"
            : "rounded-xl border border-slate-200/90 shadow-sm"
        )}
        style={{
          width: `${targetWidth}px`,
          transform: scale < 1 ? `scale(${scale})` : undefined,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
