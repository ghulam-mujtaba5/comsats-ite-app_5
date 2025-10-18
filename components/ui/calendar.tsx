"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { cva, type VariantProps } from "class-variance-authority"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const calendarVariants = cva(
  "group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
  {
    variants: {
      variant: {
        default: "bg-background",
        glass: "bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-lg shadow-glass",
        "glass-subtle": "bg-white/5 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-lg shadow-glass-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface CalendarProps extends VariantProps<typeof calendarVariants> {
  className?: string
  classNames?: any
  showOutsideDays?: boolean
  captionLayout?: "label" | "dropdown"
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
  formatters?: any
  components?: any
  [key: string]: any
}

function Calendar({
  className,
  variant,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames()
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "" 
    : "transition-all duration-300"

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        calendarVariants({ variant }),
        animationClasses,
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
        variant?.startsWith("glass") && "dark"
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "flex gap-4 flex-col md:flex-row relative",
          defaultClassNames.months
        ),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          variant === "glass" ? "text-white hover:bg-white/20" : 
          variant === "glass-subtle" ? "text-white hover:bg-white/15" : "",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          variant === "glass" ? "text-white hover:bg-white/20" : 
          variant === "glass-subtle" ? "text-white hover:bg-white/15" : "",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md",
          variant === "glass" ? "border-slate-200 dark:border-slate-700 bg-white/10" : 
          variant === "glass-subtle" ? "border-slate-200 dark:border-slate-700 bg-white/5" : "",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute bg-popover inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-slate-700 dark:text-slate-300 [&>svg]:size-3.5",
          variant?.startsWith("glass") ? "text-white" : "",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "rounded-md flex-1 font-normal text-[0.8rem] select-none",
          variant?.startsWith("glass") ? "text-white/80" : "text-muted-foreground",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        week_number_header: cn(
          "select-none w-(--cell-size)",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] select-none",
          variant?.startsWith("glass") ? "text-white/70" : "text-muted-foreground",
          defaultClassNames.week_number
        ),
        day: cn(
          "relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
          defaultClassNames.day
        ),
        range_start: cn(
          "rounded-l-md",
          variant?.startsWith("glass") ? "bg-white/30" : "bg-accent",
          defaultClassNames.range_start
        ),
        range_middle: cn(
          "rounded-none",
          variant?.startsWith("glass") ? "bg-white/20" : "",
          defaultClassNames.range_middle
        ),
        range_end: cn(
          "rounded-r-md",
          variant?.startsWith("glass") ? "bg-white/30" : "bg-accent",
          defaultClassNames.range_end
        ),
        today: cn(
          "rounded-md data-[selected=true]:rounded-none",
          variant?.startsWith("glass") ? "bg-white/20 text-white" : "bg-accent text-accent-foreground",
          defaultClassNames.today
        ),
        outside: cn(
          variant?.startsWith("glass") ? "text-white/50 aria-selected:text-white/50" : "text-slate-700 dark:text-slate-300 aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          variant?.startsWith("glass") ? "text-white/30 opacity-50" : "text-slate-700 dark:text-slate-300 opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn(
                "size-4",
                variant?.startsWith("glass") ? "text-white" : "",
                className
              )} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn(
                  "size-4",
                  variant?.startsWith("glass") ? "text-white" : "",
                  className
                )}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn(
              "size-4",
              variant?.startsWith("glass") ? "text-white" : "",
              className
            )} {...props} />
          )
        },
        DayButton: ({ className, day, modifiers, ...props }) => {
          const ref = React.useRef<HTMLButtonElement>(null)
          React.useEffect(() => {
            if (modifiers.focused) ref.current?.focus()
          }, [modifiers.focused])

          return (
            <Button
              ref={ref}
              variant="ghost"
              size="icon"
              data-day={day.date.toLocaleDateString()}
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
                "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70",
                variant === "glass" ? "text-white hover:bg-white/20 data-[selected-single=true]:bg-white/30 data-[selected-single=true]:text-white data-[range-middle=true]:bg-white/20 data-[range-middle=true]:text-white data-[range-start=true]:bg-white/30 data-[range-start=true]:text-white data-[range-end=true]:bg-white/30 data-[range-end=true]:text-white" : 
                variant === "glass-subtle" ? "text-white hover:bg-white/15 data-[selected-single=true]:bg-white/20 data-[selected-single=true]:text-white data-[range-middle=true]:bg-white/15 data-[range-middle=true]:text-white data-[range-start=true]:bg-white/20 data-[range-start=true]:text-white data-[range-end=true]:bg-white/20 data-[range-end=true]:text-white" : "",
                className,
                variant?.startsWith("glass") && "dark"
              )}
              {...props}
            />
          )
        },
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

export { Calendar }