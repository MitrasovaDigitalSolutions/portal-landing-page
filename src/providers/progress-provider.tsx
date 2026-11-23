"use client";

import { ProgressProvider as BProgressProvider } from "@bprogress/next/app";
import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

interface ProgressProviderProps {
  children: ReactNode;
}

export function ProgressProvider({
  children,
}: ProgressProviderProps): React.JSX.Element {
  return (
    <MotionConfig reducedMotion="user">
      <BProgressProvider
        height="3px"
        color="var(--primary)"
        options={{ showSpinner: false }}
        shallowRouting
      >
        {children}
      </BProgressProvider>
    </MotionConfig>
  );
}
