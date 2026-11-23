import { ArrowLeft, FileQuestion } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function NotFound(): React.JSX.Element {
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-20 text-center">
      <Container size="narrow">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <FileQuestion className="size-10" />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Halaman Tidak Ditemukan (404)
        </h1>
        <p className="mt-3 text-sm text-slate-500 sm:text-base">
          Maaf, halaman portal yang Anda cari tidak tersedia atau tautan telah dipindahkan.
        </p>
        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            className="rounded-full font-semibold"
            render={<Link href="/" />}
          >
            <ArrowLeft className="size-4" />
            <span>Kembali ke Dashboard</span>
          </Button>
        </div>
      </Container>
    </div>
  );
}
