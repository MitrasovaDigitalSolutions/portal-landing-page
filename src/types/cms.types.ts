export type SiteSettingsMap = Record<string, Record<string, unknown>>;

export interface PageSection {
  id: number;
  page_id?: number;
  key: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  payload: Record<string, unknown> | null;
  image_path: string | null;
  image_url: string | null;
  order: number;
  is_active: boolean;
}

export interface PageSummary {
  id: number;
  site_id?: string;
  slug: string;
  title: string;
  meta_title: string | null;
  meta_desc: string | null;
  is_active: boolean;
  sections?: PageSection[];
  sections_count?: number;
}

export interface PageDetail extends PageSummary {
  sections: PageSection[];
}

export interface ServiceType {
  id: number;
  site_id?: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  icon_url?: string | null;
  order: number;
  services_count?: number;
}

export interface ServiceItem {
  id: number;
  site_id?: string;
  service_type_id: number;
  name: string;
  slug: string;
  short_desc: string;
  body: string | null;
  icon_path: string | null;
  thumbnail_path: string | null;
  icon_url: string | null;
  thumbnail_url: string | null;
  images?: string[] | null;
  image_urls?: string[] | null;
  features: string[] | null;
  price: number | null;
  price_note: string | null;
  is_featured: boolean;
  is_active: boolean;
  order: number;
  service_type?: ServiceType | null;
}

export interface PortfolioItem {
  id: number;
  site_id?: string;
  service_type_id: number | null;
  title: string;
  slug: string;
  client_name: string | null;
  completion_date: string | null;
  description: string | null;
  thumbnail_path: string | null;
  thumbnail_url: string | null;
  gallery_images?: string[] | null;
  gallery_image_urls?: string[] | null;
  is_featured: boolean;
  order: number;
  service_type?: ServiceType | null;
}

export interface BranchItem {
  id: number;
  name: string;
  address: string;
  phone: string | null;
  whatsapp: string | null;
  is_primary: boolean;
  images: string[] | null;
  image_urls: string[] | null;
  order: number;
}

export interface BusinessUnitItem {
  id: number;
  name: string;
  address: string | null;
  image_path: string | null;
  image_url: string | null;
  images: string[] | null;
  image_urls: string[] | null;
  url: string | null;
  order: number;
}

export interface ArticleCategory {
  id: number;
  site_id?: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  articles_count?: number;
}

export type ArticleStatus = "draft" | "published" | "archived";

export interface ArticleItem {
  id: number;
  site_id?: string;
  article_category_id: number | null;
  author_id?: number;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  thumbnail_path: string | null;
  thumbnail_url: string | null;
  status: ArticleStatus;
  published_at: string | null;
  category?: ArticleCategory | null;
  author?: { id: number; name: string } | null;
}

export interface FaqCategory {
  id: number;
  site_id?: string;
  name: string;
  slug: string;
  order: number;
  faqs?: FaqItem[];
}

export interface FaqItem {
  id: number;
  site_id?: string;
  faq_category_id: number | null;
  question: string;
  answer: string;
  order: number;
  is_active: boolean;
  category?: { id: number; name: string; slug: string } | null;
}

export interface TestimonialItem {
  id: number;
  site_id?: string;
  name: string;
  title: string | null;
  avatar_path: string | null;
  avatar_url: string | null;
  image_path: string | null;
  image_url: string | null;
  message: string;
  rating: number;
  order: number;
  is_active: boolean;
}

export interface PartnerItem {
  id: number;
  site_id?: string;
  name: string;
  logo_path: string | null;
  logo_url: string | null;
  website_url: string | null;
  phone: string | null;
  order: number;
}

export type InquiryStatus = "new" | "contacted" | "closed";

export interface InquiryItem {
  id: number;
  site_id?: string;
  name: string;
  phone: string;
  email: string | null;
  subject: string | null;
  message: string;
  attachment_url: string | null;
  status: InquiryStatus;
  notes: string | null;
  created_at: string;
  updated_at?: string;
}

export interface MediaUsageRef {
  type: string;
  id: number | string;
  label: string | null;
  field: string;
}

export interface MediaItem {
  path: string;
  url: string;
  size: number;
  modified_at: string;
  owner_site: string | null;
  usage: MediaUsageRef[];
}

export interface ReplaceMediaResult {
  path: string;
  previous_path: string;
  url: string;
  size: number;
  modified_at: string;
  references_updated: number;
}

export type SectionFieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "url"
  | "image"
  | "number"
  | "boolean"
  | "select"
  | "list"
  | "group"
  | "repeater";

export interface SectionFieldSchema {
  name: string;
  label: string;
  type: SectionFieldType;
  required?: boolean;
  max?: number;
  rows?: number;
  options?: string[];
  fields?: SectionFieldSchema[];
}

export interface SectionTypeDefinition {
  id: number;
  key: string;
  name: string;
  description: string | null;
  fields: SectionFieldSchema[];
  aliases: string[] | null;
  is_active: boolean;
}

export interface UploadedMediaResult {
  path: string;
  url: string;
  size: number;
  modified_at: string;
}

export interface DeleteMediaResult {
  path: string;
  usage: MediaUsageRef[];
}
