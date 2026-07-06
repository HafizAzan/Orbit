import React, { useMemo } from "react";
import { CALENDAR_WEEKDAY_LABELS, type CalendarEvent } from "../../../data/workspace-calendar";
import { getEventsForIso, getMonthGrid, type CalendarDayCell } from "../../../lib/calendar-utils";
import { cn } from "../../../lib/utils";
import CalendarEventPill from "./calendar-event-pill";
import type { CalendarEventInteractionProps } from "./calendar-event-interaction";
import { Text } from "../../ui/typography";

type CalendarMonthGridProps = CalendarEventInteractionProps & {
  activeDate: Date;
  events: CalendarEvent[];
  onSelectDate?: (date: Date) => void;
};

const MAX_VISIBLE_EVENTS = 2;

function CalendarMonthGrid({ activeDate, events, onSelectDate, currentUserId, onEditEvent, onDeleteEvent }: CalendarMonthGridProps) {
  const year = activeDate.getFullYear();
  const month = activeDate.getMonth();
  const cells = useMemo(() => getMonthGrid(year, month), [year, month]);

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="grid grid-cols-7 border-b border-border bg-background/80">
        {CALENDAR_WEEKDAY_LABELS.map((label) => (
          <div key={label} className="px-2 py-3 text-center text-[11px] font-semibold tracking-wide text-muted uppercase sm:px-3 sm:text-xs">
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label.charAt(0)}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((cell) => (
          <CalendarMonthCell
            key={cell.iso}
            cell={cell}
            events={getEventsForIso(events, cell.iso)}
            onSelectDate={onSelectDate}
            currentUserId={currentUserId}
            onEditEvent={onEditEvent}
            onDeleteEvent={onDeleteEvent}
          />
        ))}
      </div>
    </article>
  );
}

type CalendarMonthCellProps = CalendarEventInteractionProps & {
  cell: CalendarDayCell;
  events: CalendarEvent[];
  onSelectDate?: (date: Date) => void;
};

function CalendarMonthCell({ cell, events, onSelectDate, currentUserId, onEditEvent, onDeleteEvent }: CalendarMonthCellProps) {
  const hiddenCount = Math.max(events.length - MAX_VISIBLE_EVENTS, 0);
  const visibleEvents = events.slice(0, MAX_VISIBLE_EVENTS);
  const isInteractive = Boolean(onSelectDate);

  return (
    <div
      className={cn(
        "min-h-[96px] border-r border-b border-border p-1.5 sm:min-h-[124px] sm:p-2",
        "[&:nth-child(7n)]:border-r-0",
        !cell.isCurrentMonth && "bg-background/50",
        cell.isToday && "bg-primary/5 ring-1 ring-inset ring-primary/25",
        isInteractive && "cursor-pointer transition-colors hover:bg-background/80",
      )}
      onClick={isInteractive ? () => onSelectDate?.(cell.date) : undefined}
      onKeyDown={
        isInteractive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelectDate?.(cell.date);
              }
            }
          : undefined
      }
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      <div className="flex items-center justify-between gap-1">
        <span
          className={cn(
            "inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold sm:h-8 sm:w-8 sm:text-sm",
            cell.isToday ? "bg-primary text-white" : cell.isCurrentMonth ? "text-foreground" : "text-muted",
          )}
        >
          {cell.day}
        </span>
        {events.length > 0 ? (
          <span className="rounded-full bg-background px-1.5 py-0.5 text-[10px] font-semibold text-muted tabular-nums">{events.length}</span>
        ) : null}
      </div>

      <div className="mt-1.5 space-y-1" onClick={(event) => event.stopPropagation()}>
        {visibleEvents.map((event) => (
          <CalendarEventPill
            key={event.id}
            event={event}
            compact
            currentUserId={currentUserId}
            onEditEvent={onEditEvent}
            onDeleteEvent={onDeleteEvent}
          />
        ))}
        {hiddenCount > 0 ? (
          <Text as="p" size="xs" weight="medium" color="muted" className="px-1 text-[10px]! sm:text-xs!">
            +{hiddenCount} more
          </Text>
        ) : null}
      </div>
    </div>
  );
}

export default React.memo(CalendarMonthGrid);
