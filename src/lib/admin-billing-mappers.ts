import type { OrganizationStat } from "../data/admin-organizations";
import type { OrganizationStats } from "../api-services/admin-organizations.service";
import type { PlanDistributionItem, SubscriptionStat } from "../data/admin-subscriptions";
import type {
  PlanDistributionRecord,
  SubscriptionStats,
} from "../api-services/admin-subscriptions.service";
import { formatCurrency } from "./helper";

const PLAN_DISTRIBUTION_UI: Record<
  PlanDistributionRecord["plan"],
  Pick<PlanDistributionItem, "id" | "label" | "color" | "barColor">
> = {
  ENTERPRISE: {
    id: "enterprise",
    label: "Enterprise",
    color: "text-violet-700",
    barColor: "bg-violet-500",
  },
  BUSINESS: {
    id: "business",
    label: "Business",
    color: "text-sky-700",
    barColor: "bg-sky-500",
  },
  PRO: {
    id: "pro",
    label: "Pro",
    color: "text-indigo-700",
    barColor: "bg-indigo-500",
  },
  FREE: {
    id: "free",
    label: "Free",
    color: "text-slate-600",
    barColor: "bg-slate-400",
  },
};

export function mapOrganizationStats(stats?: OrganizationStats): OrganizationStat[] {
  if (!stats) return [];

  return [
    {
      id: "total",
      label: "Total Organizations",
      value: stats.total.toLocaleString(),
      trend: "Live",
      trendType: "stable",
      icon: "total",
    },
    {
      id: "active",
      label: "Active Organizations",
      value: stats.active.toLocaleString(),
      trend: "Live",
      trendType: "up",
      icon: "active",
    },
    {
      id: "trial",
      label: "Trial Organizations",
      value: stats.trial.toLocaleString(),
      trend: "Live",
      trendType: "stable",
      icon: "trial",
    },
    {
      id: "suspended",
      label: "Suspended Organizations",
      value: stats.suspended.toLocaleString(),
      trend: "Live",
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
      value: formatCurrency(stats.monthlyRevenue, "USD", 0),
      trend: "Live",
      trendType: "up",
      icon: "monthly-revenue",
    },
    {
      id: "annual-revenue",
      label: "Annual Revenue",
      value: formatCurrency(stats.annualRevenue, "USD", 0),
      trend: "Live",
      trendType: "up",
      icon: "annual-revenue",
    },
    {
      id: "active-plans",
      label: "Active Plans",
      value: stats.activePlans.toLocaleString(),
      trend: "Live",
      trendType: "up",
      icon: "active-plans",
    },
    {
      id: "expired-plans",
      label: "Expired Plans",
      value: stats.expiredPlans.toLocaleString(),
      trend: "Live",
      trendType: "alert",
      icon: "expired-plans",
      variant: "danger",
    },
  ];
}

export function mapPlanDistribution(items: PlanDistributionRecord[] = []): PlanDistributionItem[] {
  return items.map((item) => ({
    ...PLAN_DISTRIBUTION_UI[item.plan],
    percentage: item.percentage,
  }));
}
