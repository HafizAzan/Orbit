import { DownloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import ActivityStatCard from "../../component/admin/activity/activity-stat-card";
import ActivityTable from "../../component/admin/activity/activity-table";
import { Paragraph, Title } from "../../component/ui/typography";
import { ACTIVITY_STATS } from "../../data/admin-activity";

function AdminActivity() {
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

        <Button type="primary" icon={<DownloadOutlined />} size="large" className="font-semibold!">
          Export Logs
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ACTIVITY_STATS.map((stat) => (
          <ActivityStatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <ActivityTable />
    </div>
  );
}

export default React.memo(AdminActivity);
