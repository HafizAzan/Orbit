import type { RegisterAs } from "../types/auth.types";
import type { ApiWorkspaceProject } from "../types/project.types";

type DeletableProjectInput = Pick<ApiWorkspaceProject, "createdById" | "viewerRole">;

type DeleteActor = {
  id: string;
  role: RegisterAs;
};

export function canDeleteWorkspaceProject(
  user: DeleteActor | null | undefined,
  project: DeletableProjectInput,
): boolean {
  if (!user) return false;

  if (user.role === "owner" || user.role === "admin") {
    return true;
  }

  if (user.role === "manager") {
    return project.viewerRole === "admin" || project.createdById === user.id;
  }

  return false;
}

export function getDeletableProjectIds(
  user: DeleteActor | null | undefined,
  projects: Array<DeletableProjectInput & { id: string }>,
): string[] {
  return projects.filter((project) => canDeleteWorkspaceProject(user, project)).map((project) => project.id);
}
