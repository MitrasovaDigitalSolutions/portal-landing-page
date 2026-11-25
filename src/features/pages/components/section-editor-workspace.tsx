"use client";

import * as React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { DynamicSectionFields } from "@/features/pages/components/dynamic-section-fields";
import { SectionPreviewFrame } from "@/features/pages/components/preview/section-preview-frame";
import { SectionAdvancedJson } from "@/features/pages/components/section-advanced-json";
import { SectionEditorSidebar } from "@/features/pages/components/section-editor-sidebar";
import type { SectionEditorViewMode } from "@/features/pages/components/section-editor-toolbar";
import { SectionIdentityCard } from "@/features/pages/components/section-identity-card";
import type {
  PageDetail,
  PageSection,
  SectionTypeDefinition,
} from "@/types/cms.types";

const XL_MEDIA_QUERY = "(min-width: 1280px)";

function subscribeXlViewport(onStoreChange: () => void): () => void {
  const media = window.matchMedia(XL_MEDIA_QUERY);
  media.addEventListener("change", onStoreChange);
  return () => {
    media.removeEventListener("change", onStoreChange);
  };
}

function getXlViewportSnapshot(): boolean {
  return window.matchMedia(XL_MEDIA_QUERY).matches;
}

function getXlViewportServerSnapshot(): boolean {
  return false;
}

function useIsXlViewport(): boolean {
  return React.useSyncExternalStore(
    subscribeXlViewport,
    getXlViewportSnapshot,
    getXlViewportServerSnapshot
  );
}

interface SectionEditorWorkspaceProps {
  viewMode: SectionEditorViewMode;
  onViewModeChange: (mode: SectionEditorViewMode) => void;
  page: PageDetail;
  section: PageSection | null;
  sectionTypes: readonly SectionTypeDefinition[];
  activeType: SectionTypeDefinition | null;
  currentKey: string;
  siteSlug: string;
  extraKeys: Record<string, unknown>;
  onExtraKeysChange: (nextExtras: Record<string, unknown>) => void;
  onSelectType: (nextKey: string) => void;
}

export function SectionEditorWorkspace({
  viewMode,
  onViewModeChange,
  page,
  section,
  sectionTypes,
  activeType,
  currentKey,
  siteSlug,
  extraKeys,
  onExtraKeysChange,
  onSelectType,
}: SectionEditorWorkspaceProps): React.JSX.Element {
  const isEdit = Boolean(section);
  const isXl = useIsXlViewport();

  if (viewMode === "preview") {
    return (
      <SectionPreviewFrame
        page={page}
        section={section}
        extraKeys={extraKeys}
        fullWidth
      />
    );
  }

  if (viewMode === "editor") {
    return (
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <SectionIdentityCard
            sectionTypes={sectionTypes}
            isEdit={isEdit}
            onSelectType={onSelectType}
          />
          <DynamicSectionFields sectionType={activeType} siteSlug={siteSlug} />
          <SectionAdvancedJson
            sectionType={activeType}
            extraKeys={extraKeys}
            onExtraKeysChange={onExtraKeysChange}
            defaultOpen={Boolean(isEdit && currentKey && !activeType)}
          />
        </div>

        <SectionEditorSidebar
          page={page}
          section={section}
          activeType={activeType}
        />
      </div>
    );
  }

  const formColumnContent = (
    <>
      <SectionIdentityCard
        sectionTypes={sectionTypes}
        isEdit={isEdit}
        onSelectType={onSelectType}
      />
      <DynamicSectionFields sectionType={activeType} siteSlug={siteSlug} />
      <SectionEditorSidebar
        page={page}
        section={section}
        activeType={activeType}
        sticky={false}
      />
      <SectionAdvancedJson
        sectionType={activeType}
        extraKeys={extraKeys}
        onExtraKeysChange={onExtraKeysChange}
        defaultOpen={Boolean(isEdit && currentKey && !activeType)}
      />
    </>
  );

  const previewNode = (
    <SectionPreviewFrame
      page={page}
      section={section}
      extraKeys={extraKeys}
      onExpand={() => {
        onViewModeChange("preview");
      }}
    />
  );

  if (!isXl) {
    return (
      <div className="space-y-5">
        <div className="space-y-5">{formColumnContent}</div>
        {previewNode}
      </div>
    );
  }

  return (
    <ResizablePanelGroup
      orientation="horizontal"
      style={{ height: "auto", overflow: "visible" }}
      className="w-full items-stretch"
    >
      <ResizablePanel
        defaultSize="54%"
        minSize="38%"
        maxSize="68%"
        style={{ overflow: "visible", maxHeight: "none" }}
      >
        <div className="space-y-5 pr-2 pb-6">{formColumnContent}</div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel
        defaultSize="46%"
        minSize="32%"
        maxSize="62%"
        style={{ overflow: "visible", maxHeight: "none" }}
      >
        <div className="sticky top-20 pl-2">{previewNode}</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
