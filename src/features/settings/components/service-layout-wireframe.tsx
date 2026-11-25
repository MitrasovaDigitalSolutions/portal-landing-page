import type { ServicesLayoutOption } from "@/features/settings/schemas/settings.schema";
import { cn } from "@/lib/utils";

interface ServiceLayoutWireframeProps {
  layout: ServicesLayoutOption;
  selected: boolean;
}

const MINI_CARD_KEYS = ["a", "b", "c"] as const;
const MINI_GRID_KEYS = ["a", "b", "c", "d", "e", "f"] as const;

export function ServiceLayoutWireframe({
  layout,
  selected,
}: ServiceLayoutWireframeProps): React.JSX.Element {
  const accentBg = selected ? "bg-primary/20" : "bg-slate-200/90";
  const accentBar = selected ? "bg-primary" : "bg-slate-400";
  const cardBg = selected
    ? "border-primary/25 bg-white"
    : "border-slate-200/80 bg-white";

  if (layout === "accordion") {
    return (
      <div
        aria-hidden="true"
        className="flex h-24 w-full flex-col justify-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/90 p-2.5"
      >
        <div className={cn("rounded-lg border p-2", cardBg)}>
          <div className="flex items-center justify-between gap-2">
            <span className={cn("h-1.5 w-16 rounded-full", accentBar)} />
            <span className="h-1.5 w-2 rounded-full bg-slate-300" />
          </div>
          <span className="mt-1.5 block h-1 w-full rounded-full bg-slate-200" />
          <span className="mt-1 block h-1 w-3/4 rounded-full bg-slate-200" />
        </div>
        <div className={cn("flex items-center justify-between rounded-lg border px-2 py-1.5", cardBg)}>
          <span className="h-1.5 w-14 rounded-full bg-slate-300" />
          <span className="h-1.5 w-2 rounded-full bg-slate-300" />
        </div>
        <div className={cn("flex items-center justify-between rounded-lg border px-2 py-1.5", cardBg)}>
          <span className="h-1.5 w-12 rounded-full bg-slate-300" />
          <span className="h-1.5 w-2 rounded-full bg-slate-300" />
        </div>
      </div>
    );
  }

  if (layout === "carousel") {
    return (
      <div
        aria-hidden="true"
        className="relative flex h-24 w-full items-center gap-2 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/90 px-3 py-2.5"
      >
        {MINI_CARD_KEYS.map((key) => (
          <div
            key={key}
            className={cn(
              "flex h-full flex-1 flex-col justify-between rounded-lg border p-1.5",
              cardBg
            )}
          >
            <div className={cn("h-8 w-full rounded-md", accentBg)} />
            <div className="space-y-1">
              <span className="block h-1.5 w-4/5 rounded-full bg-slate-300" />
              <span className={cn("block h-1.5 w-1/2 rounded-full", accentBar)} />
            </div>
          </div>
        ))}
        <span className="absolute top-1/2 left-1.5 size-3 -translate-y-1/2 rounded-full border border-slate-200 bg-white shadow-2xs" />
        <span className="absolute top-1/2 right-1.5 size-3 -translate-y-1/2 rounded-full border border-slate-200 bg-white shadow-2xs" />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="grid h-24 w-full grid-cols-3 gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/90 p-2.5"
    >
      {MINI_GRID_KEYS.map((key) => (
        <div
          key={key}
          className={cn(
            "flex flex-col justify-between rounded-md border p-1",
            cardBg
          )}
        >
          <div className={cn("h-3.5 w-full rounded-xs", accentBg)} />
          <span className={cn("h-1 w-2/3 rounded-full", accentBar)} />
        </div>
      ))}
    </div>
  );
}
