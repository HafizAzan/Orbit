import { DownloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useCallback, useState } from "react";
import PlanDistributionCard from "../../component/admin/subscriptions/plan-distribution-card";
import RevenueOverviewChart from "../../component/admin/subscriptions/revenue-overview-chart";
import SubscriptionEditBillingModal from "../../component/admin/subscriptions/subscription-edit-billing-modal";
import SubscriptionStatCard from "../../component/admin/subscriptions/subscription-stat-card";
import SubscriptionsTable from "../../component/admin/subscriptions/subscriptions-table";
import { AdminSubscriptionsPageSkeleton } from "../../component/skeletons";
import { Paragraph, Title } from "../../component/ui/typography";
import { SUBSCRIPTION_REVENUE_DATA, type SubscriptionRecord } from "../../data/admin-subscriptions";
import {
  usePlanDistribution,
  useSubscriptionStats,
  useSubscriptions,
} from "../../hooks/use-admin-subscriptions";
import { mapPlanDistribution, mapSubscriptionStats } from "../../lib/admin-billing-mappers";

function AdminSubscriptions() {
  const { data: subscriptions = [], isLoading } = useSubscriptions();
  const { data: stats } = useSubscriptionStats();
  const { data: planDistribution = [] } = usePlanDistribution();
  const [editBillingOpen, setEditBillingOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<SubscriptionRecord | null>(null);

  const subscriptionStats = mapSubscriptionStats(stats);
  const planDistributionItems = mapPlanDistribution(planDistribution);

  const handleOpenEditBilling = useCallback((record: SubscriptionRecord) => {
    setEditingSubscription(record);
    setEditBillingOpen(true);
  }, []);

  const handleCloseEditBilling = useCallback(() => {
    setEditBillingOpen(false);
    setEditingSubscription(null);
  }, []);

  if (isLoading) {
    return <AdminSubscriptionsPageSkeleton />;
  }

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
        {subscriptionStats.map((stat) => (
          <SubscriptionStatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueOverviewChart data={SUBSCRIPTION_REVENUE_DATA} />
        </div>
        <PlanDistributionCard items={planDistributionItems} />
      </div>

      <SubscriptionsTable data={subscriptions} onEditBilling={handleOpenEditBilling} />

      <SubscriptionEditBillingModal
        open={editBillingOpen}
        record={editingSubscription}
        onClose={handleCloseEditBilling}
      />
    </div>
  );
}

export default React.memo(AdminSubscriptions);
