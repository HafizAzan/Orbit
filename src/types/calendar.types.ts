import type { CalendarEvent, CalendarEventType } from "../data/workspace-calendar";

export type ApiCalendarEvent = CalendarEvent & {
  source: "event" | "task" | "project";
};

export type ApiCalendarProjectSummary = {
  id: string;
  name: string;
  dotClass: string;
  eventCount: number;
};

export type CreateCalendarEventRequest = {
  title: string;
  date: string;
  type: Exclude<CalendarEventType, "task">;
  projectId?: string;
  description?: string;
};

export type UpdateCalendarEventRequest = {
  title?: string;
  date?: string;
  type?: Exclude<CalendarEventType, "task">;
  projectId?: string | null;
  description?: string;
};

export type ListCalendarEventsParams = {
  from: string;
  to: string;
  page?: number;
  limit?: number;
};

export function mapApiCalendarEvent(event: ApiCalendarEvent): CalendarEvent {
  return {
    id: event.id,
    title: event.title,
    date: event.date,
    type: event.type,
    projectId: event.projectId,
    description: event.description,
    source: event.source,
    createdById: event.createdById,
  };
}
