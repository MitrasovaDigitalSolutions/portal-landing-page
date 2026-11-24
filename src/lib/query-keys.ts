export const queryKeys = {
  sites: {
    all: ["sites"] as const,
    list: () => [...queryKeys.sites.all, "list"] as const,
  },
  users: {
    all: ["users"] as const,
    list: () => [...queryKeys.users.all, "list"] as const,
  },
  settings: {
    all: (siteKey: string) => ["settings", siteKey] as const,
  },
  pages: {
    all: (siteKey: string) => ["pages", siteKey] as const,
    detail: (siteKey: string, id: string | number) =>
      ["pages", siteKey, String(id)] as const,
  },
  services: {
    all: (siteKey: string) => ["services", siteKey] as const,
  },
  portfolios: {
    all: (siteKey: string) => ["portfolios", siteKey] as const,
  },
  businessUnits: {
    all: (siteKey: string) => ["business-units", siteKey] as const,
  },
  branches: {
    all: (siteKey: string) => ["branches", siteKey] as const,
  },
  testimonials: {
    all: (siteKey: string) => ["testimonials", siteKey] as const,
  },
  partners: {
    all: (siteKey: string) => ["partners", siteKey] as const,
  },
  articles: {
    all: (siteKey: string) => ["articles", siteKey] as const,
  },
  faqs: {
    all: (siteKey: string) => ["faqs", siteKey] as const,
  },
  contacts: {
    all: (siteKey: string) => ["contacts", siteKey] as const,
  },
  statistics: {
    all: (siteKey: string) => ["statistics", siteKey] as const,
  },
  media: {
    all: (siteKey: string) => ["media", siteKey] as const,
  },
} as const;
