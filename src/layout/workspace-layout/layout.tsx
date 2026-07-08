import React, { useMemo } from "react";
import AppHeader from "../app-shell/app-header";
import AppShellLayout from "../app-shell/app-shell-layout";
import AppSidebarContent from "../app-shell/app-sidebar-content";
import WorkspaceGlobalSearch from "../../component/workspace/layout/workspace-global-search";
import WorkspaceNotificationsDropdown from "../../component/workspace/layout/workspace-notifications-dropdown";
import AppUiThemeDropdown from "../../component/common/app-ui-theme-dropdown";
import WorkspaceAuthRefresh from "../../component/workspace/workspace-auth-refresh";
import WorkspaceRealtimeProvider from "../../component/workspace/workspace-realtime-provider";
import { WorkspaceProfileProvider } from "../../context/workspace-profile-context";
import { useAppContext } from "../../context/app-context";
import { getWorkspaceNavItemsForRole } from "../../data/workspace-nav-items";
import { getWorkspaceBrandSubtitle, getWorkspaceHomePath, getWorkspaceRoleLabel } from "../../lib/workspace-routing";
import { WORKSPACE_ROUTES } from "../../router/workspace-routes";

function WorkspaceSidebarContent(props: { onNavigate?: () => void }) {
  const app = useAppContext();
  const role = app?.user?.role;
  const { mainItems, bottomItems } = useMemo(() => (role ? getWorkspaceNavItemsForRole(role) : { mainItems: [], bottomItems: [] }), [role]);

  const handleNavItemClick = (item: { key: string }) => {
    if (item.key === "dashboard") {
      void app?.refreshUser?.();
    }
  };

  return (
    <AppSidebarContent
      navItems={mainItems}
      bottomNavItems={bottomItems}
      brandSubtitle={getWorkspaceBrandSubtitle(app?.user?.organization?.name)}
      homePath={role ? getWorkspaceHomePath(role) : WORKSPACE_ROUTES.DASHBOARD}
      onNavigate={props.onNavigate}
      onNavItemClick={handleNavItemClick}
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
      search={<WorkspaceGlobalSearch />}
      profileName={user?.name ?? "Workspace User"}
      profileRole={user?.role ? getWorkspaceRoleLabel(user.role) : "User"}
      profilePath={WORKSPACE_ROUTES.PROFILE}
      actions={
        <>
          <AppUiThemeDropdown />
          <WorkspaceNotificationsDropdown />
        </>
      }
    />
  );
}

function WorkspaceLayout() {
  return (
    <WorkspaceProfileProvider>
      <WorkspaceAuthRefresh />
      <WorkspaceRealtimeProvider>
        <AppShellLayout
          sidebar={<WorkspaceSidebar />}
          mobileSidebar={(onNavigate) => <WorkspaceSidebarContent onNavigate={onNavigate} />}
          header={<WorkspaceHeader />}
        />
      </WorkspaceRealtimeProvider>
    </WorkspaceProfileProvider>
  );
}

export default React.memo(WorkspaceLayout);
