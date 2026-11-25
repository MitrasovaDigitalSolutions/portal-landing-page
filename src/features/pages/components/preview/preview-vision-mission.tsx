import { Compass } from "lucide-react";
import {
  asRecordArray,
  asString,
  type SectionPreviewData,
} from "@/features/pages/utils/section-preview";
import { cn } from "@/lib/utils";

interface PreviewVisionMissionProps {
  data: SectionPreviewData;
  compact?: boolean;
}

export function PreviewVisionMission({
  data,
  compact = false,
}: PreviewVisionMissionProps): React.JSX.Element {
  const visi = asString(data.payload.visi);
  const misi = asRecordArray(data.payload.misi);

  let desktopGridCols = "grid-cols-3 gap-5";
  if (misi.length === 2) {
    desktopGridCols = "grid-cols-2 gap-5";
  } else if (misi.length === 1) {
    desktopGridCols = "grid-cols-1 gap-5";
  }

  return (
    <div className={cn("bg-[#F7F9F7]", compact ? "px-5 py-6" : "px-10 py-10")}>
      <div className="mb-6 max-w-2xl">
        <div className="mb-2.5 inline-flex items-center gap-2.5">
          <span className="h-0.5 w-6 rounded-full bg-primary" />
          <span className="text-xs font-bold tracking-[0.14em] text-primary uppercase">
            {data.subtitle || "Arah & Komitmen"}
          </span>
        </div>
        <h2
          className={cn(
            "font-extrabold tracking-tight text-slate-900",
            compact ? "text-xl" : "text-3xl"
          )}
        >
          {data.title || "Visi & Misi"}
        </h2>
      </div>

      {visi ? (
        <div
          className={cn(
            "rounded-2xl bg-primary text-white shadow-md",
            compact ? "p-6" : "p-8"
          )}
        >
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-white/80 uppercase">
            <Compass className="size-4" />
            <span>Visi Kami</span>
          </div>
          <p
            className={cn(
              "mt-3 max-w-4xl leading-relaxed font-bold",
              compact ? "text-base" : "text-xl"
            )}
          >
            {visi}
          </p>
        </div>
      ) : null}

      {misi.length > 0 ? (
        <div
          className={cn(
            "mt-6 grid",
            compact ? "grid-cols-1 gap-3.5" : desktopGridCols
          )}
        >
          {misi.map((item, idx) => (
            <article
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs"
            >
              <span className="inline-block rounded-md bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary uppercase tabular-nums">
                Misi {String(idx + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-base font-extrabold text-slate-900">
                {asString(item.title, `Misi ${idx + 1}`)}
              </h3>
              {asString(item.desc) ? (
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {asString(item.desc)}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}

      {!visi && misi.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-white py-8 text-center text-xs text-slate-400">
          Isi Visi dan tambahkan daftar Misi untuk melihat pratinjau.
        </p>
      ) : null}
    </div>
  );
}
