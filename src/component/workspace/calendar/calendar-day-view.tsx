import React, { useMemo } from "react";
import {
  CALENDAR_EVENT_TYPE_META,
  type CalendarEvent,
  type CalendarEventType,
} from "../../../data/workspace-calendar";
import { getEventsForIso } from "../../../lib/calendar-utils";
import { cn } from "../../../lib/utils";
import CalendarEventPill from "./calendar-event-pill";
import type { CalendarEventInteractionProps } from "./calendar-event-interaction";
import { Paragraph, Text, Title } from "../../ui/typography";

type CalendarDayViewProps = CalendarEventInteractionProps & {
  activeDate: Date;
  events: CalendarEvent[];
};

const DAY_SECTION_ORDER: CalendarEventType[] = ["deadline", "task", "team"];

function CalendarDayView({
  activeDate,
  events,
  currentUserId,
  onEditEvent,
  onDeleteEvent,
}: CalendarDayViewProps) {
  const iso = useMemo(() => {
    const year = activeDate.getFullYear();
    const month = String(activeDate.getMonth() + 1).padStart(2, "0");
    const day = String(activeDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, [activeDate]);

  const dayEvents = getEventsForIso(events, iso);

  const groupedEvents = useMemo(() => {
    return DAY_SECTION_ORDER.map((type) => ({
      type,
      events: dayEvents.filter((event) => event.type === type),
    })).filter((group) => group.events.length > 0);
  }, [dayEvents]);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(activeDate);

  return (
    <article className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4 sm:px-6">
        <Text as="p" size="xs" weight="bold" color="muted" className="tracking-wide uppercase">
          Day view
        </Text>
        <Title level={4} className="mt-1 text-foreground">
          {formattedDate}
        </Title>
        <Paragraph size="sm" className="mt-1">
          {dayEvents.length === 0
            ? "No items scheduled for this day."
            : `${dayEvents.length} ${dayEvents.length === 1 ? "item" : "items"} scheduled.`}
        </Paragraph>
      </div>

      {groupedEvents.length > 0 ? (
        <div className="space-y-5 p-5 sm:p-6">
          {groupedEvents.map((group) => {
            const meta = CALENDAR_EVENT_TYPE_META[group.type];

            return (
              <section key={group.type}>
                <div className="mb-3 flex items-center gap-2">
                  <span className={cn("h-2.5 w-2.5 rounded-full", meta.dotClass)} />
                  <Text as="span" size="sm" weight="semibold">
                    {meta.shortLabel}
                  </Text>
                  <Text as="span" size="xs" color="muted">
                    ({group.events.length})
                  </Text>
                </div>

                <ul className="space-y-2">
                  {group.events.map((event) => (
                    <li key={event.id}>
                      <CalendarEventPill
                        event={event}
                        currentUserId={currentUserId}
                        onEditEvent={onEditEvent}
                        onDeleteEvent={onDeleteEvent}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="mx-5 mb-5 mt-2 rounded-2xl border border-dashed border-border bg-background/50 p-10 text-center sm:mx-6 sm:mb-6">
          <Text as="p" size="sm" weight="medium" color="muted">
            Nothing on this day yet.
          </Text>
          <Paragraph size="sm" className="mx-auto mt-2 max-w-sm">
            Use New Event to schedule a team meeting, or add due dates on tasks and projects.
          </Paragraph>
        </div>
      )}
    </article>
  );
}

export default React.memo(CalendarDayView);
