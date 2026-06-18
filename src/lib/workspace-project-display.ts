import type { WorkspaceProject } from "../data/workspace-projects";

export function getWorkspaceProjectDisplayTitle(project: Pick<WorkspaceProject, "title">) {
  return project.title;
}
