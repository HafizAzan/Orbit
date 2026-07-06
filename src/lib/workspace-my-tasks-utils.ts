import type { MyTask, MyTaskBucket, MyTasksFilters } from "../data/workspace-my-tasks";
import { pluralize } from "./helper";

export type GroupedMyTasks = Record<MyTaskBucket, MyTask[]>;

export function filterMyTasks(tasks: MyTask[], filters: MyTasksFilters) {
  return tasks.filter((task) => {
    if (filters.status !== "all" && task.status !== filters.status) return false;
    if (filters.priority !== "all" && task.priority !== filters.priority) return false;
    if (filters.project !== "all" && task.projectId !== filters.project) return false;
    return true;
  });
}

export function groupMyTasksByBucket(tasks: MyTask[]): GroupedMyTasks {
  return {
    due_today: tasks.filter((task) => task.bucket === "due_today"),
    assigned: tasks.filter((task) => task.bucket === "assigned"),
    upcoming: tasks.filter((task) => task.bucket === "upcoming"),
    completed: tasks.filter((task) => task.bucket === "completed"),
  };
}

export function countRemainingMyTasks(tasks: MyTask[]) {
  return tasks.filter((task) => task.status !== "done").length;
}

export function formatMyTasksRemainingLabel(count: number) {
  return `${count} ${pluralize(count, "task")} remaining`;
}

export type MyTasksStats = {
  dueToday: number;
  inProgress: number;
  completed: number;
  assignedProjects: number;
};

export function computeMyTasksStats(tasks: MyTask[]): MyTasksStats {
  const projectIds = new Set(tasks.map((task) => task.projectId));

  return {
    dueToday: tasks.filter((task) => task.bucket === "due_today").length,
    inProgress: tasks.filter((task) => task.status !== "done").length,
    completed: tasks.filter((task) => task.status === "done").length,
    assignedProjects: projectIds.size,
  };
}

export function mapMyTaskToCalendarEvent(task: MyTask): import("../data/workspace-calendar").CalendarEvent {
  const date = task.dueDate.includes("T") ? task.dueDate.slice(0, 10) : task.dueDate;

  return {
    id: task.id,
    title: task.title,
    date,
    type: task.bucket === "due_today" && task.status !== "done" ? "deadline" : "task",
    projectId: task.projectId,
    source: "task",
  };
}
