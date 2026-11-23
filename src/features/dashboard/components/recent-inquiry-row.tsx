import { Badge } from "@/components/ui/badge";
import type { DashboardInquiryBrief } from "@/features/dashboard/types/dashboard.types";
import { formatDateId } from "@/utils/format-date";

interface RecentInquiryRowProps {
  inquiry: DashboardInquiryBrief;
}

export function RecentInquiryRow({
  inquiry,
}: RecentInquiryRowProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs transition-colors hover:bg-slate-50/70">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-bold text-slate-900">
            {inquiry.name}
          </span>
          <span className="text-[11px] text-slate-400">{inquiry.phone}</span>
        </div>
        <p className="mt-0.5 truncate text-[11px] text-slate-500">
          {inquiry.subject ?? "Konsultasi Layanan"}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Badge
          variant={inquiry.status === "new" ? "default" : "secondary"}
          className="rounded-md px-2 py-0.5 text-[10px] capitalize"
        >
          {inquiry.status}
        </Badge>
        <span className="text-[11px] text-slate-400">
          {formatDateId(inquiry.created_at)}
        </span>
      </div>
    </div>
  );
}
