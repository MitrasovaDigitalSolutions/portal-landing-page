"use client";

import * as React from "react";
import { GripVertical } from "lucide-react";
import {
  Group,
  Panel,
  Separator,
  type GroupProps,
  type PanelProps,
  type SeparatorProps,
} from "react-resizable-panels";
import { cn } from "@/lib/utils";

function ResizablePanelGroup({
  className,
  ...props
}: GroupProps): React.JSX.Element {
  return (
    <Group
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full aria-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    />
  );
}

function ResizablePanel({
  className,
  ...props
}: PanelProps): React.JSX.Element {
  return (
    <Panel
      data-slot="resizable-panel"
      className={cn("min-w-0", className)}
      {...props}
    />
  );
}

interface ResizableHandleProps extends SeparatorProps {
  withHandle?: boolean;
}

function ResizableHandle({
  withHandle = false,
  className,
  title = "Geser untuk mengubah lebar panel • Klik 2x untuk reset",
  ...props
}: ResizableHandleProps): React.JSX.Element {
  return (
    <Separator
      data-slot="resizable-handle"
      title={title}
      className={cn(
        "group/handle relative flex w-4 cursor-col-resize items-start justify-center bg-transparent transition-colors select-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden before:absolute before:inset-y-3 before:left-1/2 before:w-0.5 before:-translate-x-1/2 before:rounded-full before:bg-slate-300/90 before:transition-all hover:before:w-1 hover:before:bg-primary/60 data-[separator=hover]:before:w-1 data-[separator=hover]:before:bg-primary/60 data-[separator=active]:before:w-1 data-[separator=active]:before:bg-primary aria-[orientation=horizontal]:h-4 aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:cursor-row-resize aria-[orientation=horizontal]:items-center aria-[orientation=horizontal]:before:inset-x-3 aria-[orientation=horizontal]:before:inset-y-auto aria-[orientation=horizontal]:before:top-1/2 aria-[orientation=horizontal]:before:left-auto aria-[orientation=horizontal]:before:h-0.5 aria-[orientation=horizontal]:before:w-auto aria-[orientation=horizontal]:before:translate-x-0 aria-[orientation=horizontal]:before:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90",
        className
      )}
      {...props}
    >
      {withHandle ? (
        <div className="sticky top-[45vh] z-10 my-4 flex h-12 w-5 flex-col items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 shadow-sm ring-2 ring-slate-50 transition-all group-aria-[orientation=horizontal]/handle:static group-aria-[orientation=horizontal]/handle:my-0 group-hover/handle:scale-105 group-hover/handle:border-primary group-hover/handle:bg-primary group-hover/handle:text-white group-hover/handle:shadow-md group-data-[separator=hover]/handle:border-primary group-data-[separator=hover]/handle:bg-primary group-data-[separator=hover]/handle:text-white group-data-[separator=active]/handle:scale-105 group-data-[separator=active]/handle:border-primary group-data-[separator=active]/handle:bg-primary group-data-[separator=active]/handle:text-white">
          <GripVertical className="size-3.5" />
        </div>
      ) : null}
    </Separator>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
