import React from "react";
import { Link, useLocation, type LinkProps } from "react-router-dom";
import {
  createWorkspaceNavState,
  getWorkspacePathLabel,
  preserveWorkspaceNavState,
} from "../../../lib/workspace-navigation";

type WorkspaceNavLinkProps = Omit<LinkProps, "state"> & {
  preserveReturn?: boolean;
};

function WorkspaceNavLink({ preserveReturn = false, ...props }: WorkspaceNavLinkProps) {
  const location = useLocation();

  const navState = preserveReturn
    ? preserveWorkspaceNavState(location.state, location.pathname)
    : createWorkspaceNavState(location.pathname, getWorkspacePathLabel(location.pathname));

  return <Link {...props} state={navState.state} />;
}

export default React.memo(WorkspaceNavLink);
