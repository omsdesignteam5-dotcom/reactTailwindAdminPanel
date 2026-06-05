//Utils
import { cn } from "src/utils/utils";

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
] as const;
const WEEKDAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;

export interface TimetableSlot {
  id: string;
  subject: string;
  teacher?: string;
  room?: string;
  color?: string;
}

interface TimeSlot {
  label: string;
  startTime: string;
  endTime: string;
}

interface TimetableGridProps {
  timeSlots: TimeSlot[];
  data: Record<string, Record<string, TimetableSlot | null>>;
  onSlotClick?: (
    day: string,
    timeSlot: TimeSlot,
    slot: TimetableSlot | null,
  ) => void;
  className?: string;
}

const defaultColors: Record<string, string> = {
  blue: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-200",
  green:
    "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-200",
  purple:
    "bg-purple-50 border-purple-200 text-purple-900 dark:bg-purple-950/50 dark:border-purple-800 dark:text-purple-200",
  orange:
    "bg-orange-50 border-orange-200 text-orange-900 dark:bg-orange-950/50 dark:border-orange-800 dark:text-orange-200",
  pink: "bg-pink-50 border-pink-200 text-pink-900 dark:bg-pink-950/50 dark:border-pink-800 dark:text-pink-200",
  cyan: "bg-cyan-50 border-cyan-200 text-cyan-900 dark:bg-cyan-950/50 dark:border-cyan-800 dark:text-cyan-200",
  amber:
    "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-200",
};

function getColorClass(color?: string): string {
  if (!color) return defaultColors.blue;
  return defaultColors[color] || defaultColors.blue;
}

export function TimetableGrid({
  timeSlots,
  data,
  onSlotClick,
  className,
}: TimetableGridProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <div className="min-w-[640px]">
        {/* Grid header */}
        <div className="grid grid-cols-6 gap-px rounded-t-lg bg-border">
          {/* Time column header */}
          <div className="rounded-tl-lg bg-muted px-3 py-3">
            <span className="text-xs font-medium text-muted-foreground">
              Time
            </span>
          </div>
          {/* Day headers */}
          {WEEKDAYS.map((day, i) => (
            <div
              key={day}
              className={cn(
                "bg-muted px-3 py-3 text-center",
                i === WEEKDAYS.length - 1 && "rounded-tr-lg",
              )}>
              <span className="hidden text-sm font-semibold text-foreground sm:inline">
                {day}
              </span>
              <span className="text-sm font-semibold text-foreground sm:hidden">
                {WEEKDAYS_SHORT[i]}
              </span>
            </div>
          ))}
        </div>

        {/* Grid body */}
        <div className="grid grid-cols-6 gap-px rounded-b-lg bg-border">
          {timeSlots.map((timeSlot, rowIndex) => (
            <>
              {/* Time label */}
              <div
                key={`time-${timeSlot.label}`}
                className={cn(
                  "flex flex-col justify-center bg-card px-3 py-3",
                  rowIndex === timeSlots.length - 1 && "rounded-bl-lg",
                )}>
                <span className="text-xs font-medium text-foreground">
                  {timeSlot.startTime}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {timeSlot.endTime}
                </span>
              </div>

              {/* Day cells */}
              {WEEKDAYS.map((day, colIndex) => {
                const slot = data[day]?.[timeSlot.label] ?? null;
                const isLastRow = rowIndex === timeSlots.length - 1;
                const isLastCol = colIndex === WEEKDAYS.length - 1;

                return (
                  <div
                    key={`${day}-${timeSlot.label}`}
                    onClick={() => onSlotClick?.(day, timeSlot, slot)}
                    className={cn(
                      "min-h-[72px] bg-card p-1.5 transition-colors",
                      onSlotClick && "cursor-pointer hover:bg-muted/50",
                      isLastRow && isLastCol && "rounded-br-lg",
                    )}>
                    {slot && (
                      <div
                        className={cn(
                          "flex h-full flex-col justify-center rounded-md border p-2",
                          getColorClass(slot.color),
                        )}>
                        <span className="text-xs font-semibold leading-tight">
                          {slot.subject}
                        </span>
                        {slot.teacher && (
                          <span className="mt-0.5 text-[10px] opacity-80">
                            {slot.teacher}
                          </span>
                        )}
                        {slot.room && (
                          <span className="text-[10px] opacity-60">
                            {slot.room}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

export { WEEKDAYS, WEEKDAYS_SHORT };
export type { TimeSlot, TimetableGridProps };
