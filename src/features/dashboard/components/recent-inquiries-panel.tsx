import { ArrowRight, Inbox } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Scrollable } from "@/components/ui/scrollable";
import { RecentInquiryRow } from "@/features/dashboard/components/recent-inquiry-row";
import type { DashboardInquiryBrief } from "@/features/dashboard/types/dashboard.types";

interface RecentInquiriesPanelProps {
  inquiries: DashboardInquiryBrief[];
  totalCount: number;
  newCount: number;
}

export function RecentInquiriesPanel({
  inquiries,
  totalCount,
  newCount,
}: RecentInquiriesPanelProps): React.JSX.Element {
  return (
    <Card className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs lg:col-span-8">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <Inbox className="size-4 text-primary" />
          <span className="text-xs font-bold text-slate-900">
            Kotak Masuk & Konsultasi ({totalCount})
          </span>
          {newCount > 0 ? (
            <span className="rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600">
              {newCount} Baru
            </span>
          ) : null}
        </div>
        <Link
          href="/inquiries"
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          <span>Kelola Semua</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {inquiries.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-8 text-center text-xs text-slate-400">
          Belum ada pesan konsultasi masuk untuk tenant ini.
        </div>
      ) : (
        <Scrollable className="max-h-[304px] flex-1">
          <div className="divide-y divide-slate-100">
            {inquiries.map((inquiry) => (
              <RecentInquiryRow key={inquiry.id} inquiry={inquiry} />
            ))}
          </div>
        </Scrollable>
      )}
    </Card>
  );
}
