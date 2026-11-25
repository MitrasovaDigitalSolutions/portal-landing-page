import { ArrowRight, CheckCircle2, Landmark } from "lucide-react";
import {
  asRecordArray,
  asString,
  asStringArray,
  type SectionPreviewData,
} from "@/features/pages/utils/section-preview";
import { cn } from "@/lib/utils";

interface PreviewFeaturedProps {
  data: SectionPreviewData;
  compact?: boolean;
}

export function PreviewFeatured({
  data,
  compact = false,
}: PreviewFeaturedProps): React.JSX.Element {
  const badge = asString(data.payload.badge, data.subtitle || "Layanan Kami");
  const title = data.title || "Produk Unggulan";
  const ctaLabel = asString(
    data.payload.cta_label,
    "Lihat Detail Semua Produk"
  );
  const cards = asRecordArray(data.payload.cards);

  return (
    <div className={cn("bg-[#F7F9F7]", compact ? "px-5 py-6" : "px-10 py-10")}>
      <div
        className={cn(
          "flex justify-between gap-5 border-b border-slate-200/80 pb-6",
          compact ? "flex-col items-start" : "flex-row items-end"
        )}
      >
        <div className="max-w-2xl">
          <div className="mb-2 inline-flex items-center gap-2.5">
            <span className="h-0.5 w-6 rounded-full bg-primary" />
            <span className="text-xs font-bold tracking-[0.14em] text-primary uppercase">
              {badge}
            </span>
          </div>
          <h2
            className={cn(
              "font-extrabold tracking-tight text-slate-900",
              compact ? "text-xl" : "text-3xl"
            )}
          >
            {title}
          </h2>
          {data.body ? (
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {data.body}
            </p>
          ) : null}
        </div>

        <span className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-xs font-bold text-slate-800">
          <span>{ctaLabel}</span>
          <ArrowRight className="size-3.5" />
        </span>
      </div>

      {cards.length > 0 ? (
        <div
          className={cn(
            "mt-6 grid",
            compact || cards.length === 1 ? "grid-cols-1 gap-4" : "grid-cols-2 gap-6"
          )}
        >
          {cards.map((card, idx) => {
            const products = asStringArray(card.products);
            const note = asString(card.note);
            return (
              <article
                key={idx}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-block rounded-md bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary uppercase tabular-nums">
                      Kategori {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 text-lg font-extrabold text-slate-900">
                      {asString(card.title, `Kategori #${idx + 1}`)}
                    </h3>
                  </div>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Landmark className="size-5" />
                  </span>
                </div>

                {asString(card.description) ? (
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                    {asString(card.description)}
                  </p>
                ) : null}

                {products.length > 0 ? (
                  <ul className="mt-4 divide-y divide-slate-100 border-t border-slate-100">
                    {products.map((prod, pIdx) => (
                      <li
                        key={pIdx}
                        className="flex items-center gap-2.5 py-2.5 text-sm font-medium text-slate-700"
                      >
                        <CheckCircle2 className="size-4 shrink-0 text-primary" />
                        <span>{prod}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {note ? (
                  <p className="mt-4 rounded-xl border-l-2 border-primary bg-slate-50 px-3.5 py-2.5 text-xs text-slate-600">
                    {note}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : (
        <p className="mt-6 rounded-xl border border-dashed border-slate-200 bg-white py-8 text-center text-xs text-slate-400">
          Tambahkan kartu produk unggulan pada form untuk melihat pratinjau grid.
        </p>
      )}
    </div>
  );
}
