import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "group/badge inline-flex h-auto w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border px-2.5 py-0.5 text-[11px] leading-none font-bold whitespace-nowrap shadow-2xs transition-all select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "border-primary/20 bg-primary text-primary-foreground [a]:hover:bg-primary/90",
        secondary:
          "border-slate-200/80 bg-slate-100 text-slate-700 [a]:hover:bg-slate-200/70",
        destructive:
          "border-rose-500/20 bg-rose-50 text-rose-700 [a]:hover:bg-rose-100/80",
        danger:
          "border-rose-500/20 bg-rose-50 text-rose-700 [a]:hover:bg-rose-100/80",
        success:
          "border-emerald-500/20 bg-emerald-50 text-emerald-700 [a]:hover:bg-emerald-100/80",
        warning:
          "border-amber-500/20 bg-amber-50 text-amber-700 [a]:hover:bg-amber-100/80",
        info:
          "border-blue-500/20 bg-blue-50 text-blue-700 [a]:hover:bg-blue-100/80",
        sky:
          "border-sky-500/20 bg-sky-50 text-sky-700 [a]:hover:bg-sky-100/80",
        purple:
          "border-indigo-500/20 bg-indigo-50 text-indigo-700 [a]:hover:bg-indigo-100/80",
        outline:
          "border-slate-200 bg-white text-slate-700 [a]:hover:bg-slate-50",
        ghost:
          "border-transparent bg-transparent text-slate-600 shadow-none [a]:hover:bg-slate-100",
        link: "border-transparent text-primary underline-offset-4 shadow-none hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants>): React.JSX.Element {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
