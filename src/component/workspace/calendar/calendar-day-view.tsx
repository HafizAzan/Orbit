import React, { useMemo } from "react";
import type { CalendarEvent } from "../../../data/workspace-calendar";
import { getEventsForIso } from "../../../lib/calendar-utils";
import CalendarEventPill from "./calendar-event-pill";

type CalendarDayViewProps = {
  activeDate: Date;
  events: CalendarEvent[];
};

function CalendarDayView({ activeDate, events }: CalendarDayViewProps) {
  const iso = useMemo(() => {
    const year = activeDate.getFullYear();
    const month = String(activeDate.getMonth() + 1).padStart(2, "0");
    const day = String(activeDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, [activeDate]);

  const dayEvents = getEventsForIso(events, iso);

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <p className="text-sm font-medium text-muted">
        {new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(activeDate)}
      </p>

      {dayEvents.length > 0 ? (
        <ul className="mt-5 space-y-3">
          {dayEvents.map((event) => (
            <li key={event.id}>
              <CalendarEventPill event={event} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-background/50 p-10 text-center">
          <p className="text-sm font-medium text-muted">No events scheduled for this day.</p>
        </div>
      )}
    </article>
  );
}

export default React.memo(CalendarDayView);
