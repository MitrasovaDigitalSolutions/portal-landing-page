import type { ReactNode } from "react";

interface PortalPageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PortalPageHeader({
  title,
  description,
  action,
}: PortalPageHeaderProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        ) : null}
      </div>
      {action ? <div className="flex items-center gap-2.5">{action}</div> : null}
    </div>
  );
}
