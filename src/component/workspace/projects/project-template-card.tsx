import { PlusOutlined } from "@ant-design/icons";
import React from "react";
import { getProjectCreatePath } from "../../../data/workspace-project-form";
import WorkspaceNavLink from "../common/workspace-nav-link";
import { Paragraph, Title } from "../../ui/typography";

function ProjectTemplateCard() {
  return (
    <WorkspaceNavLink
      to={getProjectCreatePath()}
      className="flex min-h-[320px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/50 p-8 text-center transition-colors hover:border-primary/40 hover:bg-card"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-primary">
        <PlusOutlined className="text-2xl" />
      </div>
      <Title level={5} color="default" className="mt-5">New Project Template</Title>
      <Paragraph size="sm" className="mt-2 max-w-xs leading-relaxed">
        Quickly launch a new workspace with pre-built workflows.
      </Paragraph>
    </WorkspaceNavLink>
  );
}

export default React.memo(ProjectTemplateCard);
