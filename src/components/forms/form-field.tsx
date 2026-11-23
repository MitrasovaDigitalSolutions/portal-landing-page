import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface FormFieldProps {
  id: string;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}

export function FormField({
  id,
  label,
  required,
  error,
  className,
  children,
}: FormFieldProps): React.JSX.Element {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label htmlFor={id} className="text-xs font-bold text-slate-700">
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </Label>
      )}
      {children}
      {error && (
        <p className="text-xs font-medium text-rose-500">{error}</p>
      )}
    </div>
  );
}
