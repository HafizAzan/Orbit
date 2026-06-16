export type CalendarViewMode = "month" | "week" | "day";

export type CalendarEventType = "task" | "team" | "deadline";

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  type: CalendarEventType;
  projectId?: string;
};

export type CalendarProject = {
  id: string;
  name: string;
  dotClass: string;
  eventCount: number;
};

export type CalendarFilters = {
  myTasks: boolean;
  teamEvents: boolean;
  deadlinesOnly: boolean;
};

export const DEFAULT_CALENDAR_FILTERS: CalendarFilters = {
  myTasks: true,
  teamEvents: true,
  deadlinesOnly: false,
};

export const CALENDAR_VIEW_OPTIONS: { value: CalendarViewMode; label: string }[] = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
  { value: "day", label: "Day" },
];

export const CALENDAR_WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export const CALENDAR_EVENT_STYLES: Record<CalendarEventType, { bg: string; accent: string; text: string }> = {
  task: {
    bg: "bg-violet-50",
    accent: "border-l-violet-500",
    text: "text-violet-700",
  },
  team: {
    bg: "bg-sky-50",
    accent: "border-l-sky-500",
    text: "text-sky-700",
  },
  deadline: {
    bg: "bg-red-50",
    accent: "border-l-red-500",
    text: "text-red-700",
  },
};

export const CALENDAR_FILTER_OPTIONS: {
  key: keyof CalendarFilters;
  label: string;
  colorClass: string;
}[] = [
  { key: "myTasks", label: "My Tasks", colorClass: "text-primary" },
  { key: "teamEvents", label: "Team Events", colorClass: "text-teal-600" },
  { key: "deadlinesOnly", label: "Deadlines Only", colorClass: "text-red-600" },
];

export const CALENDAR_PROJECTS: CalendarProject[] = [
  { id: "alpha-phoenix", name: "Alpha Phoenix", dotClass: "bg-sky-500", eventCount: 4 },
  { id: "nexus-core", name: "Nexus Core", dotClass: "bg-teal-500", eventCount: 2 },
  { id: "orion-ui", name: "Orion UI", dotClass: "bg-violet-500", eventCount: 3 },
  { id: "pulse-api", name: "Pulse API", dotClass: "bg-amber-500", eventCount: 1 },
];

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: "e1", title: "Weekly Standup", date: "2024-10-01", type: "team", projectId: "alpha-phoenix" },
  { id: "e2", title: "API Deadline", date: "2024-10-02", type: "deadline", projectId: "pulse-api" },
  { id: "e3", title: "Design Sync", date: "2024-10-03", type: "task", projectId: "orion-ui" },
  { id: "e4", title: "Weekly Standup", date: "2024-10-07", type: "team", projectId: "alpha-phoenix" },
  { id: "e5", title: "Client Demo", date: "2024-10-09", type: "team", projectId: "nexus-core" },
  { id: "e6", title: "Weekly Standup", date: "2024-10-14", type: "team", projectId: "alpha-phoenix" },
  { id: "e7", title: "Project Review", date: "2024-10-16", type: "task", projectId: "orion-ui" },
  { id: "e8", title: "Release Cutoff", date: "2024-10-18", type: "deadline", projectId: "pulse-api" },
  { id: "e9", title: "Weekly Standup", date: "2024-10-21", type: "team", projectId: "alpha-phoenix" },
  { id: "e10", title: "Team Offsite", date: "2024-10-23", type: "team", projectId: "nexus-core" },
  { id: "e11", title: "Weekly Standup", date: "2024-10-28", type: "team", projectId: "alpha-phoenix" },
  { id: "e12", title: "Sprint Close", date: "2024-10-31", type: "deadline", projectId: "orion-ui" },
  { id: "e13", title: "Sprint Planning", date: "2024-11-04", type: "team", projectId: "alpha-phoenix" },
  { id: "e14", title: "UX Review", date: "2024-11-12", type: "task", projectId: "orion-ui" },
  { id: "e15", title: "Weekly Standup", date: "2025-06-02", type: "team", projectId: "alpha-phoenix" },
  { id: "e16", title: "Board Grooming", date: "2025-06-10", type: "task", projectId: "nexus-core" },
  { id: "e17", title: "Deploy Window", date: "2025-06-16", type: "deadline", projectId: "pulse-api" },
  { id: "e18", title: "Stakeholder Sync", date: "2025-06-20", type: "team", projectId: "orion-ui" },
];
