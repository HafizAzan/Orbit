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
