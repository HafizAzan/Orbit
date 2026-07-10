import { AuditOutlined, FlagOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import PageSeo from "../../component/seo/page-seo";
import { Link } from "react-router-dom";
import ActivityReviewTable from "../../component/admin/activity/activity-review-table";
import { Paragraph, Text, Title } from "../../component/ui/typography";
import { useAdminActivity } from "../../context/admin-activity-context";
import { ADMIN_ROUTES } from "../../router/admin-routes";

function AdminActivityReview() {
  const { flaggedCount } = useAdminActivity();

  return (
    <div className="mx-auto max-w-8xl">
      <PageSeo title="Activity Review" description="Review flagged platform activity and resolve issues." noIndex />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Title level={2} className="text-2xl text-foreground lg:text-3xl">
            Manual Review Queue
          </Title>
          <Paragraph size="sm" className="mt-1 text-muted">
            Review flagged platform events, resolve issues, or remove flags when no action is needed.
          </Paragraph>
        </div>

        <Link to={ADMIN_ROUTES.ACTIVITY}>
          <Button icon={<AuditOutlined />} size="large" className="font-semibold!">
            All Activity Logs
          </Button>
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <FlagOutlined className="text-lg" />
          </div>
          <Text as="p" size="sm" color="muted" weight="medium" className="mt-4">Pending review</Text>
          <Text as="p" className="mt-1 text-2xl font-bold tracking-tight text-amber-800 lg:text-3xl">{flaggedCount}</Text>
        </article>

        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:col-span-2">
          <Text as="p" size="sm" weight="semibold">How review works</Text>
          <Paragraph size="sm" className="mt-2 mb-0! text-muted">
            Events flagged from Activity Logs appear here. Inspect details, mark as resolved when handled, or remove the
            flag if it was added by mistake.
          </Paragraph>
        </article>
      </div>

      <ActivityReviewTable />
    </div>
  );
}

export default React.memo(AdminActivityReview);
