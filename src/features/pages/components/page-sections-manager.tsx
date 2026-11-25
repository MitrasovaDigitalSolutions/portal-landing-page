"use client";

import { Layers, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ConfirmDialog } from "@/components/portal/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { deleteSectionAction } from "@/features/pages/actions/pages.actions";
import { PageFormDialog } from "@/features/pages/components/page-form-dialog";
import { PageSectionCard } from "@/features/pages/components/page-section-card";
import { PageSectionsHeader } from "@/features/pages/components/page-sections-header";
import { useSectionTypes } from "@/features/pages/hooks/use-section-types";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type {
  PageDetail,
  PageSection,
  SectionTypeDefinition,
} from "@/types/cms.types";

interface PageSectionsManagerProps {
  page: PageDetail;
  initialSectionTypes?: SectionTypeDefinition[];
}

export function PageSectionsManager({
  page,
  initialSectionTypes,
}: PageSectionsManagerProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";
  const [pageDialogOpen, setPageDialogOpen] = useState(false);
  const deleteConfirm = useDeleteConfirm<PageSection>();
  const { data: sectionTypes = [] } = useSectionTypes(initialSectionTypes);

  const sortedSections = [...page.sections].sort((a, b) => a.order - b.order);

  const deleteMutation = useCrudMutation({
    mutationFn: (sectionId: number) => deleteSectionAction(sectionId, page.id),
    invalidateKeys: [queryKeys.pages.detail(siteKey, page.id)],
    onSuccess: () => {
      deleteConfirm.close();
    },
    onError: () => {
      deleteConfirm.close();
    },
  });

  return (
    <div className="space-y-5">
      <PageSectionsHeader
        page={page}
        onEditPage={() => {
          setPageDialogOpen(true);
        }}
      />

      {sortedSections.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {sortedSections.map((section) => (
            <PageSectionCard
              key={section.id}
              pageId={page.id}
              section={section}
              sectionTypes={sectionTypes}
              onDelete={(target) => {
                deleteConfirm.requestDelete(target);
              }}
            />
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white py-12 text-center">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Layers className="size-5" />
          </div>
          <p className="text-sm font-bold text-slate-800">
            Belum ada section pada halaman ini
          </p>
          <p className="max-w-sm text-xs text-slate-500">
            Tambahkan section seperti hero, sejarah, visi-misi, atau cta untuk
            menyusun konten halaman ini.
          </p>
          <Button
            size="sm"
            nativeButton={false}
            render={<Link href={`/pages/${page.id}/sections/create`} />}
            className="mt-2 gap-1.5 rounded-xl text-xs font-semibold"
          >
            <Plus className="size-4" />
            <span>Tambah Section Pertama</span>
          </Button>
        </Card>
      )}

      <PageFormDialog
        page={page}
        open={pageDialogOpen}
        onOpenChange={setPageDialogOpen}
      />

      <ConfirmDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.setOpen}
        title="Hapus Section Halaman?"
        description={`Section dengan key "${deleteConfirm.target?.key ?? ""}" akan dihapus permanen.`}
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteConfirm.target) {
            deleteMutation.mutate(deleteConfirm.target.id);
          }
        }}
      />
    </div>
  );
}
