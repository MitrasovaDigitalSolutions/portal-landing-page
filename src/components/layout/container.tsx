import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

interface ContainerProps extends ComponentProps<"div"> {
  children: ReactNode;
  size?: "default" | "narrow" | "wide";
}

export function Container({
  children,
  className,
  size = "default",
  ...props
}: ContainerProps): React.JSX.Element {
  const sizeClasses = {
    narrow: "max-w-4xl",
    default: "max-w-7xl",
    wide: "max-w-7xl px-4 sm:px-6 lg:px-10",
  }[size];

  return (
    <div
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizeClasses, className)}
      {...props}
    >
      {children}
    </div>
  );
}
