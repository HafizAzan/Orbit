import React from "react";
import useWorkspacePermissions from "../../hooks/use-workspace-permissions";
import type { WorkspacePermission } from "../../lib/workspace-permissions";
import WorkspaceAccessDenied from "./workspace-access-denied";

type WorkspaceRoleGateProps = {
  permission: WorkspacePermission;
  children: React.ReactNode;
  title?: string;
  description?: string;
};

function WorkspaceRoleGate({ permission, children, title, description }: WorkspaceRoleGateProps) {
  const { can, role } = useWorkspacePermissions();

  if (!can(permission)) {
    return <WorkspaceAccessDenied title={title} description={description} role={role} />;
  }

  return <>{children}</>;
}

export default React.memo(WorkspaceRoleGate);
