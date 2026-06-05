import { useState } from "react";
import { format } from "date-fns";
import { type DateRange } from "react-day-picker";
import { Calendar as CalendarIcon } from "lucide-react";

//Utils
import { cn } from "src/utils/utils";

// Components
import { Button } from "src/components/ui/button/button";
import { Calendar } from "src/components/ui/datePicker/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/components/ui/popover/popover";

/* ─── Single Date Picker ──────────────────────────── */

interface DatePickerProps {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({
  selected,
  onSelect,
  placeholder = "Pick a date",
  className,
  disabled,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className,
          )}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          captionLayout="dropdown"
          startMonth={new Date(1900, 0)}
          endMonth={new Date(2100, 11)}
        />
      </PopoverContent>
    </Popover>
  );
}

/* ─── Date Range Picker ───────────────────────────── */

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  placeholder = "Pick a date range",
  className,
  disabled,
}: DateRangePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-[300px] justify-start text-left font-normal",
            !dateRange && "text-muted-foreground",
            className,
          )}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "LLL dd, y")} -{" "}
                {format(dateRange.to, "LLL dd, y")}
              </>
            ) : (
              format(dateRange.from, "LLL dd, y")
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={onDateRangeChange}
          numberOfMonths={2}
          autoFocus
          captionLayout="dropdown"
          startMonth={new Date(1900, 0)}
          endMonth={new Date(2100, 11)}
        />
      </PopoverContent>
    </Popover>
  );
}

/* ─── Simple Date Picker (uncontrolled) ───────────── */

interface SimpleDatePickerProps {
  placeholder?: string;
  className?: string;
  onDateChange?: (date: Date | undefined) => void;
}

export function SimpleDatePicker({
  placeholder = "Pick a date",
  className,
  onDateChange,
}: SimpleDatePickerProps) {
  const [date, setDate] = useState<Date | undefined>();

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    onDateChange?.(newDate);
  };

  return (
    <DatePicker
      selected={date}
      onSelect={handleSelect}
      placeholder={placeholder}
      className={className}
    />
  );
}
