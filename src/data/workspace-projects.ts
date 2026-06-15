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

export const WORKSPACE_PROJECTS: WorkspaceProject[] = [
  {
    id: "1",
    title: "Nova UI System",
    description: "Complete overhaul of the design system and component library for enterprise scale.",
    status: "on_track",
    priority: "high",
    teamId: "design",
    progress: 65,
    dueDate: "2024-10-24",
    taskCount: 24,
    commentCount: 12,
    icon: "design",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    members: [
      { id: "1", name: "Sarah Jenkins", avatarColor: "bg-indigo-100 text-indigo-700" },
      { id: "2", name: "Marcus Thorne", avatarColor: "bg-sky-100 text-sky-700" },
      { id: "3", name: "Elena Rodriguez", avatarColor: "bg-violet-100 text-violet-700" },
    ],
  },
  {
    id: "2",
    title: "Mars Landing App",
    description: "Mobile application for the upcoming Mars mission simulation and telemetry tracking.",
    status: "in_progress",
    priority: "high",
    teamId: "mobile",
    progress: 42,
    dueDate: "2024-11-15",
    taskCount: 18,
    commentCount: 8,
    icon: "mobile",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    members: [
      { id: "4", name: "James Wu", avatarColor: "bg-emerald-100 text-emerald-700" },
      { id: "5", name: "Aisha Khan", avatarColor: "bg-amber-100 text-amber-700" },
    ],
  },
  {
    id: "3",
    title: "Security Audit 2024",
    description: "Annual security compliance review and penetration testing for all cloud infrastructure.",
    status: "delayed",
    priority: "medium",
    teamId: "security",
    progress: 28,
    dueDate: "2024-09-30",
    taskCount: 32,
    commentCount: 15,
    icon: "security",
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    members: [
      { id: "6", name: "David Chen", avatarColor: "bg-red-100 text-red-700" },
      { id: "7", name: "Priya Patel", avatarColor: "bg-orange-100 text-orange-700" },
      { id: "8", name: "Tom Baker", avatarColor: "bg-slate-100 text-slate-700" },
      { id: "9", name: "Lisa Park", avatarColor: "bg-pink-100 text-pink-700" },
    ],
  },
  {
    id: "4",
    title: "Legacy Migration",
    description: "Migrating on-premise legacy databases to the new cloud-native architecture.",
    status: "on_track",
    priority: "low",
    teamId: "platform",
    progress: 88,
    dueDate: "2024-12-01",
    taskCount: 45,
    commentCount: 6,
    icon: "migration",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    members: [
      { id: "10", name: "Chris Lee", avatarColor: "bg-violet-100 text-violet-700" },
      { id: "11", name: "Nina Ortiz", avatarColor: "bg-indigo-100 text-indigo-700" },
    ],
  },
];

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

export const PROJECT_TEAM_FILTER_OPTIONS = [
  { value: "all", label: "All Teams" },
  { value: "design", label: "Design" },
  { value: "mobile", label: "Mobile" },
  { value: "security", label: "Security" },
  { value: "platform", label: "Platform" },
] as const;
