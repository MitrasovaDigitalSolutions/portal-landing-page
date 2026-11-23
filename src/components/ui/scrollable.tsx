"use client";

import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { cn } from "@/lib/utils";
import * as React from "react";

export interface ScrollableProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  orientation?: "vertical" | "horizontal" | "both";
  scrollbarClassName?: string;
  thumbClassName?: string;
  viewportRef?: React.Ref<HTMLDivElement>;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
}

const scrollbarClass = (scrollbarClassName?: string): string =>
  cn(
    "scrollable-scrollbar flex touch-none p-px select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2 data-vertical:border-l data-vertical:border-l-transparent",
    "opacity-0 transition-opacity duration-300",
    "group-hover/scrollable:opacity-100 group-data-[scrolling]/scrollable:opacity-100 data-[scrolling]:opacity-100",
    scrollbarClassName
  );

const thumbClass = (thumbClassName?: string): string =>
  cn(
    "relative flex-1 rounded-full bg-slate-400/40 hover:bg-slate-500/60 transition-colors",
    thumbClassName
  );

export const Scrollable = React.forwardRef<HTMLDivElement, ScrollableProps>(
  (
    {
      className,
      children,
      orientation = "vertical",
      scrollbarClassName,
      thumbClassName,
      viewportRef,
      onScroll,
      ...props
    },
    ref
  ) => {
    const renderBoth = orientation === "both";
    return (
      <ScrollAreaPrimitive.Root
        ref={ref}
        data-slot="scrollable"
        className={cn(
          "group/scrollable relative flex min-h-0 flex-col",
          className
        )}
        {...props}
      >
        <ScrollAreaPrimitive.Viewport
          ref={viewportRef}
          onScroll={onScroll}
          data-slot="scrollable-viewport"
          className="min-h-0 w-full flex-1 rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1"
        >
          {children}
        </ScrollAreaPrimitive.Viewport>

        {(renderBoth || orientation === "vertical") && (
          <ScrollAreaPrimitive.Scrollbar
            data-slot="scrollable-scrollbar"
            orientation="vertical"
            className={scrollbarClass(scrollbarClassName)}
          >
            <ScrollAreaPrimitive.Thumb
              data-slot="scrollable-thumb"
              className={thumbClass(thumbClassName)}
            />
          </ScrollAreaPrimitive.Scrollbar>
        )}

        {(renderBoth || orientation === "horizontal") && (
          <ScrollAreaPrimitive.Scrollbar
            data-slot="scrollable-scrollbar"
            orientation="horizontal"
            className={scrollbarClass(scrollbarClassName)}
          >
            <ScrollAreaPrimitive.Thumb
              data-slot="scrollable-thumb"
              className={thumbClass(thumbClassName)}
            />
          </ScrollAreaPrimitive.Scrollbar>
        )}

        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    );
  }
);

Scrollable.displayName = "Scrollable";
