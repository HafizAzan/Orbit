import React, { useMemo } from "react";
import { CALENDAR_WEEKDAY_LABELS, type CalendarEvent } from "../../../data/workspace-calendar";
import { getEventsForIso, getMonthGrid, type CalendarDayCell } from "../../../lib/calendar-utils";
import { cn } from "../../../lib/utils";
import CalendarEventPill from "./calendar-event-pill";

type CalendarMonthGridProps = {
  activeDate: Date;
  events: CalendarEvent[];
};

const MAX_VISIBLE_EVENTS = 3;

function CalendarMonthGrid({ activeDate, events }: CalendarMonthGridProps) {
  const year = activeDate.getFullYear();
  const month = activeDate.getMonth();
  const cells = useMemo(() => getMonthGrid(year, month), [year, month]);

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="grid grid-cols-7 border-b border-border bg-background/60">
        {CALENDAR_WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="px-2 py-3 text-center text-xs font-semibold tracking-wide text-muted uppercase sm:px-3"
          >
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label.charAt(0)}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((cell) => (
          <CalendarMonthCell key={cell.iso} cell={cell} events={getEventsForIso(events, cell.iso)} />
        ))}
      </div>
    </article>
  );
}

type CalendarMonthCellProps = {
  cell: CalendarDayCell;
  events: CalendarEvent[];
};

function CalendarMonthCell({ cell, events }: CalendarMonthCellProps) {
  const hiddenCount = Math.max(events.length - MAX_VISIBLE_EVENTS, 0);
  const visibleEvents = events.slice(0, MAX_VISIBLE_EVENTS);

  return (
    <div
      className={cn(
        "min-h-[88px] border-r border-b border-border p-1.5 sm:min-h-[112px] sm:p-2",
        "[&:nth-child(7n)]:border-r-0",
        !cell.isCurrentMonth && "bg-background/40",
        cell.isToday && "ring-2 ring-inset ring-primary/30",
      )}
    >
      <div className="flex items-start justify-between gap-1">
        <span
          className={cn(
            "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold sm:h-7 sm:w-7 sm:text-sm",
            cell.isToday
              ? "bg-primary text-white"
              : cell.isCurrentMonth
                ? "text-foreground"
                : "text-muted",
          )}
        >
          {cell.day}
        </span>
      </div>

      <div className="mt-1 space-y-1">
        {visibleEvents.map((event) => (
          <CalendarEventPill key={event.id} event={event} compact />
        ))}
        {hiddenCount > 0 ? (
          <p className="px-1 text-[10px] font-medium text-muted sm:text-xs">+{hiddenCount} more</p>
        ) : null}
      </div>
    </div>
  );
}

export default React.memo(CalendarMonthGrid);
