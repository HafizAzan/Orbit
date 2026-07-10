import {
  AppstoreOutlined,
  AuditOutlined,
  BarChartOutlined,
  CalendarOutlined,
  CheckSquareOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  ProjectOutlined,
  SettingOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import type { AppNavItem } from "../layout/app-shell/app-sidebar-content";
import type { RegisterAs } from "../types/auth.types";
import { canAccessNavKey } from "../lib/plan-features";
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
    roles: ["owner", "admin", "manager"],
  },
  {
    key: "projects",
    label: "Projects",
    path: WORKSPACE_ROUTES.PROJECTS,
    icon: ProjectOutlined,
    roles: ["owner", "admin", "manager"],
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
    roles: ["owner", "admin", "manager"],
  },
  {
    key: "my-tasks",
    label: "My Tasks",
    path: WORKSPACE_ROUTES.MY_TASKS,
    icon: CheckSquareOutlined,
    roles: ["member"],
  },
  {
    key: "calendar",
    label: "Calendar",
    path: WORKSPACE_ROUTES.CALENDAR,
    icon: CalendarOutlined,
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
    key: "reports",
    label: "Reports",
    path: WORKSPACE_ROUTES.REPORTS,
    icon: BarChartOutlined,
    roles: ["owner", "admin", "manager"],
  },
  {
    key: "activity-logs",
    label: "Activity Log",
    path: WORKSPACE_ROUTES.ACTIVITY_LOGS,
    icon: AuditOutlined,
    roles: ["owner", "admin"],
  },
  {
    key: "billing",
    label: "Billing",
    path: WORKSPACE_ROUTES.BILLING,
    icon: CreditCardOutlined,
    roles: ["owner", "admin"],
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

export function getWorkspaceNavItemsForRole(
  role: RegisterAs,
  featureFlags?: readonly string[],
) {
  const mainItems = WORKSPACE_NAV_ITEMS.filter(
    (item) => item.roles.includes(role) && canAccessNavKey(item.key, featureFlags),
  );
  const bottomItems = WORKSPACE_BOTTOM_NAV_ITEMS.filter((item) => item.roles.includes(role));

  return { mainItems, bottomItems };
}

export default WORKSPACE_NAV_ITEMS;
