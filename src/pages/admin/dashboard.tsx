import React, { useMemo } from "react";
import PageSeo from "../../component/seo/page-seo";
import ChurnRateCard from "../../component/admin/dashboard/churn-rate-card";
import DashboardInsightsSection from "../../component/admin/dashboard/dashboard-insights-section";
import GrowthForecastCard from "../../component/admin/dashboard/growth-forecast-card";
import { GrowthStatCard } from "../../component/admin/dashboard/growth-stats";
import MetricCard from "../../component/admin/dashboard/metric-card";
import PlatformOverviewHeader, {
  DASHBOARD_VIEW_TAB_SLUGS,
  DEFAULT_DASHBOARD_VIEW_TAB,
  type DashboardViewTab,
} from "../../component/admin/dashboard/platform-overview-header";
import RecentActivity from "../../component/admin/dashboard/recent-activity";
import RevenueChart from "../../component/admin/dashboard/revenue-chart";
import SystemHealth from "../../component/admin/dashboard/system-health";
import AdminAskPlatformCard from "../../component/admin/dashboard/admin-ask-platform-card";
import {
  useAdminDashboardOverview,
  useAdminDashboardRevenueSeries,
} from "../../hooks/use-admin-dashboard";
import useUrlTab from "../../hooks/use-url-tab";
import { AdminListPageSkeleton } from "../../component/skeletons";

function AdminDashboard() {
  const { activeTab, setActiveTab } = useUrlTab<DashboardViewTab>({
    slugToKey: DASHBOARD_VIEW_TAB_SLUGS,
    defaultKey: DEFAULT_DASHBOARD_VIEW_TAB,
  });
  const { data: overview, isLoading } = useAdminDashboardOverview();
  const { data: revenueSeries = [] } = useAdminDashboardRevenueSeries();

  const churn = useMemo(
    () => ({
      value: overview?.churnRate ?? 0,
      label: (overview?.churnRate ?? 0) < 5 ? "Healthy" : "Watch",
      helperText: "Based on suspended organizations vs total organizations.",
    }),
    [overview?.churnRate],
  );

  const forecast = useMemo(
    () => ({
      target: `${overview?.growthForecast ?? 0}%`,
      helperText: "Growth index from new organizations this month.",
    }),
    [overview?.growthForecast],
  );

  if (isLoading || !overview) {
    return <AdminListPageSkeleton />;
  }

  return (
    <div className="mx-auto max-w-8xl">
      <PageSeo title="Admin Dashboard" description="Platform overview and analytics." noIndex />
      <PlatformOverviewHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "dashboard" ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {overview.metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>

          <div className="mt-6">
            <AdminAskPlatformCard />
          </div>

          <div className="mt-6">
            <RevenueChart data={revenueSeries} />
          </div>

          <div className="mt-6">
            <RecentActivity items={overview.recentActivity} />
          </div>

          <div className="mt-6">
            <SystemHealth />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <GrowthForecastCard forecast={forecast} />
            {overview.growthStats.map((stat) => (
              <GrowthStatCard key={stat.id} stat={stat} />
            ))}
          </div>

          <div className="mt-6">
            <ChurnRateCard churn={churn} />
          </div>

          <div className="mt-6">
            <DashboardInsightsSection
              topOrgs={overview.topOrgs}
              recentSignups={overview.recentSignups}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default React.memo(AdminDashboard);
