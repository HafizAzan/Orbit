import React from "react";
import { Link } from "react-router-dom";
import SettingsSection from "../../admin/settings/settings-section";
import QueryErrorState from "../../common/query-error-state";
import { Paragraph, Text, Title } from "../../ui/typography";
import { useOrganizationUsage } from "../../../hooks/use-billing";
import { formatUsageLimit, usagePercent } from "../../../lib/plan-features";
import { WORKSPACE_ROUTES } from "../../../router/workspace-routes";
import { cn } from "../../../lib/utils";

type WorkspaceUsageSectionProps = {
  expanded?: boolean;
};

function UsageMeter({
  label,
  used,
  limit,
  unlimited,
}: {
  label: string;
  used: number;
  limit: number | null;
  unlimited: boolean;
}) {
  const percent = usagePercent(used, limit, unlimited);
  const isNearLimit = !unlimited && limit != null && used / limit >= 0.8;

  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <Text as="p" size="sm" weight="semibold" className="mb-0!">
          {label}
        </Text>
        <Text as="p" size="sm" weight="medium" className="mb-0! tabular-nums">
          {formatUsageLimit(used, limit, unlimited)}
        </Text>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted/30">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            unlimited ? "bg-primary/40" : isNearLimit ? "bg-amber-500" : "bg-primary",
          )}
          style={{ width: unlimited ? "100%" : `${percent}%` }}
        />
      </div>
      <Paragraph size="xs" color="muted" className="mt-2 mb-0!">
        {unlimited
          ? "No hard cap on your current plan."
          : `${Math.max((limit ?? 0) - used, 0)} remaining on this plan.`}
      </Paragraph>
    </div>
  );
}

function WorkspaceUsageSection({ expanded = false }: WorkspaceUsageSectionProps) {
  const usageQuery = useOrganizationUsage();
  const usage = usageQuery.data;

  return (
    <SettingsSection
      id="workspace-usage"
      title="Org Usage"
      description="Track how your organization is using plan limits from Stripe metadata."
      className={expanded ? undefined : "mt-6"}
      action={
        <Link
          to={WORKSPACE_ROUTES.BILLING}
          className="text-sm font-semibold text-primary hover:underline"
        >
          Manage plan
        </Link>
      }
    >
      {usageQuery.isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-xl border border-border bg-muted/20" />
          ))}
        </div>
      ) : usageQuery.isError ? (
        <QueryErrorState
          error={usageQuery.error}
          title="Unable to load organization usage"
          onRetry={() => {
            void usageQuery.refetch();
          }}
          isRetrying={usageQuery.isFetching}
        />
      ) : !usage ? (
        <Paragraph size="sm" color="muted">
          Usage details are unavailable right now.
        </Paragraph>
      ) : (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-background p-4">
            <Title level={5} className="mb-1!">
              {usage.productName ?? usage.plan}
            </Title>
            <Paragraph size="sm" color="muted" className="mb-0!">
              Current plan limits come from Stripe product metadata and marketing features.
            </Paragraph>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {usage.metrics.map((metric) => (
              <UsageMeter
                key={metric.key}
                label={metric.label}
                used={metric.used}
                limit={metric.limit}
                unlimited={metric.unlimited}
              />
            ))}
          </div>

          <div>
            <Text as="p" size="sm" weight="semibold" className="mb-3!">
              Included features
            </Text>
            {usage.features.length === 0 ? (
              <Paragraph size="sm" color="muted">
                No marketing features configured on this Stripe product yet.
              </Paragraph>
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2">
                {usage.features.map((feature) => (
                  <li
                    key={feature}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </SettingsSection>
  );
}

export default React.memo(WorkspaceUsageSection);
