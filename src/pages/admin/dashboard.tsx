import React from "react";
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
import { DASHBOARD_METRICS, GROWTH_STATS, RECENT_ACTIVITY, REVENUE_CHART_DATA, SYSTEM_REGIONS } from "../../data/admin-dashboard";
import useUrlTab from "../../hooks/use-url-tab";

function AdminDashboard() {
  const { activeTab, setActiveTab } = useUrlTab<DashboardViewTab>({
    slugToKey: DASHBOARD_VIEW_TAB_SLUGS,
    defaultKey: DEFAULT_DASHBOARD_VIEW_TAB,
  });

  return (
    <div className="mx-auto max-w-8xl">
      <PlatformOverviewHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "dashboard" ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {DASHBOARD_METRICS.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>

          <div className="mt-6">
            <RevenueChart data={REVENUE_CHART_DATA} />
          </div>

          <div className="mt-6">
            <RecentActivity items={RECENT_ACTIVITY} />
          </div>

          <div className="mt-6">
            <SystemHealth regions={SYSTEM_REGIONS} />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <GrowthForecastCard />
            {GROWTH_STATS.map((stat) => (
              <GrowthStatCard key={stat.id} stat={stat} />
            ))}
          </div>

          <div className="mt-6">
            <ChurnRateCard />
          </div>

          <div className="mt-6">
            <DashboardInsightsSection />
          </div>
        </>
      )}
    </div>
  );
}

export default React.memo(AdminDashboard);
