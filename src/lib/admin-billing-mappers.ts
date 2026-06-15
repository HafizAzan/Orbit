import type { OrganizationStat } from "../data/admin-organizations";
import type { OrganizationStats } from "../api-services/admin-organizations.service";
import type { PlanDistributionItem, SubscriptionStat } from "../data/admin-subscriptions";
import type {
  PlanDistributionRecord,
  SubscriptionStats,
} from "../api-services/admin-subscriptions.service";
import { formatCurrency } from "./helper";

const PLAN_DISTRIBUTION_UI: Record<
  PlanDistributionRecord["code"],
  Pick<PlanDistributionItem, "id" | "color" | "barColor">
> = {
  ENTERPRISE: {
    id: "enterprise",
    color: "text-violet-700",
    barColor: "bg-violet-500",
  },
  BUSINESS: {
    id: "business",
    color: "text-sky-700",
    barColor: "bg-sky-500",
  },
  PRO: {
    id: "pro",
    color: "text-indigo-700",
    barColor: "bg-indigo-500",
  },
  FREE: {
    id: "free",
    color: "text-slate-600",
    barColor: "bg-slate-400",
  },
};

const formatStatPercentage = (percentage: number) => `${percentage}%`;

export function mapOrganizationStats(stats?: OrganizationStats): OrganizationStat[] {
  if (!stats) return [];

  return [
    {
      id: "total",
      label: "Total Organizations",
      value: stats.total.value.toLocaleString(),
      trend: formatStatPercentage(stats.total.percentage),
      trendType: "stable",
      icon: "total",
    },
    {
      id: "active",
      label: "Active Organizations",
      value: stats.active.value.toLocaleString(),
      trend: formatStatPercentage(stats.active.percentage),
      trendType: "up",
      icon: "active",
    },
    {
      id: "trial",
      label: "Trial Organizations",
      value: stats.trial.value.toLocaleString(),
      trend: formatStatPercentage(stats.trial.percentage),
      trendType: "stable",
      icon: "trial",
    },
    {
      id: "suspended",
      label: "Suspended Organizations",
      value: stats.suspended.value.toLocaleString(),
      trend: formatStatPercentage(stats.suspended.percentage),
      trendType: "alert",
      icon: "suspended",
      variant: "danger",
    },
  ];
}

export function mapSubscriptionStats(stats?: SubscriptionStats): SubscriptionStat[] {
  if (!stats) return [];

  return [
    {
      id: "monthly-revenue",
      label: "Monthly Revenue",
      value: formatCurrency(stats.monthlyRevenue.value, "USD", 0),
      trend: formatStatPercentage(stats.monthlyRevenue.percentage),
      trendType: "up",
      icon: "monthly-revenue",
    },
    {
      id: "annual-revenue",
      label: "Annual Revenue",
      value: formatCurrency(stats.annualRevenue.value, "USD", 0),
      trend: formatStatPercentage(stats.annualRevenue.percentage),
      trendType: "up",
      icon: "annual-revenue",
    },
    {
      id: "active-plans",
      label: "Active Plans",
      value: stats.activePlans.value.toLocaleString(),
      trend: formatStatPercentage(stats.activePlans.percentage),
      trendType: "up",
      icon: "active-plans",
    },
    {
      id: "expired-plans",
      label: "Expired Plans",
      value: stats.expiredPlans.value.toLocaleString(),
      trend: formatStatPercentage(stats.expiredPlans.percentage),
      trendType: "alert",
      icon: "expired-plans",
      variant: "danger",
    },
  ];
}

export function mapPlanDistribution(items: PlanDistributionRecord[] = []): PlanDistributionItem[] {
  return items.map((item) => ({
    ...PLAN_DISTRIBUTION_UI[item.code],
    label: item.name,
    percentage: item.percentage,
  }));
}
