import {
  CheckCircleOutlined,
  DollarOutlined,
  LineChartOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import type { ComponentType } from "react";
import type { OrganizationPlan } from "./admin-organizations";
import { PLAN_STYLES } from "./admin-organizations";

export type SubscriptionStatus = "active" | "trial" | "expired" | "cancelled";

export type BillingCycle = "Annual" | "Monthly";

export type SubscriptionRecord = {
  id: string;
  organizationName: string;
  contactEmail: string;
  plan: OrganizationPlan;
  billingCycle: BillingCycle;
  renewalDate: string;
  amount: number;
  status: SubscriptionStatus;
};

export type SubscriptionStat = {
  id: string;
  label: string;
  value: string;
  trend: string;
  trendType: "up" | "down" | "stable" | "alert";
  icon: "monthly-revenue" | "annual-revenue" | "active-plans" | "expired-plans";
  variant?: "default" | "danger";
};

export type SubscriptionRevenuePoint = {
  month: string;
  revenue: number;
};

export type PlanDistributionItem = {
  id: string;
  label: string;
  percentage: number;
  color: string;
  barColor: string;
};

export type SubscriptionTabKey = SubscriptionStatus;

export const SUBSCRIPTION_TABS: { key: SubscriptionTabKey; label: string }[] = [
  { key: "active", label: "Active" },
  { key: "trial", label: "Trial" },
  { key: "expired", label: "Expired" },
  { key: "cancelled", label: "Cancelled" },
];

export const SUBSCRIPTION_PLAN_FILTER_OPTIONS: { value: OrganizationPlan; label: string }[] = [
  { value: "ENTERPRISE", label: "Enterprise" },
  { value: "BUSINESS", label: "Business" },
  { value: "PRO", label: "Pro" },
  { value: "FREE", label: "Free" },
];

export const SUBSCRIPTION_BILLING_FILTER_OPTIONS: { value: BillingCycle; label: string }[] = [
  { value: "Annual", label: "Annual" },
  { value: "Monthly", label: "Monthly" },
];

export const SUBSCRIPTION_STATUS_FILTER_OPTIONS: { value: SubscriptionStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "trial", label: "Trial" },
  { value: "expired", label: "Expired" },
  { value: "cancelled", label: "Cancelled" },
];

export const SUBSCRIPTION_STATS: SubscriptionStat[] = [
  {
    id: "monthly-revenue",
    label: "Monthly Revenue",
    value: "$425,000",
    trend: "+12.5%",
    trendType: "up",
    icon: "monthly-revenue",
  },
  {
    id: "annual-revenue",
    label: "Annual Revenue",
    value: "$5.1M",
    trend: "+8.2%",
    trendType: "up",
    icon: "annual-revenue",
  },
  {
    id: "active-plans",
    label: "Active Plans",
    value: "1,102",
    trend: "+4%",
    trendType: "up",
    icon: "active-plans",
  },
  {
    id: "expired-plans",
    label: "Expired Plans",
    value: "24",
    trend: "+2",
    trendType: "alert",
    icon: "expired-plans",
    variant: "danger",
  },
];

export const SUBSCRIPTION_REVENUE_DATA: SubscriptionRevenuePoint[] = [
  { month: "Jan", revenue: 180000 },
  { month: "Feb", revenue: 210000 },
  { month: "Mar", revenue: 195000 },
  { month: "Apr", revenue: 240000 },
  { month: "May", revenue: 265000 },
  { month: "Jun", revenue: 280000 },
  { month: "Jul", revenue: 310000 },
  { month: "Aug", revenue: 295000 },
  { month: "Sep", revenue: 340000 },
  { month: "Oct", revenue: 360000 },
  { month: "Nov", revenue: 390000 },
  { month: "Dec", revenue: 425000 },
];

export const PLAN_DISTRIBUTION: PlanDistributionItem[] = [
  { id: "enterprise", label: "Enterprise", percentage: 42, color: "text-violet-700", barColor: "bg-violet-500" },
  { id: "business", label: "Business", percentage: 35, color: "text-sky-700", barColor: "bg-sky-500" },
  { id: "pro", label: "Pro", percentage: 18, color: "text-indigo-700", barColor: "bg-indigo-500" },
  { id: "free", label: "Free", percentage: 5, color: "text-slate-600", barColor: "bg-slate-400" },
];

export const SUBSCRIPTIONS_PAGE_SIZE = 25;

export const SUBSCRIPTIONS_DATA: SubscriptionRecord[] = [
  {
    id: "1",
    organizationName: "Acme Corp",
    contactEmail: "billing@acme.com",
    plan: "ENTERPRISE",
    billingCycle: "Annual",
    renewalDate: "2024-10-12",
    amount: 12000,
    status: "active",
  },
  {
    id: "2",
    organizationName: "Globex Inc",
    contactEmail: "finance@globex.io",
    plan: "BUSINESS",
    billingCycle: "Monthly",
    renewalDate: "2024-11-05",
    amount: 899,
    status: "active",
  },
  {
    id: "3",
    organizationName: "Initech",
    contactEmail: "accounts@initech.net",
    plan: "PRO",
    billingCycle: "Monthly",
    renewalDate: "2024-09-18",
    amount: 299,
    status: "trial",
  },
  {
    id: "4",
    organizationName: "Umbrella Co",
    contactEmail: "pay@umbrella.co",
    plan: "ENTERPRISE",
    billingCycle: "Annual",
    renewalDate: "2025-01-22",
    amount: 24000,
    status: "active",
  },
  {
    id: "5",
    organizationName: "Stark Industries",
    contactEmail: "billing@stark.com",
    plan: "ENTERPRISE",
    billingCycle: "Annual",
    renewalDate: "2024-08-15",
    amount: 36000,
    status: "active",
  },
  {
    id: "6",
    organizationName: "Wayne Enterprises",
    contactEmail: "subs@wayne.com",
    plan: "BUSINESS",
    billingCycle: "Annual",
    renewalDate: "2024-07-03",
    amount: 9600,
    status: "active",
  },
  {
    id: "7",
    organizationName: "Cyberdyne Systems",
    contactEmail: "billing@cyberdyne.ai",
    plan: "PRO",
    billingCycle: "Monthly",
    renewalDate: "2024-03-01",
    amount: 299,
    status: "expired",
  },
  {
    id: "8",
    organizationName: "Oscorp",
    contactEmail: "finance@oscorp.com",
    plan: "BUSINESS",
    billingCycle: "Monthly",
    renewalDate: "2024-06-10",
    amount: 899,
    status: "trial",
  },
  {
    id: "9",
    organizationName: "Pied Piper",
    contactEmail: "hello@piedpiper.com",
    plan: "FREE",
    billingCycle: "Monthly",
    renewalDate: "2024-04-01",
    amount: 0,
    status: "trial",
  },
  {
    id: "10",
    organizationName: "Hooli",
    contactEmail: "enterprise@hooli.com",
    plan: "ENTERPRISE",
    billingCycle: "Annual",
    renewalDate: "2025-02-20",
    amount: 48000,
    status: "active",
  },
  {
    id: "11",
    organizationName: "Massive Dynamic",
    contactEmail: "ap@massive.com",
    plan: "PRO",
    billingCycle: "Annual",
    renewalDate: "2023-12-15",
    amount: 3588,
    status: "expired",
  },
  {
    id: "12",
    organizationName: "Soylent Corp",
    contactEmail: "billing@soylent.io",
    plan: "BUSINESS",
    billingCycle: "Monthly",
    renewalDate: "2024-01-30",
    amount: 899,
    status: "cancelled",
  },
];

export const SUBSCRIPTION_STAT_ICONS: Record<
  SubscriptionStat["icon"],
  ComponentType<{ className?: string }>
> = {
  "monthly-revenue": DollarOutlined,
  "annual-revenue": LineChartOutlined,
  "active-plans": CheckCircleOutlined,
  "expired-plans": WarningOutlined,
};

export const SUBSCRIPTION_TREND_STYLES: Record<SubscriptionStat["trendType"], string> = {
  up: "bg-emerald-50 text-emerald-600",
  down: "bg-red-50 text-red-600",
  stable: "bg-slate-100 text-slate-600",
  alert: "bg-red-50 text-red-600",
};

export const SUBSCRIPTION_STATUS_STYLES: Record<
  SubscriptionStatus,
  { dot: string; label: string; badge: string }
> = {
  active: {
    dot: "bg-emerald-500",
    label: "Active",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  trial: {
    dot: "bg-violet-500",
    label: "Trialing",
    badge: "border-violet-200 bg-violet-50 text-violet-700",
  },
  expired: {
    dot: "bg-red-500",
    label: "Expired",
    badge: "border-red-200 bg-red-50 text-red-700",
  },
  cancelled: {
    dot: "bg-slate-400",
    label: "Cancelled",
    badge: "border-slate-200 bg-slate-50 text-slate-600",
  },
};

export { PLAN_STYLES };
