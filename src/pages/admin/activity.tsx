import { FlagOutlined } from "@ant-design/icons";
import { Badge, Button } from "antd";
import React, { useMemo } from "react";
import PageSeo from "../../component/seo/page-seo";
import { Link } from "react-router-dom";
import ActivityStatCard from "../../component/admin/activity/activity-stat-card";
import ActivityTable from "../../component/admin/activity/activity-table";
import { Paragraph, Title } from "../../component/ui/typography";
import { useAdminActivity } from "../../context/admin-activity-context";
import { useAdminActivityStats } from "../../hooks/use-admin-activity";
import { ADMIN_ROUTES } from "../../router/admin-routes";
import type { ActivityStat } from "../../data/admin-activity";

function AdminActivity() {
  const { flaggedCount } = useAdminActivity();
  const { data: stats } = useAdminActivityStats();

  const activityStats: ActivityStat[] = useMemo(() => {
    if (!stats) {
      return [
        {
          id: "critical",
          label: "Flagged",
          value: String(flaggedCount),
          meta: flaggedCount > 0 ? "Needs review" : "All clear",
          metaVariant: flaggedCount > 0 ? "danger" : "muted",
          icon: "critical",
          variant: flaggedCount > 0 ? "danger" : undefined,
        },
      ];
    }

    return [
      {
        id: "total",
        label: "Total Events",
        value: String(stats.total.value),
        meta: "All time",
        metaVariant: "muted",
        icon: "events",
      },
      {
        id: "today",
        label: "Today",
        value: String(stats.today.value),
        meta: `${stats.today.percentage}%`,
        metaVariant: "primary",
        icon: "users",
      },
      {
        id: "resolved",
        label: "Resolved",
        value: String(stats.resolved.value),
        meta: `${stats.resolved.percentage}%`,
        metaVariant: "muted",
        icon: "system",
      },
      {
        id: "critical",
        label: "Flagged",
        value: String(stats.flagged.value),
        meta: stats.flagged.value > 0 ? "Needs review" : "All clear",
        metaVariant: stats.flagged.value > 0 ? "danger" : "muted",
        icon: "critical",
        variant: stats.flagged.value > 0 ? "danger" : undefined,
      },
    ];
  }, [stats, flaggedCount]);

  return (
    <div className="mx-auto max-w-8xl">
      <PageSeo title="Activity Log" description="Monitor all platform activity and events." noIndex />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Title level={2} className="text-2xl text-foreground lg:text-3xl">
            Activity Logs
          </Title>
          <Paragraph size="sm" className="mt-1 text-muted">
            Monitor platform-wide events, alerts, and audit trails across all organizations.
          </Paragraph>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to={ADMIN_ROUTES.ACTIVITY_REVIEW}>
            <Badge count={flaggedCount} size="small" offset={[-6, 6]}>
              <Button icon={<FlagOutlined />} size="large" className="font-semibold!">
                Review Queue
              </Button>
            </Badge>
          </Link>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {activityStats.map((stat) => (
          <ActivityStatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <ActivityTable />
    </div>
  );
}

export default React.memo(AdminActivity);
