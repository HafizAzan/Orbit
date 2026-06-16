import React, { useMemo } from "react";
import { CALENDAR_WEEKDAY_LABELS, type CalendarEvent } from "../../../data/workspace-calendar";
import { getEventsForIso, getWeekDays } from "../../../lib/calendar-utils";
import { cn } from "../../../lib/utils";
import CalendarEventPill from "./calendar-event-pill";

type CalendarWeekViewProps = {
  activeDate: Date;
  events: CalendarEvent[];
};

function CalendarWeekView({ activeDate, events }: CalendarWeekViewProps) {
  const days = useMemo(() => getWeekDays(activeDate), [activeDate]);

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="hidden border-b border-border bg-background/60 sm:grid sm:grid-cols-7">
        {CALENDAR_WEEKDAY_LABELS.map((label) => (
          <div key={label} className="px-3 py-3 text-center text-xs font-semibold tracking-wide text-muted uppercase">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-7 sm:divide-x sm:divide-y-0">
        {days.map((day) => {
          const dayEvents = getEventsForIso(events, day.iso);

          return (
            <div
              key={day.iso}
              className={cn(
                "min-h-[180px] p-3 sm:min-h-[320px]",
                day.isToday && "bg-feature-sync/40 ring-2 ring-inset ring-primary/20",
              )}
            >
              <div className="mb-3 flex items-center gap-2 sm:flex-col sm:items-start">
                <span className="text-xs font-semibold tracking-wide text-muted uppercase sm:hidden">
                  {new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(day.date)}
                </span>
                <span
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                    day.isToday ? "bg-primary text-white" : "text-foreground",
                  )}
                >
                  {day.day}
                </span>
              </div>

              <div className="space-y-2">
                {dayEvents.length > 0 ? (
                  dayEvents.map((event) => <CalendarEventPill key={event.id} event={event} />)
                ) : (
                  <p className="text-xs text-muted">No events</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

export default React.memo(CalendarWeekView);
