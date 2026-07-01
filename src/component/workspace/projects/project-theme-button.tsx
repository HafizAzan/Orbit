import { BgColorsOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { getProjectThemePath } from "../../../data/workspace-project-detail";
import WorkspaceNavLink from "../common/workspace-nav-link";

type ProjectThemeButtonProps = {
  projectId: string;
  type?: "default" | "primary";
  className?: string;
};

function ProjectThemeButton({ projectId, type = "default", className }: ProjectThemeButtonProps) {
  return (
    <WorkspaceNavLink to={getProjectThemePath(projectId)} preserveReturn>
      <Button
        type={type}
        icon={<BgColorsOutlined />}
        size="large"
        className={className ?? "font-semibold!"}
      >
        Theme
      </Button>
    </WorkspaceNavLink>
  );
}

export default React.memo(ProjectThemeButton);
