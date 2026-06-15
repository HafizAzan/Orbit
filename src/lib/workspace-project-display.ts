import type { WorkspaceProject } from "../data/workspace-projects";

export function getWorkspaceProjectDisplayTitle(project: Pick<WorkspaceProject, "id" | "title">) {
  if (project.id === "1") {
    return "Project Omega";
  }

  return project.title;
}
