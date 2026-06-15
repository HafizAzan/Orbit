import { BellOutlined, AppstoreOutlined } from "@ant-design/icons";
import React, { useMemo } from "react";
import AppHeader from "../app-shell/app-header";
import AppShellLayout from "../app-shell/app-shell-layout";
import AppSidebarContent from "../app-shell/app-sidebar-content";
import WorkspaceSearch from "../../component/workspace/workspace-search";
import { WorkspaceProfileProvider } from "../../context/workspace-profile-context";
import { useAppContext } from "../../context/app-context";
import { getWorkspaceNavItemsForRole } from "../../data/workspace-nav-items";
import {
  getWorkspaceBrandSubtitle,
  getWorkspaceHomePath,
  getWorkspaceRoleLabel,
} from "../../lib/workspace-routing";
import { WORKSPACE_ROUTES } from "../../router/workspace-routes";

function WorkspaceSidebarContent(props: { onNavigate?: () => void }) {
  const app = useAppContext();
  const role = app?.user?.role ?? "member";
  const { mainItems, bottomItems } = useMemo(() => getWorkspaceNavItemsForRole(role), [role]);

  return (
    <AppSidebarContent
      navItems={mainItems}
      bottomNavItems={bottomItems}
      brandSubtitle={getWorkspaceBrandSubtitle(app?.user?.organization?.name)}
      homePath={getWorkspaceHomePath()}
      onNavigate={props.onNavigate}
    />
  );
}

function WorkspaceSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card nav:flex">
      <WorkspaceSidebarContent />
    </aside>
  );
}

function WorkspaceHeader({ onMenuOpen }: { onMenuOpen?: () => void }) {
  const app = useAppContext();
  const user = app?.user;

  return (
    <AppHeader
      onMenuOpen={onMenuOpen}
      search={<WorkspaceSearch />}
      profileName={user?.name ?? "Workspace User"}
      profileRole={getWorkspaceRoleLabel(user?.role ?? "member")}
      profilePath={WORKSPACE_ROUTES.PROFILE}
      actions={
        <>
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-background hover:text-foreground"
          >
            <BellOutlined className="text-lg" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <button
            type="button"
            aria-label="Apps"
            className="hidden h-10 w-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-background hover:text-foreground sm:flex"
          >
            <AppstoreOutlined className="text-lg" />
          </button>
        </>
      }
    />
  );
}

function WorkspaceLayout() {
  return (
    <WorkspaceProfileProvider>
      <AppShellLayout
        sidebar={<WorkspaceSidebar />}
        mobileSidebar={(onNavigate) => <WorkspaceSidebarContent onNavigate={onNavigate} />}
        header={<WorkspaceHeader />}
      />
    </WorkspaceProfileProvider>
  );
}

export default React.memo(WorkspaceLayout);
