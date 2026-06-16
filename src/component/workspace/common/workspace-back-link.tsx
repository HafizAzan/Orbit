import React from "react";
import { Link } from "react-router-dom";
import { useWorkspaceReturnTo } from "../../../lib/workspace-navigation";

type WorkspaceBackLinkProps = {
  fallbackPath: string;
  fallbackLabel: string;
  className?: string;
};

function WorkspaceBackLink({ fallbackPath, fallbackLabel, className }: WorkspaceBackLinkProps) {
  const { returnPath, returnLabel } = useWorkspaceReturnTo(fallbackPath, fallbackLabel);

  return (
    <Link to={returnPath} className={className}>
      ← Back to {returnLabel}
    </Link>
  );
}

export default React.memo(WorkspaceBackLink);
