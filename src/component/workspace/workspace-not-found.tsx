import { FileSearchOutlined } from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";
import { Paragraph, Title } from "../ui/typography";
import { useAppContext } from "../../context/app-context";
import { getWorkspaceHomePath } from "../../lib/workspace-routing";

type WorkspaceNotFoundProps = {
  title?: string;
  description?: string;
};

function WorkspaceNotFound({
  title = "Page not found",
  description = "This page does not exist or you do not have access to it.",
}: WorkspaceNotFoundProps) {
  const app = useAppContext();
  const homePath = getWorkspaceHomePath(app?.user?.role);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted-surface text-muted">
        <FileSearchOutlined className="text-2xl" />
      </span>
      <Title level={3} className="mt-5 text-foreground">
        {title}
      </Title>
      <Paragraph size="sm" className="mt-2 text-muted">
        {description}
      </Paragraph>
      <Link
        to={homePath}
        className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Back to home
      </Link>
    </div>
  );
}

export default React.memo(WorkspaceNotFound);
