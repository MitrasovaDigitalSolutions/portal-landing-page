"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({
  error: _error,
  reset,
}: ErrorProps): React.JSX.Element {
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-20 text-center">
      <Container size="narrow">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-rose-50 text-rose-500">
          <AlertTriangle className="size-10" />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Terjadi Kendala Teknis
        </h1>
        <p className="mt-3 text-sm text-slate-500 sm:text-base">
          Maaf, terjadi kesalahan saat memuat halaman portal. Silakan coba muat ulang.
        </p>
        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            onClick={reset}
            className="rounded-full font-semibold"
          >
            <RotateCcw className="size-4" />
            <span>Coba Lagi</span>
          </Button>
        </div>
      </Container>
    </div>
  );
}
