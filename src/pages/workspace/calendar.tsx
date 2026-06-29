import React, { useCallback, useMemo, useState } from "react";
import CalendarDayView from "../../component/workspace/calendar/calendar-day-view";
import CalendarEventModal, {
  type CalendarEventFormValues,
} from "../../component/workspace/calendar/calendar-event-modal";
import CalendarMonthGrid from "../../component/workspace/calendar/calendar-month-grid";
import CalendarPageHeader from "../../component/workspace/calendar/calendar-page-header";
import CalendarSidebar from "../../component/workspace/calendar/calendar-sidebar";
import CalendarWeekView from "../../component/workspace/calendar/calendar-week-view";
import QueryPageGuard from "../../component/common/query-page-guard";
import { CalendarPageSkeleton } from "../../component/skeletons";
import {
  DEFAULT_CALENDAR_FILTERS,
  type CalendarFilters,
  type CalendarViewMode,
} from "../../data/workspace-calendar";
import {
  useCalendarEvents,
  useCalendarProjects,
  useCreateCalendarEvent,
} from "../../hooks/use-workspace-calendar";
import {
  countEventsInMonth,
  filterCalendarEvents,
  formatCalendarIsoDate,
  getCalendarRange,
  getEventsForIso,
  getWeekDays,
  shiftCalendarDate,
} from "../../lib/calendar-utils";
import { mapApiCalendarEvent } from "../../types/calendar.types";

function WorkspaceCalendar() {
  const [activeDate, setActiveDate] = useState(() => new Date());
  const [view, setView] = useState<CalendarViewMode>("month");
  const [filters, setFilters] = useState<CalendarFilters>(DEFAULT_CALENDAR_FILTERS);
  const [eventModalOpen, setEventModalOpen] = useState(false);

  const range = useMemo(() => getCalendarRange(activeDate, view), [activeDate, view]);
  const eventsQuery = useCalendarEvents(range);
  const projectsQuery = useCalendarProjects();
  const { mutateAsync: createEvent, isPending: isCreatingEvent } = useCreateCalendarEvent();

  const filteredEvents = useMemo(() => {
    const events = (eventsQuery.data ?? []).map(mapApiCalendarEvent);
    return filterCalendarEvents(events, filters);
  }, [eventsQuery.data, filters]);

  const eventCount = useMemo(() => {
    if (view === "month") {
      return countEventsInMonth(filteredEvents, activeDate.getFullYear(), activeDate.getMonth());
    }

    if (view === "week") {
      const weekDays = getWeekDays(activeDate);
      return weekDays.reduce((total, day) => total + getEventsForIso(filteredEvents, day.iso).length, 0);
    }

    return getEventsForIso(filteredEvents, formatCalendarIsoDate(activeDate)).length;
  }, [activeDate, filteredEvents, view]);

  const eventCountLabel = view === "month" ? "for this month" : view === "week" ? "this week" : "today";

  const handleNavigate = useCallback(
    (direction: -1 | 1) => {
      setActiveDate((current) => shiftCalendarDate(current, view, direction));
    },
    [view],
  );

  const handleToday = useCallback(() => {
    setActiveDate(new Date());
  }, []);

  const handleCreateEvent = useCallback(
    async (values: CalendarEventFormValues) => {
      await createEvent(values);
    },
    [createEvent],
  );

  const calendarView = useMemo(() => {
    if (view === "week") {
      return <CalendarWeekView activeDate={activeDate} events={filteredEvents} />;
    }

    if (view === "day") {
      return <CalendarDayView activeDate={activeDate} events={filteredEvents} />;
    }

    return <CalendarMonthGrid activeDate={activeDate} events={filteredEvents} />;
  }, [activeDate, filteredEvents, view]);

  return (
    <QueryPageGuard
      query={eventsQuery}
      loading={<CalendarPageSkeleton />}
      errorTitle="Unable to load calendar"
    >
      <div className="mx-auto max-w-8xl">
        <CalendarPageHeader
          activeDate={activeDate}
          view={view}
          eventCount={eventCount}
          eventCountLabel={eventCountLabel}
          onViewChange={setView}
          onNavigate={handleNavigate}
          onToday={handleToday}
          onNewEvent={() => setEventModalOpen(true)}
        />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <CalendarSidebar
            filters={filters}
            onFiltersChange={setFilters}
            projects={projectsQuery.data ?? []}
            projectsLoading={projectsQuery.isLoading}
          />
          {calendarView}
        </div>

        <CalendarEventModal
          open={eventModalOpen}
          defaultDate={formatCalendarIsoDate(activeDate)}
          onClose={() => setEventModalOpen(false)}
          onSubmit={handleCreateEvent}
          submitting={isCreatingEvent}
        />
      </div>
    </QueryPageGuard>
  );
}

export default React.memo(WorkspaceCalendar);
