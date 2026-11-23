import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageLoaderProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export function PageLoader({
  message = "Memuat data...",
  fullScreen = false,
  className,
}: PageLoaderProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-center",
        fullScreen ? "min-h-screen bg-slate-50 p-6" : "min-h-[40vh] p-6",
        className
      )}
    >
      <div className="flex size-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-primary shadow-xs">
        <Loader2 className="size-5 animate-spin" />
      </div>
      <p className="text-xs font-medium text-slate-500">{message}</p>
    </div>
  );
}
