import ApiService from "../config/client";
import { assertApiSuccess } from "../lib/api-error";
import API_ROUTES from "../router/api-routes";
import type {
  ApiCalendarEvent,
  ApiCalendarProjectSummary,
  CreateCalendarEventRequest,
  ListCalendarEventsParams,
} from "../types/calendar.types";
import {
  buildPaginationSearchParams,
  normalizePaginatedResponse,
  type PaginationParams,
} from "../types/pagination.types";

const AUTH_REQUEST = { requireAuth: true } as const;

const listCalendarEvents = async (
  params: ListCalendarEventsParams,
): Promise<ApiCalendarEvent[]> => {
  const searchParams = buildPaginationSearchParams(params);
  searchParams.set("from", params.from);
  searchParams.set("to", params.to);

  const response = await ApiService.get(
    `${API_ROUTES.CALENDAR.EVENTS}?${searchParams.toString()}`,
    AUTH_REQUEST,
  );
  return normalizePaginatedResponse<ApiCalendarEvent>(assertApiSuccess<unknown>(response)).data;
};

const listCalendarProjects = async (
  params: PaginationParams = {},
): Promise<ApiCalendarProjectSummary[]> => {
  const searchParams = buildPaginationSearchParams(params);
  const response = await ApiService.get(
    `${API_ROUTES.CALENDAR.PROJECTS}?${searchParams.toString()}`,
    AUTH_REQUEST,
  );
  return normalizePaginatedResponse<ApiCalendarProjectSummary>(
    assertApiSuccess<unknown>(response),
  ).data;
};

const createCalendarEvent = async (
  data: CreateCalendarEventRequest,
): Promise<ApiCalendarEvent> => {
  const response = await ApiService.post(API_ROUTES.CALENDAR.EVENTS, data, AUTH_REQUEST);
  return assertApiSuccess<ApiCalendarEvent>(response);
};

const deleteCalendarEvent = async (eventId: string): Promise<{ message: string }> => {
  const response = await ApiService.delete(
    `${API_ROUTES.CALENDAR.EVENTS}/${eventId}`,
    AUTH_REQUEST,
  );
  return assertApiSuccess<{ message: string }>(response);
};

export {
  createCalendarEvent,
  deleteCalendarEvent,
  listCalendarEvents,
  listCalendarProjects,
};
