import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { getProjectCreatePath } from "../../../data/workspace-project-form";
import useWorkspacePermissions from "../../../hooks/use-workspace-permissions";
import { Paragraph, Title } from "../../ui/typography";
import BulkDeleteProjectsButton from "./bulk-delete-projects-button";
import WorkspaceNavLink from "../common/workspace-nav-link";

type ProjectsPageHeaderProps = {
  selectedCount?: number;
  onBulkDelete?: () => void | Promise<void>;
};

function ProjectsPageHeader({ selectedCount = 0, onBulkDelete }: ProjectsPageHeaderProps) {
  const { can } = useWorkspacePermissions();
  const canCreateProject = can("project.create");
  const showBulkDelete = selectedCount > 0 && Boolean(onBulkDelete);

  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <Title level={2} className="text-2xl text-foreground lg:text-3xl">
          Projects
        </Title>
        <Paragraph size="sm" className="mt-1 text-muted">
          Manage and track your enterprise-level workflows.
        </Paragraph>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {canCreateProject ? (
          <WorkspaceNavLink to={getProjectCreatePath()}>
            <Button type="primary" icon={<PlusOutlined />} size="large" className="font-semibold!">
              Create Project
            </Button>
          </WorkspaceNavLink>
        ) : null}

        {showBulkDelete ? (
          <BulkDeleteProjectsButton selectedCount={selectedCount} onDelete={onBulkDelete} />
        ) : null}
      </div>
    </div>
  );
}

export default React.memo(ProjectsPageHeader);
