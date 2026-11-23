"use client";

import * as React from "react";
import { ImagePlus, RefreshCw, Trash2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveMediaUrl } from "@/utils/media";

export interface ExistingGalleryItem {
  id: number | string;
  url: string;
}

function formatFileSizeLabel(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(0)} KB`;
  }
  return `${(kb / 1024).toFixed(1)} MB`;
}

function validateImageFile(file: File, maxSizeMB: number): string | null {
  if (!file.type.startsWith("image/")) {
    return "Format file harus berupa gambar (PNG, JPG, WEBP, SVG).";
  }
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return `Ukuran file maksimal ${maxSizeMB} MB.`;
  }
  return null;
}

export interface ImageUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
  initialUrl?: string | null;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  aspectHint?: string;
  disabled?: boolean;
  invalid?: boolean;
  previewClassName?: string;
  onErrorChange?: (error: string | null) => void;
}

export function ImageUpload({
  value,
  onChange,
  initialUrl,
  label,
  accept = "image/png,image/jpeg,image/webp,image/svg+xml",
  maxSizeMB = 5,
  aspectHint,
  disabled = false,
  invalid = false,
  previewClassName,
  onErrorChange,
}: ImageUploadProps): React.JSX.Element {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const objectUrlRef = React.useRef<string | null>(null);
  const [objectUrl, setObjectUrl] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  React.useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const resolvedInitial = resolveMediaUrl(initialUrl);
  const activePreviewUrl = value ? objectUrl : resolvedInitial;

  const handleSelectFile = (file: File | undefined): void => {
    if (!file || disabled) return;
    const validationError = validateImageFile(file, maxSizeMB);
    if (validationError) {
      onErrorChange?.(validationError);
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    const nextUrl = URL.createObjectURL(file);
    objectUrlRef.current = nextUrl;
    setObjectUrl(nextUrl);
    onErrorChange?.(null);
    onChange(file);
  };

  const handleClearFile = (): void => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setObjectUrl(null);
    onErrorChange?.(null);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        className="hidden"
        onChange={(e) => {
          handleSelectFile(e.target.files?.[0]);
        }}
      />

      {activePreviewUrl ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70">
          <div
            className={cn(
              "relative flex h-40 w-full items-center justify-center bg-slate-100/80 p-2",
              previewClassName
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activePreviewUrl}
              alt={label ?? "Preview gambar"}
              className="max-h-full max-w-full rounded-lg object-contain"
            />
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-slate-200/80 bg-white px-3 py-2">
            <div className="min-w-0 flex-1 text-[11px] text-slate-600">
              {value ? (
                <span className="block truncate font-medium text-slate-800">
                  {value.name} ({formatFileSizeLabel(value.size)})
                </span>
              ) : (
                <span className="block truncate text-slate-500">
                  Gambar tersimpan saat ini
                </span>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  inputRef.current?.click();
                }}
                className="inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] font-semibold text-slate-700 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary disabled:opacity-50"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Ganti</span>
              </button>
              {value ? (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={handleClearFile}
                  aria-label="Hapus gambar baru"
                  className="inline-flex h-7 items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 text-[11px] font-semibold text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            inputRef.current?.click();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setIsDragging(true);
          }}
          onDragLeave={() => {
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleSelectFile(e.dataTransfer.files[0]);
          }}
          className={cn(
            "flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-4 py-6 text-center transition-all outline-none",
            "hover:border-primary/50 hover:bg-primary/5 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20",
            isDragging && "border-primary bg-primary/10",
            invalid && "border-rose-400 bg-rose-50/40",
            disabled && "cursor-not-allowed opacity-60"
          )}
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-white text-primary shadow-xs ring-1 ring-slate-200/80">
            {isDragging ? (
              <Upload className="h-4 w-4" />
            ) : (
              <ImagePlus className="h-4 w-4" />
            )}
          </span>
          <span className="space-y-0.5 text-xs">
            <span className="block font-semibold text-slate-700">
              Klik atau seret gambar ke sini
            </span>
            <span className="block text-[11px] text-slate-400">
              PNG, JPG, WEBP maks. {maxSizeMB} MB
              {aspectHint ? ` · Rasio ${aspectHint}` : ""}
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

export interface MultiImageUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  existingImages?: ExistingGalleryItem[];
  maxFiles?: number;
  maxSizeMB?: number;
  disabled?: boolean;
  invalid?: boolean;
  onErrorChange?: (error: string | null) => void;
}

export function MultiImageUpload({
  files,
  onChange,
  existingImages = [],
  maxFiles = 8,
  maxSizeMB = 5,
  disabled = false,
  invalid = false,
  onErrorChange,
}: MultiImageUploadProps): React.JSX.Element {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = React.useState<string[]>([]);
  const previewsRef = React.useRef<string[]>([]);

  React.useEffect(() => {
    return () => {
      for (const url of previewsRef.current) {
        URL.revokeObjectURL(url);
      }
    };
  }, []);

  const handleAddFiles = (fileList: FileList | null): void => {
    if (!fileList || fileList.length === 0 || disabled) return;
    const incoming = Array.from(fileList);
    if (files.length + incoming.length > maxFiles) {
      onErrorChange?.(`Maksimal ${maxFiles} gambar tambahan sekaligus.`);
      return;
    }

    for (const file of incoming) {
      const err = validateImageFile(file, maxSizeMB);
      if (err) {
        onErrorChange?.(err);
        return;
      }
    }

    const newUrls = incoming.map((file) => URL.createObjectURL(file));
    const nextPreviews = [...previewsRef.current, ...newUrls];
    previewsRef.current = nextPreviews;
    setPreviews(nextPreviews);
    onErrorChange?.(null);
    onChange([...files, ...incoming]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number): void => {
    const targetUrl = previewsRef.current[index];
    if (targetUrl) {
      URL.revokeObjectURL(targetUrl);
    }
    const nextPreviews = previewsRef.current.filter((_, idx) => idx !== index);
    previewsRef.current = nextPreviews;
    setPreviews(nextPreviews);
    onErrorChange?.(null);
    onChange(files.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp"
        disabled={disabled}
        className="hidden"
        onChange={(e) => {
          handleAddFiles(e.target.files);
        }}
      />

      {existingImages.length > 0 ? (
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-slate-500">
            Galeri tersimpan ({existingImages.length} foto)
          </p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
            {existingImages.map((img) => {
              const resolved = resolveMediaUrl(img.url);
              if (!resolved) return null;
              return (
                <div
                  key={img.id}
                  className="aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolved}
                    alt="Galeri portofolio"
                    className="h-full w-full object-cover"
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
        {files.map((file, idx) => (
          <div
            key={`${file.name}-${idx}`}
            className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
          >
            {previews[idx] ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={previews[idx]}
                alt={file.name}
                className="h-full w-full object-cover"
              />
            ) : null}
            <button
              type="button"
              onClick={() => {
                handleRemoveFile(idx);
              }}
              aria-label={`Hapus ${file.name}`}
              className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-slate-900/75 text-white transition-colors hover:bg-rose-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <span className="absolute inset-x-0 bottom-0 truncate bg-slate-900/65 px-1.5 py-0.5 text-[10px] text-white">
              {formatFileSizeLabel(file.size)}
            </span>
          </div>
        ))}

        {files.length < maxFiles ? (
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              inputRef.current?.click();
            }}
            className={cn(
              "flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-2 text-center transition-colors",
              "hover:border-primary/50 hover:bg-primary/5 disabled:cursor-not-allowed opacity-90",
              invalid && "border-rose-400"
            )}
          >
            <ImagePlus className="h-5 w-5 text-primary" />
            <span className="text-[11px] font-semibold text-slate-600">
              Tambah Foto
            </span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
