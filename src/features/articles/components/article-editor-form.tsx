"use client";

import { ArrowLeft, Loader2, Save, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { FormRichText } from "@/components/forms/form-rich-text";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { saveArticleAction } from "@/features/articles/actions/articles.actions";
import { ArticleEditorSidebar } from "@/features/articles/components/article-editor-sidebar";
import type { ArticleEditorValues } from "@/features/articles/schemas/article.schemas";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useServerErrors } from "@/hooks/use-server-errors";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { ArticleCategory, ArticleItem } from "@/types/cms.types";
import { FormDataBuilder } from "@/utils/form-data";
import { normalizeArticleBodyInput } from "@/utils/sanitize-html";

interface ArticleEditorFormProps {
  article: ArticleItem | null;
  categories: ArticleCategory[];
}

function getInitialValues(
  article: ArticleItem | null,
  categories: ArticleCategory[]
): ArticleEditorValues {
  const fallbackCatId = categories[0] ? String(categories[0].id) : "";
  return {
    title: article?.title ?? "",
    slug: article?.slug ?? "",
    article_category_id: article?.article_category_id
      ? String(article.article_category_id)
      : fallbackCatId,
    status: article?.status ?? "published",
    published_at: article?.published_at ? article.published_at.slice(0, 10) : "",
    excerpt: article?.excerpt ?? "",
    body: normalizeArticleBodyInput(article?.body),
    thumbnail: null,
  };
}

function buildArticleFormData(values: ArticleEditorValues): FormData {
  return new FormDataBuilder()
    .appendText("title", values.title.trim())
    .appendText("slug", values.slug.trim())
    .appendText("article_category_id", values.article_category_id)
    .appendText("status", values.status)
    .appendOptionalText("excerpt", values.excerpt.trim())
    .appendText("body", values.body)
    .appendOptionalText("published_at", values.published_at.trim())
    .appendFile("thumbnail", values.thumbnail)
    .build();
}

export function ArticleEditorForm({
  article,
  categories,
}: ArticleEditorFormProps): React.JSX.Element {
  const router = useRouter();
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";

  const methods = useForm<ArticleEditorValues>({
    defaultValues: getInitialValues(article, categories),
  });

  const applyServerErrors = useServerErrors(methods.setError);
  const currentStatus = useWatch({
    control: methods.control,
    name: "status",
  });

  const titleError = methods.formState.errors.title?.message;

  const mutation = useCrudMutation({
    mutationFn: (values: ArticleEditorValues) =>
      saveArticleAction(article?.id ?? null, buildArticleFormData(values)),
    invalidateKeys: [queryKeys.articles.all(siteKey)],
    onSuccess: () => {
      router.push("/articles");
    },
    onError: (result) => {
      applyServerErrors(result.fieldErrors);
    },
  });

  const submitForm = methods.handleSubmit((values) => {
    if (!values.title.trim()) {
      methods.setError("title", { message: "Judul artikel wajib diisi." });
      return;
    }
    if (!values.body.trim()) {
      methods.setError("body", { message: "Isi konten artikel wajib diisi." });
      return;
    }
    mutation.mutate(values);
  });

  const titleSlot = (
    <div className="mb-6 border-b border-slate-100 pb-4">
      <input
        type="text"
        {...methods.register("title")}
        placeholder="Judul Artikel Tanpa Nama..."
        className="w-full bg-transparent text-2xl font-extrabold tracking-tight text-slate-900 outline-none placeholder:text-slate-300 sm:text-3xl"
      />
      {titleError ? (
        <p className="mt-1.5 text-xs font-medium text-rose-500">{titleError}</p>
      ) : null}
    </div>
  );

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(event) => {
          void submitForm(event);
        }}
        className="space-y-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white px-4 py-3 shadow-xs">
          <div className="flex items-center gap-3">
            <Link
              href="/articles"
              className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <ArrowLeft className="size-3.5" />
              <span>Kembali</span>
            </Link>
            <StatusBadge status={currentStatus} />
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={mutation.isPending}
              onClick={() => {
                methods.setValue("status", "draft", { shouldDirty: true });
                void submitForm();
              }}
              className="h-9 gap-1.5 rounded-xl border-slate-200 px-3.5 text-xs font-semibold text-slate-700"
            >
              <Save className="size-3.5" />
              <span>Simpan Draft</span>
            </Button>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="h-9 gap-1.5 rounded-xl px-4 text-xs font-semibold shadow-xs"
            >
              {mutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Send className="size-3.5" />
              )}
              <span>{article ? "Simpan Perubahan" : "Simpan Artikel"}</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <FormRichText<ArticleEditorValues>
            name="body"
            topSlot={titleSlot}
            placeholder="Mulai ketik atau susun isi artikel Anda di sini..."
          />
          <ArticleEditorSidebar article={article} categories={categories} />
        </div>
      </form>
    </FormProvider>
  );
}
