import { DeleteOutlined } from "@ant-design/icons";
import React, { useCallback, useMemo, useState } from "react";
import CalendarDayView from "../../component/workspace/calendar/calendar-day-view";
import CalendarEventModal, {
  type CalendarEventFormValues,
} from "../../component/workspace/calendar/calendar-event-modal";
import CalendarMonthGrid from "../../component/workspace/calendar/calendar-month-grid";
import CalendarPageHeader, {
  type CalendarEventStats,
} from "../../component/workspace/calendar/calendar-page-header";
import CalendarSidebar from "../../component/workspace/calendar/calendar-sidebar";
import CalendarWeekView from "../../component/workspace/calendar/calendar-week-view";
import QueryPageGuard from "../../component/common/query-page-guard";
import { ConfirmModal } from "../../component/ui/modal";
import { CalendarPageSkeleton } from "../../component/skeletons";
import { useAppContext } from "../../context/app-context";
import {
  DEFAULT_CALENDAR_FILTERS,
  type CalendarEvent,
  type CalendarFilters,
  type CalendarViewMode,
} from "../../data/workspace-calendar";
import {
  useCalendarEvents,
  useCalendarProjects,
  useCreateCalendarEvent,
  useDeleteCalendarEvent,
  useUpdateCalendarEvent,
} from "../../hooks/use-workspace-calendar";
import { showApiErrorToast, showApiSuccessToast } from "../../lib/api-error";
import {
  countEventsInMonth,
  filterCalendarEvents,
  formatCalendarIsoDate,
  getCalendarRange,
  getEventsForIso,
  getWeekDays,
  shiftCalendarDate,
} from "../../lib/calendar-utils";
import { Text } from "../../component/ui/typography";
import { mapApiCalendarEvent } from "../../types/calendar.types";

function buildEventStats(events: ReturnType<typeof filterCalendarEvents>): CalendarEventStats {
  return {
    task: events.filter((event) => event.type === "task").length,
    team: events.filter((event) => event.type === "team").length,
    deadline: events.filter((event) => event.type === "deadline").length,
  };
}

function toEventFormValues(event: CalendarEvent): CalendarEventFormValues {
  return {
    title: event.title,
    date: event.date,
    type: event.type === "task" ? "team" : event.type,
    projectId: event.projectId,
    description: event.description ?? "",
  };
}

function WorkspaceCalendar() {
  const app = useAppContext();
  const isMember = app?.user?.role === "member";
  const currentUserId = app?.user?.id;

  const [activeDate, setActiveDate] = useState(() => new Date());
  const [view, setView] = useState<CalendarViewMode>("month");
  const [filters, setFilters] = useState<CalendarFilters>(DEFAULT_CALENDAR_FILTERS);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<CalendarEvent | null>(null);

  const range = useMemo(() => getCalendarRange(activeDate, view), [activeDate, view]);
  const eventsQuery = useCalendarEvents(range);
  const projectsQuery = useCalendarProjects();
  const { mutateAsync: createEvent, isPending: isCreatingEvent } = useCreateCalendarEvent();
  const { mutateAsync: updateEvent, isPending: isUpdatingEvent } = useUpdateCalendarEvent();
  const { mutateAsync: deleteEvent, isPending: isDeletingEvent } = useDeleteCalendarEvent();

  const filteredEvents = useMemo(() => {
    const events = (eventsQuery.data ?? []).map(mapApiCalendarEvent);
    return filterCalendarEvents(events, filters);
  }, [eventsQuery.data, filters]);

  const eventStats = useMemo(() => buildEventStats(filteredEvents), [filteredEvents]);
  const assignedProjects = projectsQuery.data ?? [];

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

  const eventCountLabel = view === "month" ? "this month" : view === "week" ? "this week" : "today";

  const eventInteractionProps = useMemo(() => {
    if (isMember) {
      return { currentUserId };
    }

    return {
      currentUserId,
      onEditEvent: (event: CalendarEvent) => {
        setEditingEvent(event);
        setEventModalOpen(true);
      },
      onDeleteEvent: (event: CalendarEvent) => {
        setDeletingEvent(event);
      },
    };
  }, [currentUserId, isMember]);

  const handleNavigate = useCallback(
    (direction: -1 | 1) => {
      setActiveDate((current) => shiftCalendarDate(current, view, direction));
    },
    [view],
  );

  const handleToday = useCallback(() => {
    setActiveDate(new Date());
  }, []);

  const handleSelectDate = useCallback((date: Date) => {
    setActiveDate(date);
    setView("day");
  }, []);

  const handleOpenCreateModal = useCallback(() => {
    setEditingEvent(null);
    setEventModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setEventModalOpen(false);
    setEditingEvent(null);
  }, []);

  const handleSubmitEvent = useCallback(
    async (values: CalendarEventFormValues) => {
      if (editingEvent) {
        await updateEvent({
          eventId: editingEvent.id,
          data: {
            title: values.title,
            date: values.date,
            type: values.type,
            projectId: values.projectId ?? null,
            description: values.description,
          },
        });
        return;
      }

      await createEvent(values);
    },
    [createEvent, editingEvent, updateEvent],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingEvent) return;

    try {
      const result = await deleteEvent(deletingEvent.id);
      showApiSuccessToast(result.message ?? "Event deleted.");
      setDeletingEvent(null);
    } catch (error) {
      showApiErrorToast(error);
    }
  }, [deleteEvent, deletingEvent]);

  const calendarView = useMemo(() => {
    if (view === "week") {
      return <CalendarWeekView activeDate={activeDate} events={filteredEvents} {...eventInteractionProps} />;
    }

    if (view === "day") {
      return <CalendarDayView activeDate={activeDate} events={filteredEvents} {...eventInteractionProps} />;
    }

    return (
      <CalendarMonthGrid
        activeDate={activeDate}
        events={filteredEvents}
        onSelectDate={handleSelectDate}
        {...eventInteractionProps}
      />
    );
  }, [activeDate, eventInteractionProps, filteredEvents, handleSelectDate, view]);

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
          eventStats={eventStats}
          readOnly={isMember}
          assignedProjectCount={assignedProjects.length}
          onViewChange={setView}
          onNavigate={handleNavigate}
          onToday={handleToday}
          onNewEvent={isMember ? undefined : handleOpenCreateModal}
        />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <CalendarSidebar
            filters={filters}
            onFiltersChange={setFilters}
            projects={assignedProjects}
            projectsLoading={projectsQuery.isLoading}
            eventStats={eventStats}
            readOnly={isMember}
          />
          {calendarView}
        </div>

        {!isMember ? (
          <>
            <CalendarEventModal
              open={eventModalOpen}
              mode={editingEvent ? "edit" : "create"}
              defaultDate={formatCalendarIsoDate(activeDate)}
              initialValues={editingEvent ? toEventFormValues(editingEvent) : undefined}
              onClose={handleCloseModal}
              onSubmit={handleSubmitEvent}
              submitting={isCreatingEvent || isUpdatingEvent}
            />

            <ConfirmModal
              open={deletingEvent !== null}
              onClose={() => setDeletingEvent(null)}
              onConfirm={handleConfirmDelete}
              title="Delete event"
              description={
                deletingEvent ? (
                  <>
                    Delete <Text as="span" weight="semibold">{deletingEvent.title}</Text> from the calendar? This cannot be
                    undone.
                  </>
                ) : null
              }
              confirmText="Delete event"
              confirmDanger
              confirmLoading={isDeletingEvent}
              icon={<DeleteOutlined />}
            />
          </>
        ) : null}
      </div>
    </QueryPageGuard>
  );
}

export default React.memo(WorkspaceCalendar);
