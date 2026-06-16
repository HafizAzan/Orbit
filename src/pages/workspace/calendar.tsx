import React, { useCallback, useMemo, useState } from "react";
import CalendarDayView from "../../component/workspace/calendar/calendar-day-view";
import CalendarMonthGrid from "../../component/workspace/calendar/calendar-month-grid";
import CalendarPageHeader from "../../component/workspace/calendar/calendar-page-header";
import CalendarSidebar from "../../component/workspace/calendar/calendar-sidebar";
import CalendarWeekView from "../../component/workspace/calendar/calendar-week-view";
import {
  CALENDAR_EVENTS,
  DEFAULT_CALENDAR_FILTERS,
  type CalendarFilters,
  type CalendarViewMode,
} from "../../data/workspace-calendar";
import {
  countEventsInMonth,
  filterCalendarEvents,
  getEventsForIso,
  getWeekDays,
  shiftCalendarDate,
} from "../../lib/calendar-utils";
import { toast } from "../../lib/toast";

function WorkspaceCalendar() {
  const [activeDate, setActiveDate] = useState(() => new Date(2024, 9, 1));
  const [view, setView] = useState<CalendarViewMode>("month");
  const [filters, setFilters] = useState<CalendarFilters>(DEFAULT_CALENDAR_FILTERS);

  const filteredEvents = useMemo(
    () => filterCalendarEvents(CALENDAR_EVENTS, filters),
    [filters],
  );

  const eventCount = useMemo(() => {
    if (view === "month") {
      return countEventsInMonth(filteredEvents, activeDate.getFullYear(), activeDate.getMonth());
    }

    if (view === "week") {
      const weekDays = getWeekDays(activeDate);
      return weekDays.reduce((total, day) => total + getEventsForIso(filteredEvents, day.iso).length, 0);
    }

    const iso = `${activeDate.getFullYear()}-${String(activeDate.getMonth() + 1).padStart(2, "0")}-${String(activeDate.getDate()).padStart(2, "0")}`;
    return getEventsForIso(filteredEvents, iso).length;
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

  const handleNewEvent = useCallback(() => {
    toast.info("New event — coming soon");
  }, []);

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
    <div className="mx-auto max-w-8xl">
      <CalendarPageHeader
        activeDate={activeDate}
        view={view}
        eventCount={eventCount}
        eventCountLabel={eventCountLabel}
        onViewChange={setView}
        onNavigate={handleNavigate}
        onToday={handleToday}
        onNewEvent={handleNewEvent}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <CalendarSidebar filters={filters} onFiltersChange={setFilters} />
        {calendarView}
      </div>
    </div>
  );
}

export default React.memo(WorkspaceCalendar);
