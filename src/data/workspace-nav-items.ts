import {
  AppstoreOutlined,
  CalendarOutlined,
  DashboardOutlined,
  ProjectOutlined,
  SettingOutlined,
  TableOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import type { AppNavItem } from "../layout/app-shell/app-sidebar-content";
import type { RegisterAs } from "../types/auth.types";
import { WORKSPACE_ROUTES } from "../router/workspace-routes";

export type WorkspaceNavItem = AppNavItem & {
  roles: RegisterAs[];
};

const WORKSPACE_NAV_ITEMS: WorkspaceNavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: WORKSPACE_ROUTES.DASHBOARD,
    icon: DashboardOutlined,
    roles: ["owner", "admin", "manager", "member"],
  },
  {
    key: "projects",
    label: "Projects",
    path: WORKSPACE_ROUTES.PROJECTS,
    icon: ProjectOutlined,
    roles: ["owner", "admin", "manager", "member"],
  },
  {
    key: "boards",
    label: "Boards",
    path: WORKSPACE_ROUTES.BOARDS,
    icon: AppstoreOutlined,
    roles: ["owner", "admin", "manager", "member"],
  },
  {
    key: "tasks",
    label: "Tasks",
    path: WORKSPACE_ROUTES.TASKS,
    icon: UnorderedListOutlined,
    roles: ["owner", "admin", "manager", "member"],
  },
  {
    key: "teams",
    label: "Teams",
    path: WORKSPACE_ROUTES.TEAMS,
    icon: TeamOutlined,
    roles: ["owner", "admin", "manager"],
  },
  {
    key: "calendar",
    label: "Calendar",
    path: WORKSPACE_ROUTES.CALENDAR,
    icon: CalendarOutlined,
    roles: ["owner", "admin", "manager", "member"],
  },
  {
    key: "reports",
    label: "Reports",
    path: WORKSPACE_ROUTES.REPORTS,
    icon: TableOutlined,
    roles: ["owner", "admin", "manager"],
  },
];

const WORKSPACE_BOTTOM_NAV_ITEMS: WorkspaceNavItem[] = [
  {
    key: "settings",
    label: "Settings",
    path: WORKSPACE_ROUTES.SETTINGS,
    icon: SettingOutlined,
    roles: ["owner", "admin"],
  },
];

export function getWorkspaceNavItemsForRole(role: RegisterAs) {
  const mainItems = WORKSPACE_NAV_ITEMS.filter((item) => item.roles.includes(role));
  const bottomItems = WORKSPACE_BOTTOM_NAV_ITEMS.filter((item) => item.roles.includes(role));

  return { mainItems, bottomItems };
}

export default WORKSPACE_NAV_ITEMS;
