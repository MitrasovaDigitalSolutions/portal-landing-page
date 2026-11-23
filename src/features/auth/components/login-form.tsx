"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "@/components/forms/form-input";
import { Button } from "@/components/ui/button";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login.schema";

function resolveSafeCallbackUrl(rawUrl: string | null): string {
  if (!rawUrl || !rawUrl.startsWith("/") || rawUrl.startsWith("//")) {
    return "/";
  }
  return rawUrl;
}

export function LoginForm(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = methods.handleSubmit(async (values) => {
    setAuthError(null);

    const res = await signIn("credentials", {
      email: values.email.trim(),
      password: values.password,
      redirect: false,
    });

    if (res.error) {
      const msg =
        "Email atau kata sandi tidak valid. Silakan periksa kembali.";
      setAuthError(msg);
      toast.error(msg);
      return;
    }

    toast.success("Login berhasil! Mengalihkan ke portal...");
    const targetUrl = resolveSafeCallbackUrl(searchParams.get("callbackUrl"));
    router.replace(targetUrl);
    router.refresh();
  });

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 space-y-2 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck className="size-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Mitrasova Portal CMS
        </h1>
        <p className="text-xs leading-relaxed text-slate-500">
          Masuk menggunakan akun administrator untuk mengelola tenant dan konten website.
        </p>
      </div>

      {authError ? (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700">
          {authError}
        </div>
      ) : null}

      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          className="space-y-4"
        >
          <FormInput<LoginFormValues>
            name="email"
            type="email"
            label="Alamat Email"
            placeholder="admin@mitrasova.id"
            autoComplete="email"
            leftIcon={<Mail className="size-4" />}
            required
          />

          <div className="relative">
            <FormInput<LoginFormValues>
              name="password"
              type={showPassword ? "text" : "password"}
              label="Kata Sandi"
              placeholder="Masukkan kata sandi"
              autoComplete="current-password"
              leftIcon={<Lock className="size-4" />}
              className="pr-10"
              required
            />
            <button
              type="button"
              aria-label={
                showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
              }
              onClick={() => {
                setShowPassword((prev) => !prev);
              }}
              className="absolute top-[30px] right-2.5 flex size-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>

          <Button
            type="submit"
            disabled={methods.formState.isSubmitting}
            className="mt-2 h-10 w-full gap-2 rounded-xl text-xs font-semibold shadow-xs"
          >
            {methods.formState.isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Memproses Login...</span>
              </>
            ) : (
              <span>Masuk ke Portal</span>
            )}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
