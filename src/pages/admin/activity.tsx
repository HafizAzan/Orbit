import { DownloadOutlined, FlagOutlined } from "@ant-design/icons";
import { Badge, Button } from "antd";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import ActivityStatCard from "../../component/admin/activity/activity-stat-card";
import ActivityTable from "../../component/admin/activity/activity-table";
import { Paragraph, Title } from "../../component/ui/typography";
import { ACTIVITY_STATS } from "../../data/admin-activity";
import { useAdminActivity } from "../../context/admin-activity-context";
import { ADMIN_ROUTES } from "../../router/admin-routes";

function AdminActivity() {
  const { flaggedCount } = useAdminActivity();

  const stats = useMemo(
    () =>
      ACTIVITY_STATS.map((stat) =>
        stat.id === "critical"
          ? {
              ...stat,
              value: String(flaggedCount),
              meta: flaggedCount === 1 ? "Needs review" : flaggedCount > 0 ? "Needs review" : "All clear",
              metaVariant: flaggedCount > 0 ? ("danger" as const) : ("muted" as const),
              variant: flaggedCount > 0 ? ("danger" as const) : undefined,
            }
          : stat,
      ),
    [flaggedCount],
  );

  return (
    <div className="mx-auto max-w-8xl">
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

          <Button type="primary" icon={<DownloadOutlined />} size="large" className="font-semibold!">
            Export Logs
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <ActivityStatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <ActivityTable />
    </div>
  );
}

export default React.memo(AdminActivity);
