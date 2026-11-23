"use client";

import * as React from "react";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import {
  EditorContent,
  useEditor,
  useEditorState,
  type Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Highlighter,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOption } from "@/components/ui/input-option";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const HEADING_OPTIONS = [
  { value: "paragraph", label: "Teks Normal" },
  { value: "h1", label: "Judul Utama (H1)" },
  { value: "h2", label: "Subjudul (H2)" },
  { value: "h3", label: "Bagian (H3)" },
];

interface ToolbarButtonProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function ToolbarButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: ToolbarButtonProps): React.JSX.Element {
  return (
    <Tooltip>
      <TooltipTrigger
        disabled={disabled}
        render={
          <button
            type="button"
            disabled={disabled}
            aria-label={label}
            aria-pressed={active}
            onClick={onClick}
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-lg text-slate-600 transition-colors outline-none",
              "hover:bg-slate-200/70 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-primary/30",
              active && "bg-primary/12 text-primary hover:bg-primary/15",
              "disabled:pointer-events-none disabled:opacity-35"
            )}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function ToolbarDivider(): React.JSX.Element {
  return <span className="mx-1 h-5 w-px shrink-0 bg-slate-200" />;
}

function LinkToolbarPopover({
  editor,
  isActive,
}: {
  editor: Editor;
  isActive: boolean;
}): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [url, setUrl] = React.useState("");

  const handleOpenChange = (nextOpen: boolean): void => {
    if (nextOpen) {
      const currentHref = editor.getAttributes("link").href as
        | string
        | undefined;
      setUrl(currentHref ?? "");
    }
    setOpen(nextOpen);
  };

  const applyLink = (): void => {
    const clean = url.trim();
    if (!clean) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      const href = /^https?:\/\//i.test(clean) || clean.startsWith("/")
        ? clean
        : `https://${clean}`;
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <button
            type="button"
            aria-label="Sisipkan Tautan"
            aria-pressed={isActive}
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-lg text-slate-600 transition-colors outline-none",
              "hover:bg-slate-200/70 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-primary/30",
              isActive && "bg-primary/12 text-primary hover:bg-primary/15"
            )}
          />
        }
      >
        <Link2 className="size-4" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 space-y-2.5 p-3">
        <p className="text-xs font-semibold text-slate-800">Tautan URL</p>
        <Input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
          }}
          placeholder="https://contoh.com"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              applyLink();
            }
          }}
        />
        <div className="flex items-center justify-end gap-2">
          {isActive ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                editor.chain().focus().extendMarkRange("link").unsetLink().run();
                setOpen(false);
              }}
              className="h-8 rounded-lg px-2.5 text-xs text-rose-600 hover:bg-rose-50"
            >
              Hapus
            </Button>
          ) : null}
          <Button
            type="button"
            size="sm"
            onClick={applyLink}
            className="h-8 rounded-lg px-3 text-xs font-semibold"
          >
            Terapkan
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ImageToolbarPopover({
  editor,
}: {
  editor: Editor;
}): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [src, setSrc] = React.useState("");
  const [alt, setAlt] = React.useState("");

  const handleInsert = (): void => {
    const cleanSrc = src.trim();
    if (!cleanSrc) return;
    editor
      .chain()
      .focus()
      .setImage({ src: cleanSrc, alt: alt.trim() || "Gambar artikel" })
      .run();
    setSrc("");
    setAlt("");
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setSrc("");
          setAlt("");
        }
        setOpen(nextOpen);
      }}
    >
      <PopoverTrigger
        render={
          <button
            type="button"
            aria-label="Sisipkan Gambar dari URL"
            className="inline-flex size-8 items-center justify-center rounded-lg text-slate-600 transition-colors outline-none hover:bg-slate-200/70 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-primary/30"
          />
        }
      >
        <ImageIcon className="size-4" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 space-y-2.5 p-3">
        <p className="text-xs font-semibold text-slate-800">
          Sisipkan Gambar via URL
        </p>
        <Input
          type="url"
          value={src}
          onChange={(e) => {
            setSrc(e.target.value);
          }}
          placeholder="https://.../gambar.jpg"
        />
        <Input
          type="text"
          value={alt}
          onChange={(e) => {
            setAlt(e.target.value);
          }}
          placeholder="Keterangan gambar (opsional)"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleInsert();
            }
          }}
        />
        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            disabled={!src.trim()}
            onClick={handleInsert}
            className="h-8 rounded-lg px-3 text-xs font-semibold"
          >
            Sisipkan
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function getHeadingValue(editor: Editor): string {
  if (editor.isActive("heading", { level: 1 })) return "h1";
  if (editor.isActive("heading", { level: 2 })) return "h2";
  if (editor.isActive("heading", { level: 3 })) return "h3";
  return "paragraph";
}

function RichTextToolbar({ editor }: { editor: Editor }): React.JSX.Element {
  const state = useEditorState({
    editor,
    selector: ({ editor: instance }) => ({
      canUndo: instance.can().undo(),
      canRedo: instance.can().redo(),
      heading: getHeadingValue(instance),
      isBold: instance.isActive("bold"),
      isItalic: instance.isActive("italic"),
      isUnderline: instance.isActive("underline"),
      isStrike: instance.isActive("strike"),
      isHighlight: instance.isActive("highlight"),
      alignLeft: instance.isActive({ textAlign: "left" }),
      alignCenter: instance.isActive({ textAlign: "center" }),
      alignRight: instance.isActive({ textAlign: "right" }),
      alignJustify: instance.isActive({ textAlign: "justify" }),
      isBulletList: instance.isActive("bulletList"),
      isOrderedList: instance.isActive("orderedList"),
      isBlockquote: instance.isActive("blockquote"),
      isLink: instance.isActive("link"),
    }),
  });

  const handleHeadingChange = (val: string): void => {
    if (val === "h1") {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    } else if (val === "h2") {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    } else if (val === "h3") {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    } else {
      editor.chain().focus().setParagraph().run();
    }
  };

  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50/95 px-3 py-2 backdrop-blur-xs">
      <ToolbarButton
        label="Urungkan (Ctrl+Z)"
        disabled={!state.canUndo}
        onClick={() => {
          editor.chain().focus().undo().run();
        }}
      >
        <Undo2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Ulangi (Ctrl+Y)"
        disabled={!state.canRedo}
        onClick={() => {
          editor.chain().focus().redo().run();
        }}
      >
        <Redo2 className="size-4" />
      </ToolbarButton>

      <ToolbarDivider />

      <div className="w-36 shrink-0">
        <InputOption
          size="sm"
          searchable={false}
          value={state.heading}
          options={HEADING_OPTIONS}
          onValueChange={handleHeadingChange}
          className="h-8 rounded-lg border-slate-200/90 text-xs"
        />
      </div>

      <ToolbarDivider />

      <ToolbarButton
        label="Tebal (Ctrl+B)"
        active={state.isBold}
        onClick={() => {
          editor.chain().focus().toggleBold().run();
        }}
      >
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Miring (Ctrl+I)"
        active={state.isItalic}
        onClick={() => {
          editor.chain().focus().toggleItalic().run();
        }}
      >
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Garis Bawah (Ctrl+U)"
        active={state.isUnderline}
        onClick={() => {
          editor.chain().focus().toggleUnderline().run();
        }}
      >
        <Underline className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Coret"
        active={state.isStrike}
        onClick={() => {
          editor.chain().focus().toggleStrike().run();
        }}
      >
        <Strikethrough className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Sorot Teks"
        active={state.isHighlight}
        onClick={() => {
          editor.chain().focus().toggleHighlight().run();
        }}
      >
        <Highlighter className="size-4" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        label="Rata Kiri"
        active={state.alignLeft}
        onClick={() => {
          editor.chain().focus().setTextAlign("left").run();
        }}
      >
        <AlignLeft className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Rata Tengah"
        active={state.alignCenter}
        onClick={() => {
          editor.chain().focus().setTextAlign("center").run();
        }}
      >
        <AlignCenter className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Rata Kanan"
        active={state.alignRight}
        onClick={() => {
          editor.chain().focus().setTextAlign("right").run();
        }}
      >
        <AlignRight className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Rata Kanan-Kiri"
        active={state.alignJustify}
        onClick={() => {
          editor.chain().focus().setTextAlign("justify").run();
        }}
      >
        <AlignJustify className="size-4" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        label="Daftar Poin"
        active={state.isBulletList}
        onClick={() => {
          editor.chain().focus().toggleBulletList().run();
        }}
      >
        <List className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Daftar Bernomor"
        active={state.isOrderedList}
        onClick={() => {
          editor.chain().focus().toggleOrderedList().run();
        }}
      >
        <ListOrdered className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Kutipan"
        active={state.isBlockquote}
        onClick={() => {
          editor.chain().focus().toggleBlockquote().run();
        }}
      >
        <Quote className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Garis Pemisah"
        onClick={() => {
          editor.chain().focus().setHorizontalRule().run();
        }}
      >
        <Minus className="size-4" />
      </ToolbarButton>

      <ToolbarDivider />

      <LinkToolbarPopover editor={editor} isActive={state.isLink} />
      <ImageToolbarPopover editor={editor} />
      <ToolbarButton
        label="Bersihkan Format"
        onClick={() => {
          editor.chain().focus().unsetAllMarks().clearNodes().run();
        }}
      >
        <RemoveFormatting className="size-4" />
      </ToolbarButton>
    </div>
  );
}

function RichTextStatusBar({ editor }: { editor: Editor }): React.JSX.Element {
  const stats = useEditorState({
    editor,
    selector: ({ editor: instance }) => {
      const plain = instance.getText().trim();
      const words = plain ? plain.split(/\s+/).filter(Boolean).length : 0;
      const chars = plain.length;
      const minutes = Math.max(1, Math.ceil(words / 200));
      return { words, chars, minutes };
    },
  });

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-white px-4 py-2 text-[11px] text-slate-500">
      <div className="flex items-center gap-3 tabular-nums">
        <span>
          <strong className="font-semibold text-slate-700">{stats.words}</strong> kata
        </span>
        <span>
          <strong className="font-semibold text-slate-700">{stats.chars}</strong> karakter
        </span>
      </div>
      <span>Estimasi baca ~{stats.minutes} menit</span>
    </div>
  );
}

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  topSlot?: React.ReactNode;
  invalid?: boolean;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Mulai menulis konten di sini...",
  topSlot,
  invalid = false,
  className,
}: RichTextEditorProps): React.JSX.Element {
  const lastEmittedRef = React.useRef<string>(value);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: {
          openOnClick: false,
          HTMLAttributes: {
            class: "text-primary underline underline-offset-2",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
      Highlight,
      Image.configure({
        HTMLAttributes: {
          class: "rounded-xl border border-slate-200 max-w-full h-auto",
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "rich-content min-h-[420px] focus:outline-none",
      },
    },
    onUpdate: ({ editor: instance }) => {
      const html = instance.isEmpty ? "" : instance.getHTML();
      lastEmittedRef.current = html;
      onChange(html);
    },
  });

  React.useEffect(() => {
    if (!editor) return;
    if (value !== lastEmittedRef.current) {
      lastEmittedRef.current = value;
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div
        className={cn(
          "overflow-hidden rounded-2xl border border-slate-200 bg-slate-100/70",
          className
        )}
      >
        <div className="h-12 border-b border-slate-200 bg-slate-50" />
        <div className="mx-auto my-5 min-h-[460px] max-w-3xl animate-pulse rounded-xl border border-slate-200/80 bg-white p-8" />
      </div>
    );
  }

  return (
    <div
      data-invalid={invalid ? "true" : undefined}
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200 bg-slate-100/70 transition-colors",
        "data-[invalid=true]:border-rose-500 data-[invalid=true]:ring-3 data-[invalid=true]:ring-rose-500/20",
        className
      )}
    >
      <RichTextToolbar editor={editor} />

      <div className="p-3 sm:p-5">
        <div className="mx-auto max-w-3xl rounded-xl border border-slate-200/80 bg-white px-5 py-6 shadow-xs sm:px-10 sm:py-8">
          {topSlot}
          <EditorContent editor={editor} />
        </div>
      </div>

      <RichTextStatusBar editor={editor} />
    </div>
  );
}
