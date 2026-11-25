import { Camera, ExternalLink } from "lucide-react";
import {
  asString,
  asStringArray,
  type SectionPreviewData,
} from "@/features/pages/utils/section-preview";
import { cn } from "@/lib/utils";

interface PreviewInstagramProps {
  data: SectionPreviewData;
  compact?: boolean;
}

function getInstagramGridCols(count: number, compact: boolean): string {
  if (compact || count <= 1) return "grid-cols-1 gap-4";
  if (count === 2) return "grid-cols-2 gap-4";
  return "grid-cols-3 gap-4";
}

export function PreviewInstagram({
  data,
  compact = false,
}: PreviewInstagramProps): React.JSX.Element {
  const handle = asString(data.payload.handle, "akuninstagram");
  const profileUrl = asString(
    data.payload.profile_url,
    `https://www.instagram.com/${handle}`
  );
  const posts = asStringArray(data.payload.posts);
  const title = data.title || "Feed Instagram Resmi";
  const body =
    data.body ||
    `Menampilkan ${posts.length} postingan pilihan dari akun @${handle}.`;

  return (
    <div className={cn("bg-[#F7F9F7]", compact ? "px-5 py-6" : "px-10 py-10")}>
      <div
        className={cn(
          "mb-6 flex justify-between gap-4 border-b border-slate-200/80 pb-5",
          compact ? "flex-col items-start" : "flex-row items-end"
        )}
      >
        <div className="max-w-2xl">
          <div className="mb-2 inline-flex items-center gap-2.5">
            <span className="h-0.5 w-6 rounded-full bg-primary" />
            <span className="text-xs font-bold tracking-[0.14em] text-primary uppercase">
              Instagram Resmi @{handle}
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
          <p className="mt-1.5 text-sm text-slate-600">{body}</p>
        </div>

        <span className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-xs font-bold text-slate-800">
          <Camera className="size-4 text-primary" />
          <span>Ikuti @{handle}</span>
          <ExternalLink className="size-3.5" />
        </span>
      </div>

      {posts.length > 0 ? (
        <div className={cn("grid", getInstagramGridCols(posts.length, compact))}>
          {posts.map((postUrl, idx) => {
            const isReel = postUrl.includes("/reel/");
            return (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Camera className="size-3.5 text-primary" />
                    @{handle}
                  </span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                    {isReel ? "Reel" : "Post"}
                  </span>
                </div>
                <p className="my-4 truncate font-mono text-[11px] text-slate-500">
                  {postUrl}
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                  <span>Buka di Instagram</span>
                  <ExternalLink className="size-3.5" />
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
          Profil: <span className="font-mono">{profileUrl}</span> — tambahkan URL
          postingan untuk pratinjau kartu feed.
        </p>
      )}
    </div>
  );
}
