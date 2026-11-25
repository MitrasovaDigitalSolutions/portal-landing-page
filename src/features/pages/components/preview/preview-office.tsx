import { ExternalLink, MapPin } from "lucide-react";
import { asString, type SectionPreviewData } from "@/features/pages/utils/section-preview";
import { cn } from "@/lib/utils";

interface PreviewOfficeProps {
  data: SectionPreviewData;
  compact?: boolean;
}

function isValidMapsEmbedUrl(url: string): boolean {
  return (
    url.startsWith("https://") &&
    (url.includes("/maps/embed") || url.includes("output=embed"))
  );
}

export function PreviewOffice({
  data,
  compact = false,
}: PreviewOfficeProps): React.JSX.Element {
  const badge = asString(data.payload.badge, data.subtitle || "Lokasi");
  const title = data.title || "Alamat Kantor Pusat";
  const address =
    data.body || "Alamat kantor belum diisi pada kolom Isi / Deskripsi Konten.";
  const mapsEmbed = asString(data.payload.maps_embed);
  const showEmbed = isValidMapsEmbedUrl(mapsEmbed);

  return (
    <div className={cn("bg-white", compact ? "px-5 py-6" : "px-10 py-10")}>
      <div
        className={cn(
          "grid items-stretch",
          compact ? "grid-cols-1 gap-5" : "grid-cols-12 gap-8"
        )}
      >
        <div
          className={cn(
            "flex flex-col justify-between space-y-5",
            !compact && "col-span-5"
          )}
        >
          <div>
            <div className="mb-2.5 inline-flex items-center gap-2.5">
              <span className="h-0.5 w-6 rounded-full bg-primary" />
              <span className="text-xs font-bold tracking-[0.14em] text-primary uppercase">
                {badge}
              </span>
            </div>
            <h2
              className={cn(
                "font-extrabold tracking-tight text-slate-900",
                compact ? "text-xl" : "text-2xl"
              )}
            >
              {title}
            </h2>

            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed text-slate-700">{address}</p>
            </div>
          </div>

          <span className="inline-flex h-10 w-fit items-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-white shadow-xs">
            <span>Buka Google Maps</span>
            <ExternalLink className="size-3.5" />
          </span>
        </div>

        <div
          className={cn(
            "overflow-hidden rounded-2xl border border-slate-200 bg-slate-100",
            !compact && "col-span-7"
          )}
        >
          {showEmbed ? (
            <iframe
              src={mapsEmbed}
              title={title}
              loading="lazy"
              className={cn("w-full border-0", compact ? "h-52" : "h-72")}
            />
          ) : (
            <div
              className={cn(
                "flex flex-col items-center justify-center gap-2 px-6 text-center text-slate-400",
                compact ? "h-52" : "h-72"
              )}
            >
              <MapPin className="size-7 opacity-60" />
              <p className="text-sm font-semibold text-slate-600">
                Pratinjau Peta Google Maps
              </p>
              <p className="max-w-xs text-xs">
                Masukkan URL embed Google Maps (https://maps.google.com/...) untuk menampilkan peta interaktif.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
