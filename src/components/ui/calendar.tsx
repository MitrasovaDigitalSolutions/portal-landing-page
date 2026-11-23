"use client";

import * as React from "react";
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type DropdownProps,
  type Locale,
} from "react-day-picker";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

function CalendarDropdown({
  value,
  onChange,
  options,
}: DropdownProps): React.JSX.Element {
  const selectedOption = options?.find((opt) => opt.value === value);

  const handleValueChange = (newValue: string | null): void => {
    if (newValue === null) return;
    const syntheticEvent = {
      target: {
        value: newValue,
      },
    } as unknown as React.ChangeEvent<HTMLSelectElement>;
    onChange?.(syntheticEvent);
  };

  return (
    <Select
      value={value !== undefined ? String(value) : undefined}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="relative z-10 flex h-7 cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 transition-colors select-none hover:border-primary/40 hover:bg-primary/5 hover:text-primary">
        <SelectValue>{selectedOption?.label}</SelectValue>
      </SelectTrigger>
      <SelectContent className="z-[120] max-h-[280px] rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
        {options?.map((option) => (
          <SelectItem
            key={option.value}
            value={String(option.value)}
            disabled={option.disabled}
            className="cursor-pointer rounded-lg px-2 py-1.5 text-xs hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & {
  locale?: Partial<Locale>;
}): React.JSX.Element {
  const defaultClassNames = getDefaultClassNames();
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) {
      ref.current?.focus();
    }
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      type="button"
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 text-xs font-medium leading-none",
        "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-primary group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-primary/20",
        "hover:bg-primary/10 hover:text-primary",
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:font-semibold data-[selected-single=true]:text-primary-foreground hover:data-[selected-single=true]:bg-primary/90 hover:data-[selected-single=true]:text-primary-foreground",
        "data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground",
        "data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-primary/10 data-[range-middle=true]:text-primary",
        "data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground",
        "[&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  );
}

function CalendarChevron({
  className,
  orientation,
}: {
  className?: string;
  orientation?: "left" | "right" | "up" | "down";
}): React.JSX.Element {
  if (orientation === "left") {
    return <ChevronLeftIcon className={cn("size-4", className)} />;
  }
  if (orientation === "right") {
    return <ChevronRightIcon className={cn("size-4", className)} />;
  }
  return <ChevronDownIcon className={cn("size-4", className)} />;
}

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}): React.JSX.Element {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar bg-white p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(8)]",
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-3", defaultClassNames.month),
        nav: cn(
          "pointer-events-none absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "pointer-events-auto size-(--cell-size) p-0 select-none hover:bg-primary/10 hover:text-primary aria-disabled:opacity-40",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "pointer-events-auto size-(--cell-size) p-0 select-none hover:bg-primary/10 hover:text-primary aria-disabled:opacity-40",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-xs font-semibold",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-(--cell-radius)",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 bg-popover opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "text-xs font-semibold text-slate-800 select-none",
          defaultClassNames.caption_label
        ),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 rounded-(--cell-radius) text-[11px] font-semibold text-slate-400 select-none",
          defaultClassNames.weekday
        ),
        week: cn("mt-1.5 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[11px] text-slate-400 select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)"
            : "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
          defaultClassNames.day
        ),
        today: cn(
          "rounded-(--cell-radius) bg-primary/10 font-semibold text-primary data-[selected=true]:bg-transparent",
          defaultClassNames.today
        ),
        outside: cn(
          "text-slate-300 aria-selected:text-slate-400",
          defaultClassNames.outside
        ),
        disabled: cn("text-slate-300 opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className: rootCls, rootRef, ...rootProps }) => (
          <div
            data-slot="calendar"
            ref={rootRef}
            className={cn(rootCls)}
            {...rootProps}
          />
        ),
        Chevron: CalendarChevron,
        DayButton: (dayProps) => (
          <CalendarDayButton locale={locale} {...dayProps} />
        ),
        CaptionLabel:
          captionLayout === "dropdown" ? () => <span hidden /> : undefined,
        Dropdown: CalendarDropdown,
        ...components,
      }}
      {...props}
    />
  );
}

export { CalendarDayButton };
