import sanitizeHtml from "sanitize-html";
import {
  buildMediaVariantUrl,
  isOptimizableProxyMedia,
  rewriteEmbeddedMediaUrl,
} from "@/utils/media";

const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;

const ALLOWED_TAGS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "strike",
  "mark",
  "blockquote",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "code",
  "pre",
  "hr",
];

function escapeHtmlText(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function convertPlainTextToHtml(raw: string): string {
  const paragraphs = raw
    .trim()
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return "";
  }

  return paragraphs
    .map(
      (block) =>
        `<p>${escapeHtmlText(block).replaceAll("\n", "<br />")}</p>`
    )
    .join("");
}

export function isHtmlContent(raw: string): boolean {
  return HTML_TAG_PATTERN.test(raw);
}

export function normalizeArticleBodyInput(raw?: string | null): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return isHtmlContent(trimmed) ? trimmed : convertPlainTextToHtml(trimmed);
}

export function sanitizeArticleHtml(raw: string): string {
  const html = normalizeArticleBodyInput(raw);
  if (!html) return "";

  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title", "loading", "decoding"],
      p: ["style"],
      h1: ["style"],
      h2: ["style"],
      h3: ["style"],
      h4: ["style"],
    },
    allowedStyles: {
      "*": {
        "text-align": [/^(left|center|right|justify)$/],
      },
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      img: (tagName, attribs) => {
        if (!attribs.src) {
          return { tagName, attribs };
        }
        const rewrittenSrc = rewriteEmbeddedMediaUrl(attribs.src);
        const optimizedSrc = isOptimizableProxyMedia(rewrittenSrc)
          ? buildMediaVariantUrl(rewrittenSrc, 1080, 80)
          : rewrittenSrc;
        return {
          tagName,
          attribs: {
            ...attribs,
            src: optimizedSrc,
            loading: attribs.loading || "lazy",
            decoding: attribs.decoding || "async",
          },
        };
      },
    },
  });
}
