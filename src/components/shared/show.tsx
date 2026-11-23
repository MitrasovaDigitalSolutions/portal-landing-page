import type { ReactNode } from "react";

interface ShowProps {
  when: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

export function Show({
  when,
  fallback = null,
  children,
}: ShowProps): React.JSX.Element | null {
  const content = when ? children : fallback;
  if (!content) {
    return null;
  }
  return <span className="contents">{content}</span>;
}
