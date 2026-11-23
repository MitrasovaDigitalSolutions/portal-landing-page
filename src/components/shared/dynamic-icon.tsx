import { resolveDynamicIcon } from "@/utils/icon-mapper";
import { createElement } from "react";

interface DynamicIconProps {
  name?: string | null;
  className?: string;
}

export function DynamicIcon({
  name,
  className = "size-4",
}: DynamicIconProps): React.JSX.Element {
  const iconComponent = resolveDynamicIcon(name);
  return createElement(iconComponent, { className });
}
