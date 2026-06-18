import {
  AppstoreOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import type { ComponentType } from "react";

export type ProjectStatus = "on_track" | "in_progress" | "delayed";
export type ProjectPriority = "high" | "medium" | "low";
export type ProjectsViewMode = "grid" | "list";

export type ProjectTeamMember = {
  id: string;
  name: string;
  avatarColor: string;
};

export type WorkspaceProject = {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  teamId: string;
  progress: number;
  dueDate: string;
  taskCount: number;
  commentCount: number;
  icon: "design" | "mobile" | "security" | "migration";
  iconBg: string;
  iconColor: string;
  members: ProjectTeamMember[];
};

export const PROJECT_STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; badgeClass: string; progressClass: string }
> = {
  on_track: {
    label: "On Track",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-100",
    progressClass: "bg-emerald-500",
  },
  in_progress: {
    label: "In Progress",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-100",
    progressClass: "bg-sky-500",
  },
  delayed: {
    label: "Delayed",
    badgeClass: "bg-red-50 text-red-700 border-red-100",
    progressClass: "bg-red-500",
  },
};

export const PROJECT_ICON_MAP: Record<
  WorkspaceProject["icon"],
  ComponentType<{ className?: string }>
> = {
  design: AppstoreOutlined,
  mobile: RocketOutlined,
  security: SafetyCertificateOutlined,
  migration: ThunderboltOutlined,
};

export const PROJECT_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Projects" },
  { value: "on_track", label: "On Track" },
  { value: "in_progress", label: "In Progress" },
  { value: "delayed", label: "Delayed" },
] as const;

export const PROJECT_PRIORITY_FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
] as const;

export function buildProjectTeamFilterOptions(teamIds: string[]) {
  const uniqueTeamIds = [...new Set(teamIds.filter(Boolean))].sort();

  return [
    { value: "all", label: "All Teams" },
    ...uniqueTeamIds.map((teamId) => ({
      value: teamId,
      label: teamId.charAt(0).toUpperCase() + teamId.slice(1),
    })),
  ];
}
