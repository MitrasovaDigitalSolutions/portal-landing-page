"use client";

import * as React from "react";
import { Loader2, RefreshCw, Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MediaPickerToolbarProps {
  search: string;
  onSearchChange: (nextSearch: string) => void;
  isFetching: boolean;
  onRefresh: () => void;
  canUpload: boolean;
  uploading: boolean;
  onUploadFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MediaPickerToolbar({
  search,
  onSearchChange,
  isFetching,
  onRefresh,
  canUpload,
  uploading,
  onUploadFile,
}: MediaPickerToolbarProps): React.JSX.Element {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-[200px] flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => {
            onSearchChange(e.target.value);
          }}
          placeholder="Cari nama file atau folder..."
          className="h-9 pl-8 text-xs"
        />
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isFetching}
        onClick={onRefresh}
        className="h-9 gap-1.5 rounded-xl text-xs"
      >
        <RefreshCw
          className={isFetching ? "size-3.5 animate-spin" : "size-3.5"}
        />
        <span>Muat Ulang</span>
      </Button>

      {canUpload ? (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            className="hidden"
            onChange={onUploadFile}
          />
          <Button
            type="button"
            size="sm"
            disabled={uploading}
            onClick={() => {
              fileInputRef.current?.click();
            }}
            className="h-9 gap-1.5 rounded-xl text-xs font-semibold"
          >
            {uploading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Upload className="size-3.5" />
            )}
            <span>{uploading ? "Mengunggah..." : "Upload Baru"}</span>
          </Button>
        </>
      ) : null}
    </div>
  );
}
