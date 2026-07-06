import React, { useMemo } from "react";
import { CALENDAR_WEEKDAY_LABELS, type CalendarEvent } from "../../../data/workspace-calendar";
import { getEventsForIso, getWeekDays } from "../../../lib/calendar-utils";
import { cn } from "../../../lib/utils";
import CalendarEventPill from "./calendar-event-pill";
import type { CalendarEventInteractionProps } from "./calendar-event-interaction";
import { Paragraph, Text } from "../../ui/typography";

type CalendarWeekViewProps = CalendarEventInteractionProps & {
  activeDate: Date;
  events: CalendarEvent[];
};

function CalendarWeekView({
  activeDate,
  events,
  currentUserId,
  onEditEvent,
  onDeleteEvent,
}: CalendarWeekViewProps) {
  const days = useMemo(() => getWeekDays(activeDate), [activeDate]);

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="hidden border-b border-border bg-background/80 sm:grid sm:grid-cols-7">
        {CALENDAR_WEEKDAY_LABELS.map((label, index) => {
          const day = days[index];

          return (
            <div
              key={label}
              className={cn(
                "border-r border-border px-3 py-3 text-center last:border-r-0",
                day?.isToday && "bg-primary/5",
              )}
            >
              <Text as="p" size="xs" weight="semibold" color="muted" className="tracking-wide uppercase">
                {label}
              </Text>
              <Text
                as="p"
                weight="bold"
                className={cn("mt-1 text-lg tabular-nums", day?.isToday ? "text-primary" : "text-foreground")}
              >
                {day?.day}
              </Text>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-7 sm:divide-x sm:divide-y-0">
        {days.map((day) => {
          const dayEvents = getEventsForIso(events, day.iso);

          return (
            <div
              key={day.iso}
              className={cn(
                "min-h-[200px] p-3 sm:min-h-[340px] sm:p-4",
                day.isToday && "bg-primary/5 ring-1 ring-inset ring-primary/20",
              )}
            >
              <div className="mb-3 flex items-center justify-between gap-2 sm:hidden">
                <div className="flex items-center gap-2">
                  <Text as="span" size="xs" weight="semibold" color="muted" className="tracking-wide uppercase">
                    {new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(day.date)}
                  </Text>
                  <span
                    className={cn(
                      "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                      day.isToday ? "bg-primary text-white" : "bg-background text-foreground",
                    )}
                  >
                    {day.day}
                  </span>
                </div>
                {dayEvents.length > 0 ? (
                  <Text as="span" size="xs" weight="semibold" color="muted">
                    {dayEvents.length}
                  </Text>
                ) : null}
              </div>

              <div className="space-y-2">
                {dayEvents.length > 0 ? (
                  dayEvents.map((event) => (
                    <CalendarEventPill
                      key={event.id}
                      event={event}
                      currentUserId={currentUserId}
                      onEditEvent={onEditEvent}
                      onDeleteEvent={onDeleteEvent}
                    />
                  ))
                ) : (
                  <div className="flex h-full min-h-[120px] items-center justify-center rounded-xl border border-dashed border-border bg-background/40 px-3 py-6 text-center sm:min-h-[240px]">
                    <Paragraph size="xs" className="text-muted">
                      Nothing scheduled
                    </Paragraph>
                  </div>
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
