import { getProjectBoardPath, getProjectDetailPath } from "../data/workspace-project-detail";
import { getTaskDetailPath } from "../data/workspace-task-form";
import { WORKSPACE_ROUTES } from "../router/workspace-routes";
import type { ApiWorkspaceProject } from "../types/project.types";
import type { ApiWorkspaceTask } from "../types/task.types";
import type { ApiTeamMember } from "../types/team.types";
import { matchesSearchQuery } from "./helper";

export const WORKSPACE_TABLE_SEARCH_PARAM = "search";

export const WORKSPACE_SEARCH_CATEGORY_LABELS = {
  projects: "Projects",
  tasks: "Tasks",
  team: "Team",
} as const;

export type WorkspaceGlobalSearchCategory = keyof typeof WORKSPACE_SEARCH_CATEGORY_LABELS;

export type WorkspaceGlobalSearchResult = {
  id: string;
  category: WorkspaceGlobalSearchCategory;
  title: string;
  subtitle: string;
  route: string;
};

export type WorkspaceSearchData = {
  projects: ApiWorkspaceProject[];
  tasks: ApiWorkspaceTask[];
  teamMembers: ApiTeamMember[];
};

const RESULTS_PER_CATEGORY = 4;
const MIN_QUERY_LENGTH = 2;

export function buildWorkspaceSearchUrl(route: string, query: string) {
  const trimmed = query.trim();
  if (!trimmed) return route;

  const params = new URLSearchParams({ [WORKSPACE_TABLE_SEARCH_PARAM]: trimmed });
  return `${route}?${params.toString()}`;
}

function pushResult(
  results: WorkspaceGlobalSearchResult[],
  counts: Record<WorkspaceGlobalSearchCategory, number>,
  result: WorkspaceGlobalSearchResult,
) {
  if (counts[result.category] >= RESULTS_PER_CATEGORY) return;

  results.push(result);
  counts[result.category] += 1;
}

export function searchWorkspaceGlobal(query: string, data: WorkspaceSearchData) {
  const normalizedQuery = query.trim();
  if (normalizedQuery.length < MIN_QUERY_LENGTH) return [];

  const results: WorkspaceGlobalSearchResult[] = [];
  const counts: Record<WorkspaceGlobalSearchCategory, number> = {
    projects: 0,
    tasks: 0,
    team: 0,
  };

  const visibleProjectIds = new Set(data.projects.map((project) => project.id));

  for (const project of data.projects) {
    const matches =
      matchesSearchQuery(project.title, normalizedQuery) ||
      matchesSearchQuery(project.description, normalizedQuery) ||
      matchesSearchQuery(project.key, normalizedQuery);

    if (!matches) continue;

    pushResult(results, counts, {
      id: `project-${project.id}`,
      category: "projects",
      title: project.title,
      subtitle: project.description,
      route: getProjectDetailPath(project.id),
    });
  }

  for (const task of data.tasks) {
    if (!visibleProjectIds.has(task.projectId)) continue;

    const matches =
      matchesSearchQuery(task.title, normalizedQuery) ||
      matchesSearchQuery(task.taskCode, normalizedQuery) ||
      matchesSearchQuery(task.project, normalizedQuery) ||
      matchesSearchQuery(task.assignee?.name ?? "", normalizedQuery);

    if (!matches) continue;

    pushResult(results, counts, {
      id: `task-${task.id}`,
      category: "tasks",
      title: task.title,
      subtitle: `${task.taskCode} · ${task.project}`,
      route: getTaskDetailPath(task.id),
    });
  }

  for (const member of data.teamMembers) {
    const matches =
      matchesSearchQuery(member.name, normalizedQuery) ||
      matchesSearchQuery(member.email, normalizedQuery);

    if (!matches) continue;

    pushResult(results, counts, {
      id: `member-${member.id}`,
      category: "team",
      title: member.name,
      subtitle: member.email,
      route: WORKSPACE_ROUTES.TEAMS,
    });
  }

  return results;
}

export function searchMemberWorkspaceGlobal(query: string, data: WorkspaceSearchData) {
  const normalizedQuery = query.trim();
  if (normalizedQuery.length < MIN_QUERY_LENGTH) return [];

  const results: WorkspaceGlobalSearchResult[] = [];
  const counts: Record<WorkspaceGlobalSearchCategory, number> = {
    projects: 0,
    tasks: 0,
    team: 0,
  };

  const projectIds = new Set(data.tasks.map((task) => task.projectId));

  for (const task of data.tasks) {
    const matches =
      matchesSearchQuery(task.title, normalizedQuery) ||
      matchesSearchQuery(task.taskCode, normalizedQuery) ||
      matchesSearchQuery(task.project, normalizedQuery);

    if (!matches) continue;

    pushResult(results, counts, {
      id: `task-${task.id}`,
      category: "tasks",
      title: task.title,
      subtitle: `${task.taskCode} · ${task.project}`,
      route: getTaskDetailPath(task.id),
    });
  }

  for (const project of data.projects) {
    if (!projectIds.has(project.id)) continue;

    const matches =
      matchesSearchQuery(project.title, normalizedQuery) ||
      matchesSearchQuery(project.description, normalizedQuery);

    if (!matches) continue;

    pushResult(results, counts, {
      id: `project-${project.id}`,
      category: "projects",
      title: project.title,
      subtitle: project.description,
      route: getProjectBoardPath(project.id),
    });
  }

  return results;
}

export function groupWorkspaceSearchResults(results: WorkspaceGlobalSearchResult[]) {
  const order: WorkspaceGlobalSearchCategory[] = ["projects", "tasks", "team"];

  return order
    .map((category) => {
      const items = results.filter((result) => result.category === category);
      if (!items.length) return null;

      return {
        label: WORKSPACE_SEARCH_CATEGORY_LABELS[category],
        options: items.map((item) => ({
          value: item.id,
          label: item.title,
          result: item,
        })),
      };
    })
    .filter((group): group is NonNullable<typeof group> => group !== null);
}
