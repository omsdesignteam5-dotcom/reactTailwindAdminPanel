import React, { type ComponentProps } from "react";
import { DayPicker, type DropdownProps } from "react-day-picker";

//Icons
import { ChevronLeft, ChevronRight } from "lucide-react";

//Utils
import { cn } from "src/utils/utils";

//Components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select/select";
import { ScrollArea } from "src/components/ui/scrollArea/scrollArea";

type CalendarProps = ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const navButtonStyles =
    "inline-flex items-center justify-center h-7 w-7 rounded-md border border-input bg-transparent p-0 text-sm shadow-xs opacity-50 hover:opacity-100 hover:bg-accent hover:text-accent-foreground transition-colors";

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 relative", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-2",
        month_caption: "flex justify-center items-center",
        caption_label: "text-sm font-medium",
        dropdowns: "flex items-center gap-1",
        dropdown: "relative inline-flex items-center",
        dropdown_root: "",
        months_dropdown: "",
        years_dropdown: "",
        nav: "flex items-center gap-1",
        button_previous: cn(navButtonStyles, "absolute left-2 top-3"),
        button_next: cn(navButtonStyles, "absolute right-2 top-3"),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50",
        day_button:
          "inline-flex items-center justify-center h-8 w-8 rounded-md p-0 text-sm font-normal transition-colors hover:bg-accent hover:text-accent-foreground aria-selected:opacity-100",
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
        today: "bg-accent text-accent-foreground rounded-md",
        outside:
          "text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") {
            return <ChevronLeft className="h-4 w-4" />;
          }
          return <ChevronRight className="h-4 w-4" />;
        },
        Dropdown: ({ value, onChange, options, ...props }: DropdownProps) => {
          const handleChange = (value: string) => {
            const changeEvent = {
              target: { value },
            } as React.ChangeEvent<HTMLSelectElement>;
            onChange?.(changeEvent);
          };

          const selected = options?.find((option) => option.value === value);
          const isMonth = options?.length === 12 && options?.[0].value === 0;

          return (
            <Select
              value={value?.toString()}
              onValueChange={(value) => {
                handleChange(value);
              }}>
              <SelectTrigger
                className={cn(
                  "h-7 w-fit gap-1 bg-transparent p-0 px-2 shadow-none text-sm hover:bg-accent hover:text-accent-foreground focus:ring-0 [&>span]:line-clamp-none",
                  props.className,
                )}>
                <SelectValue>
                  {isMonth && selected
                    ? selected.label.substring(0, 3)
                    : selected?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent position="popper">
                <ScrollArea className="h-80">
                  {options?.map((option, id: number) => (
                    <SelectItem
                      key={`${option.value}-${id}`}
                      value={option.value?.toString() ?? ""}>
                      {option.label}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          );
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
export type { CalendarProps };
