import React from "react";
import { CALENDAR_EVENT_STYLES, type CalendarEvent } from "../../../data/workspace-calendar";
import { cn } from "../../../lib/utils";

type CalendarEventPillProps = {
  event: CalendarEvent;
  compact?: boolean;
};

function CalendarEventPill({ event, compact = false }: CalendarEventPillProps) {
  const styles = CALENDAR_EVENT_STYLES[event.type];

  return (
    <div
      title={event.title}
      className={cn(
        "truncate rounded-md border-l-[3px] px-2 py-1 text-xs font-medium",
        styles.bg,
        styles.accent,
        styles.text,
        compact ? "py-0.5" : "py-1",
      )}
    >
      {event.title}
    </div>
  );
}

export default React.memo(CalendarEventPill);
