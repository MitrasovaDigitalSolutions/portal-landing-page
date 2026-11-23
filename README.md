# Mitrasova Portal CMS

Portal manajemen konten (CMS) multi-tenant mandiri untuk mengelola seluruh website unit usaha di platform **Mitrasova**.

## Arsitektur & Fitur Utama

- **Framework**: Next.js 16 (App Router, Turbopack, `src/proxy.ts` route guard).
- **Multi-Tenant Switcher**: Pemilihan tenant aktif menggunakan cookie `httpOnly` (`active_site_key`) yang disinkronkan di Server Components, Server Actions, dan client `TenantProvider`.
- **Autentikasi & RBAC**: NextAuth v5 (Credentials JWT) yang menyimpan token Sanctum backend di sesi server, mendukung peran **Superadmin**, **Admin Site**, dan **Editor**.
- **Scoped API Client (SOLID/DIP)**: Pemisahan tegas antara endpoint global platform (`scope: "global"`, tanpa `X-Site-Key`) dan endpoint tenant (`scope: "tenant"`, wajib `X-Site-Key` serta dukungan otomatis Laravel multipart `PUT`/`PATCH` override).
- **DRY Server Action & Mutation Pipeline**: Wrapper otorisasi (`withSuperadminAction`, `withTenantAction`), validasi Zod, `useCrudMutation`, `useDeleteConfirm`, dan pemetaan server validation errors (`useServerErrors`).
- **Modul Lengkap**:
  - Platform Global (Superadmin): Kelola Tenant (`/sites`), Manajemen User & Role (`/users`).
  - Website & Pengaturan: Pengaturan Situs + Tema Dinamis + Visibilitas Modul (`/settings`), Halaman & Seksi (`/pages`, `/pages/[id]`).
  - Konten & Engagement: Layanan & Tipe (`/services`), Portofolio (`/portfolios`), Unit Bisnis (`/business-units`), Kantor Cabang (`/branches`), Testimoni (`/testimonials`), Mitra (`/partners`), Berita & Artikel (`/articles`), FAQ (`/faqs`), Pesan Masuk (`/inquiries`).

## Variabel Lingkungan

Salin `.env.example` menjadi `.env.local` dan sesuaikan nilainya:

```env
NEXT_PUBLIC_API_URL=http://43.157.197.42:8088/api/v1
NEXT_PUBLIC_APP_NAME=Mitrasova Portal CMS
AUTH_SECRET=replace-with-openssl-rand-base64-32
AUTH_TRUST_HOST=true
```

> Catatan: Jangan pernah mengunggah `.env.local` atau `AUTH_SECRET` ke repositori Git.

## Perintah Pengembangan

```bash
bun install
bun run dev
bun run typecheck
bun run lint
bun run build
```
