import {
  AuditOutlined,
  BankOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { ComponentType } from "react";
import { ADMIN_ROUTES } from "../router/admin-routes";

export type AdminNavItem = {
  key: string;
  label: string;
  path: string;
  icon: ComponentType<{ className?: string }>;
};

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { key: "dashboard", label: "Dashboard", path: ADMIN_ROUTES.DASHBOARD, icon: DashboardOutlined },
  { key: "organizations", label: "Organizations", path: ADMIN_ROUTES.ORGANIZATIONS, icon: BankOutlined },
  { key: "subscriptions", label: "Subscriptions", path: ADMIN_ROUTES.SUBSCRIPTIONS, icon: CreditCardOutlined },
  { key: "users", label: "Users", path: ADMIN_ROUTES.USERS, icon: TeamOutlined },
  { key: "activity", label: "Activity", path: ADMIN_ROUTES.ACTIVITY, icon: AuditOutlined },
  { key: "settings", label: "Settings", path: ADMIN_ROUTES.SETTINGS, icon: SettingOutlined },
];

export default ADMIN_NAV_ITEMS;
