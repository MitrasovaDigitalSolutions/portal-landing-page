import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { env } from "@/config/env";
import { ProgressProvider } from "@/providers/progress-provider";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: env.NEXT_PUBLIC_APP_NAME,
    template: `%s | ${env.NEXT_PUBLIC_APP_NAME}`,
  },
  description:
    "Portal Manajemen Multi-Tenant terpusat untuk mengelola website unit usaha Mitrasova.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        <QueryProvider>
          <ProgressProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </ProgressProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
