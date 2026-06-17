import { LockOutlined } from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";
import { Paragraph, Title } from "../ui/typography";
import { getWorkspaceHomePath, getWorkspaceRoleLabel } from "../../lib/workspace-routing";
import type { RegisterAs } from "../../types/auth.types";

type WorkspaceAccessDeniedProps = {
  title?: string;
  description?: string;
  role?: RegisterAs;
  fallbackPath?: string;
  fallbackLabel?: string;
};

function WorkspaceAccessDenied({
  title = "Access restricted",
  description = "Your role does not have permission to view this page.",
  role,
  fallbackPath,
  fallbackLabel,
}: WorkspaceAccessDeniedProps) {
  const homePath = fallbackPath ?? getWorkspaceHomePath(role);
  const homeLabel = fallbackLabel ?? (role === "member" ? "Back to My Tasks" : "Back to dashboard");
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
        <LockOutlined className="text-2xl" />
      </span>
      <Title level={3} className="mt-5 text-foreground">
        {title}
      </Title>
      <Paragraph size="sm" className="mt-2 text-muted">
        {description}
      </Paragraph>
      {role ? (
        <Paragraph size="sm" className="mt-1 text-muted">
          Signed in as <span className="font-semibold text-foreground">{getWorkspaceRoleLabel(role)}</span>.
        </Paragraph>
      ) : null}
      <Link
        to={homePath}
        className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        {homeLabel}
      </Link>
    </div>
  );
}

export default React.memo(WorkspaceAccessDenied);
