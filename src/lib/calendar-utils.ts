import type { CalendarEvent, CalendarFilters } from "../data/workspace-calendar";

export type CalendarDayCell = {
  date: Date;
  iso: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
};

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatCalendarHeading(date: Date, view: "month" | "week" | "day") {
  if (view === "month") {
    return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(date);
  }

  if (view === "day") {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const startLabel = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(weekStart);
  const endLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(weekEnd);

  return `${startLabel} – ${endLabel}`;
}

export function getWeekStart(date: Date) {
  const start = startOfDay(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  return start;
}

export function getMonthGrid(year: number, month: number): CalendarDayCell[] {
  const today = startOfDay(new Date());
  const firstOfMonth = new Date(year, month, 1);
  const gridStart = getWeekStart(firstOfMonth);
  const cells: CalendarDayCell[] = [];

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);

    cells.push({
      date,
      iso: toIsoDate(date),
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isToday: isSameDay(date, today),
    });
  }

  return cells;
}

export function getWeekDays(date: Date): CalendarDayCell[] {
  const today = startOfDay(new Date());
  const weekStart = getWeekStart(date);
  const cells: CalendarDayCell[] = [];

  for (let index = 0; index < 7; index += 1) {
    const cellDate = new Date(weekStart);
    cellDate.setDate(weekStart.getDate() + index);

    cells.push({
      date: cellDate,
      iso: toIsoDate(cellDate),
      day: cellDate.getDate(),
      isCurrentMonth: true,
      isToday: isSameDay(cellDate, today),
    });
  }

  return cells;
}

export function shiftCalendarDate(date: Date, view: "month" | "week" | "day", direction: -1 | 1) {
  const next = new Date(date);

  if (view === "month") {
    next.setMonth(next.getMonth() + direction);
    return next;
  }

  if (view === "week") {
    next.setDate(next.getDate() + direction * 7);
    return next;
  }

  next.setDate(next.getDate() + direction);
  return next;
}

export function filterCalendarEvents(events: CalendarEvent[], filters: CalendarFilters) {
  if (filters.deadlinesOnly) {
    return events.filter((event) => event.type === "deadline");
  }

  return events.filter((event) => {
    if (event.type === "task") return filters.myTasks;
    if (event.type === "team") return filters.teamEvents;
    if (event.type === "deadline") return filters.myTasks;
    return true;
  });
}

export function getEventsForIso(events: CalendarEvent[], iso: string) {
  return events.filter((event) => event.date === iso);
}

export function countEventsInMonth(events: CalendarEvent[], year: number, month: number) {
  return events.filter((event) => {
    const date = new Date(`${event.date}T00:00:00`);
    return date.getFullYear() === year && date.getMonth() === month;
  }).length;
}

export function groupEventsByIso(events: CalendarEvent[]) {
  return events.reduce<Record<string, CalendarEvent[]>>((groups, event) => {
    if (!groups[event.date]) {
      groups[event.date] = [];
    }
    groups[event.date].push(event);
    return groups;
  }, {});
}
