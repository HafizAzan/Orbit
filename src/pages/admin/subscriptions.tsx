import React, { useCallback, useState } from "react";
import PageSeo from "../../component/seo/page-seo";
import PlanDistributionCard from "../../component/admin/subscriptions/plan-distribution-card";
import RevenueOverviewChart from "../../component/admin/subscriptions/revenue-overview-chart";
import SubscriptionEditBillingModal from "../../component/admin/subscriptions/subscription-edit-billing-modal";
import SubscriptionStatCard from "../../component/admin/subscriptions/subscription-stat-card";
import SubscriptionsTable from "../../component/admin/subscriptions/subscriptions-table";
import { AdminSubscriptionsPageSkeleton } from "../../component/skeletons";
import { Paragraph, Title } from "../../component/ui/typography";
import {
  DEFAULT_SUBSCRIPTION_TAB,
  SUBSCRIPTIONS_PAGE_SIZE,
  SUBSCRIPTION_TAB_SLUGS,
  type SubscriptionRecord,
  type SubscriptionTabKey,
} from "../../data/admin-subscriptions";
import {
  usePlanDistribution,
  useSubscriptionRevenueSeries,
  useSubscriptionStats,
  useSubscriptions,
} from "../../hooks/use-admin-subscriptions";
import useUrlTab from "../../hooks/use-url-tab";
import { mapPlanDistribution, mapSubscriptionStats } from "../../lib/admin-billing-mappers";

function AdminSubscriptions() {
  const [page, setPage] = useState(1);
  const { activeTab, setActiveTab } = useUrlTab<SubscriptionTabKey>({
    slugToKey: SUBSCRIPTION_TAB_SLUGS,
    defaultKey: DEFAULT_SUBSCRIPTION_TAB,
  });
  const { data: subscriptionsPage, isLoading } = useSubscriptions({
    page,
    limit: SUBSCRIPTIONS_PAGE_SIZE,
    status: activeTab,
  });
  const subscriptions = subscriptionsPage?.data ?? [];
  const totalSubscriptions = subscriptionsPage?.total ?? 0;
  const { data: stats } = useSubscriptionStats();
  const { data: planDistribution = [] } = usePlanDistribution();
  const { data: revenueSeries = [] } = useSubscriptionRevenueSeries();
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

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleTabChange = useCallback((tab: SubscriptionTabKey) => {
    setActiveTab(tab);
    setPage(1);
  }, [setActiveTab]);

  if (isLoading) {
    return <AdminSubscriptionsPageSkeleton />;
  }

  return (
    <div className="mx-auto max-w-8xl">
      <PageSeo title="Subscriptions" description="Manage platform billing and subscriptions." noIndex />
      <div className="mb-6">
        <Title level={2} className="text-2xl text-foreground lg:text-3xl">
          Subscription Management
        </Title>
        <Paragraph size="sm" className="mt-1 text-muted">
          Monitor billing performance, plan distribution, and subscription lifecycle across all organizations.
        </Paragraph>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {subscriptionStats.map((stat) => (
          <SubscriptionStatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueOverviewChart data={revenueSeries} />
        </div>
        <PlanDistributionCard items={planDistributionItems} />
      </div>

      <SubscriptionsTable
        data={subscriptions}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onEditBilling={handleOpenEditBilling}
        serverPagination={{
          page: subscriptionsPage?.page ?? page,
          pageSize: subscriptionsPage?.limit ?? SUBSCRIPTIONS_PAGE_SIZE,
          total: totalSubscriptions,
          onChange: handlePageChange,
        }}
      />

      <SubscriptionEditBillingModal
        open={editBillingOpen}
        record={editingSubscription}
        onClose={handleCloseEditBilling}
      />
    </div>
  );
}

export default React.memo(AdminSubscriptions);
