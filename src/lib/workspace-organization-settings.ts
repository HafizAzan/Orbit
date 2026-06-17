import type { WorkspaceOrganization } from "../types/organization.types";
import type { WorkspaceSettings } from "../data/workspace-settings";

export function buildWorkspaceSettingsFromOrganization(
  organization: WorkspaceOrganization,
): Pick<WorkspaceSettings, "workspaceName" | "workspaceSlug"> {
  return {
    workspaceName: organization.name,
    workspaceSlug: organization.slug,
  };
}

export function buildOrganizationUpdatePayload(
  settings: Pick<WorkspaceSettings, "workspaceName" | "workspaceSlug">,
) {
  return {
    name: settings.workspaceName.trim(),
    slug: settings.workspaceSlug.trim(),
  };
}

export function getWorkspaceSlugPreview(slug: string) {
  return slug.trim() || "your-workspace";
}
