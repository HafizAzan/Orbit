import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCalendarEvent,
  deleteCalendarEvent,
  listCalendarEvents,
  listCalendarProjects,
} from "../api-services/calendar.service";
import type {
  CreateCalendarEventRequest,
  ListCalendarEventsParams,
} from "../types/calendar.types";

export const CALENDAR_EVENTS_QUERY_KEY = "workspace-calendar-events";
export const CALENDAR_PROJECTS_QUERY_KEY = "workspace-calendar-projects";

export function useCalendarEvents(params: ListCalendarEventsParams) {
  return useQuery({
    queryKey: [CALENDAR_EVENTS_QUERY_KEY, params.from, params.to],
    queryFn: () => listCalendarEvents(params),
    enabled: Boolean(params.from && params.to),
  });
}

export function useCalendarProjects() {
  return useQuery({
    queryKey: [CALENDAR_PROJECTS_QUERY_KEY],
    queryFn: () => listCalendarProjects(),
  });
}

export function useCreateCalendarEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCalendarEventRequest) => createCalendarEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CALENDAR_EVENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CALENDAR_PROJECTS_QUERY_KEY] });
    },
  });
}

export function useDeleteCalendarEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => deleteCalendarEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CALENDAR_EVENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CALENDAR_PROJECTS_QUERY_KEY] });
    },
  });
}
