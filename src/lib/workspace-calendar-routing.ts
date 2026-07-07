import { getProjectDetailPath } from "../data/workspace-project-detail";
import { getTaskDetailPath } from "../data/workspace-task-form";
import type { CalendarEvent } from "../data/workspace-calendar";
import type { RegisterAs } from "../types/auth.types";

export function resolveCalendarEventHref(event: CalendarEvent, role: RegisterAs | undefined) {
  if (event.source === "task" || event.id.startsWith("task-")) {
    return getTaskDetailPath(event.id.replace("task-", ""));
  }

  if (event.source === "project" || event.id.startsWith("project-")) {
    return getProjectDetailPath(event.id.replace("project-", ""));
  }

  if (role === "member") {
    return null;
  }

  return null;
}
