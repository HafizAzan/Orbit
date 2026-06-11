import {
  BankOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import type { ComponentType } from "react";

export type OrganizationPlan = "ENTERPRISE" | "BUSINESS" | "PRO" | "FREE";

export type OrganizationStatus = "active" | "trial" | "suspended";

export type OrganizationRecord = {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  ownerEmail: string;
  plan: OrganizationPlan;
  users: number;
  projects: number;
  status: OrganizationStatus;
  createdAt: string;
};

export type OrganizationStat = {
  id: string;
  label: string;
  value: string;
  trend: string;
  trendType: "up" | "down" | "stable" | "alert";
  icon: "total" | "active" | "trial" | "suspended";
  variant?: "default" | "danger";
};

export const ORGANIZATION_STATS: OrganizationStat[] = [
  {
    id: "total",
    label: "Total Organizations",
    value: "1,284",
    trend: "+12%",
    trendType: "up",
    icon: "total",
  },
  {
    id: "active",
    label: "Active Organizations",
    value: "1,102",
    trend: "+4%",
    trendType: "up",
    icon: "active",
  },
  {
    id: "trial",
    label: "Trial Organizations",
    value: "158",
    trend: "Stable",
    trendType: "stable",
    icon: "trial",
  },
  {
    id: "suspended",
    label: "Suspended Organizations",
    value: "24",
    trend: "+2",
    trendType: "alert",
    icon: "suspended",
    variant: "danger",
  },
];

export const ORGANIZATIONS_DATA: OrganizationRecord[] = [
  {
    id: "1",
    name: "Acme Corp",
    slug: "acme-corp",
    ownerName: "John Doe",
    ownerEmail: "john@acme.com",
    plan: "ENTERPRISE",
    users: 142,
    projects: 28,
    status: "active",
    createdAt: "2023-10-12",
  },
  {
    id: "2",
    name: "Globex Inc",
    slug: "globex-inc",
    ownerName: "Sarah Jenkins",
    ownerEmail: "sarah@globex.io",
    plan: "BUSINESS",
    users: 86,
    projects: 14,
    status: "active",
    createdAt: "2023-11-05",
  },
  {
    id: "3",
    name: "Initech",
    slug: "initech",
    ownerName: "Michael Chen",
    ownerEmail: "m.chen@initech.net",
    plan: "PRO",
    users: 45,
    projects: 9,
    status: "trial",
    createdAt: "2024-01-18",
  },
  {
    id: "4",
    name: "Umbrella Co",
    slug: "umbrella-co",
    ownerName: "Emily Davis",
    ownerEmail: "emily@umbrella.co",
    plan: "ENTERPRISE",
    users: 210,
    projects: 42,
    status: "active",
    createdAt: "2023-08-22",
  },
  {
    id: "5",
    name: "Stark Industries",
    slug: "stark-industries",
    ownerName: "Tony Stark",
    ownerEmail: "tony@stark.com",
    plan: "ENTERPRISE",
    users: 320,
    projects: 56,
    status: "active",
    createdAt: "2023-06-15",
  },
  {
    id: "6",
    name: "Wayne Enterprises",
    slug: "wayne-enterprises",
    ownerName: "Bruce Wayne",
    ownerEmail: "bruce@wayne.com",
    plan: "BUSINESS",
    users: 98,
    projects: 19,
    status: "active",
    createdAt: "2023-09-03",
  },
  {
    id: "7",
    name: "Cyberdyne Systems",
    slug: "cyberdyne-systems",
    ownerName: "Miles Dyson",
    ownerEmail: "miles@cyberdyne.ai",
    plan: "PRO",
    users: 52,
    projects: 11,
    status: "suspended",
    createdAt: "2023-12-01",
  },
  {
    id: "8",
    name: "Oscorp",
    slug: "oscorp",
    ownerName: "Norman Osborn",
    ownerEmail: "norman@oscorp.com",
    plan: "BUSINESS",
    users: 74,
    projects: 16,
    status: "trial",
    createdAt: "2024-02-10",
  },
  {
    id: "9",
    name: "Pied Piper",
    slug: "pied-piper",
    ownerName: "Richard Hendricks",
    ownerEmail: "richard@piedpiper.com",
    plan: "FREE",
    users: 12,
    projects: 3,
    status: "trial",
    createdAt: "2024-03-01",
  },
  {
    id: "10",
    name: "Hooli",
    slug: "hooli",
    ownerName: "Gavin Belson",
    ownerEmail: "gavin@hooli.com",
    plan: "ENTERPRISE",
    users: 185,
    projects: 34,
    status: "active",
    createdAt: "2023-07-20",
  },
];

export const PLAN_STYLES: Record<OrganizationPlan, string> = {
  ENTERPRISE: "border-violet-200 bg-violet-50 text-violet-700",
  BUSINESS: "border-sky-200 bg-sky-50 text-sky-700",
  PRO: "border-indigo-200 bg-indigo-50 text-indigo-700",
  FREE: "border-slate-200 bg-slate-50 text-slate-600",
};

export const STATUS_STYLES: Record<OrganizationStatus, { dot: string; label: string }> = {
  active: { dot: "bg-emerald-500", label: "Active" },
  trial: { dot: "bg-amber-500", label: "Trial" },
  suspended: { dot: "bg-red-500", label: "Suspended" },
};

export const ORGANIZATION_STATUS_FILTER_OPTIONS: { value: OrganizationStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "trial", label: "Trial" },
  { value: "suspended", label: "Suspended" },
];

export const ORGANIZATION_PLAN_FILTER_OPTIONS: { value: OrganizationPlan; label: string }[] = [
  { value: "ENTERPRISE", label: "Enterprise" },
  { value: "BUSINESS", label: "Business" },
  { value: "PRO", label: "Pro" },
  { value: "FREE", label: "Free" },
];

export const ORGANIZATION_CREATED_FILTER_OPTIONS = [
  { value: "all", label: "Any time" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
] as const;

export type OrganizationCreatedDateFilter = (typeof ORGANIZATION_CREATED_FILTER_OPTIONS)[number]["value"];

export const ORGANIZATIONS_PAGE_SIZE = 10;

export const ORGANIZATION_STAT_ICONS: Record<
  OrganizationStat["icon"],
  ComponentType<{ className?: string }>
> = {
  total: BankOutlined,
  active: CheckCircleOutlined,
  trial: ClockCircleOutlined,
  suspended: WarningOutlined,
};

export const ORGANIZATION_TREND_STYLES: Record<OrganizationStat["trendType"], string> = {
  up: "bg-emerald-50 text-emerald-600",
  down: "bg-red-50 text-red-600",
  stable: "bg-slate-100 text-slate-600",
  alert: "bg-red-50 text-red-600",
};
