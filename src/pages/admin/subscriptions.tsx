import { DownloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import PlanDistributionCard from "../../component/admin/subscriptions/plan-distribution-card";
import RevenueOverviewChart from "../../component/admin/subscriptions/revenue-overview-chart";
import SubscriptionStatCard from "../../component/admin/subscriptions/subscription-stat-card";
import SubscriptionsTable from "../../component/admin/subscriptions/subscriptions-table";
import { Paragraph, Title } from "../../component/ui/typography";
import { PLAN_DISTRIBUTION, SUBSCRIPTION_REVENUE_DATA, SUBSCRIPTION_STATS } from "../../data/admin-subscriptions";

function AdminSubscriptions() {
  return (
    <div className="mx-auto max-w-8xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Title level={2} className="text-2xl text-foreground lg:text-3xl">
            Subscription Management
          </Title>
          <Paragraph size="sm" className="mt-1 text-muted">
            Monitor billing performance, plan distribution, and subscription lifecycle across all organizations.
          </Paragraph>
        </div>

        <Button type="primary" icon={<DownloadOutlined />} size="large" className="font-semibold!">
          Export Report
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {SUBSCRIPTION_STATS.map((stat) => (
          <SubscriptionStatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueOverviewChart data={SUBSCRIPTION_REVENUE_DATA} />
        </div>
        <PlanDistributionCard items={PLAN_DISTRIBUTION} />
      </div>

      <SubscriptionsTable />
    </div>
  );
}

export default React.memo(AdminSubscriptions);
