import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { PageLoader } from "@/components/shared/page-loader";
import { LoginForm } from "@/features/auth/components/login-form";
import { getPortalSession } from "@/lib/auth/auth";

export const metadata: Metadata = {
  title: "Masuk Portal",
  description: "Akses manajemen konten multi-tenant Mitrasova",
};

export default async function LoginPage(): Promise<React.JSX.Element> {
  const session = await getPortalSession();
  if (session?.accessToken) {
    redirect("/");
  }

  return (
    <Container size="narrow" className="flex items-center justify-center">
      <Suspense fallback={<PageLoader message="Menyiapkan form login..." />}>
        <LoginForm />
      </Suspense>
    </Container>
  );
}
