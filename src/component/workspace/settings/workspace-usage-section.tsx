import React from "react";
import { Link } from "react-router-dom";
import SettingsSection from "../../admin/settings/settings-section";
import QueryErrorState from "../../common/query-error-state";
import { Paragraph, Text, Title } from "../../ui/typography";
import { useAiCreditHistory, useOrganizationUsage } from "../../../hooks/use-billing";
import { formatDate } from "../../../lib/helper";
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
  helperText,
}: {
  label: string;
  used: number;
  limit: number | null;
  unlimited: boolean;
  helperText?: string;
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
            unlimited ? "bg-muted/50" : isNearLimit ? "bg-amber-500" : "bg-primary",
          )}
          style={{ width: unlimited ? "28%" : `${percent}%` }}
        />
      </div>
      <Paragraph size="xs" color="muted" className="mt-2 mb-0!">
        {helperText
          ? helperText
          : unlimited
            ? "No hard cap on your current plan."
            : `${Math.max((limit ?? 0) - used, 0)} remaining on this plan.`}
      </Paragraph>
    </div>
  );
}

function WorkspaceUsageSection({ expanded = false }: WorkspaceUsageSectionProps) {
  const usageQuery = useOrganizationUsage();
  const historyQuery = useAiCreditHistory(25);
  const usage = usageQuery.data;
  const history = historyQuery.data?.data ?? [];

  return (
    <SettingsSection
      id="workspace-usage"
      title="Org Usage"
      description="Track how your organization is using plan limits."
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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
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
              Limits and included features for your current workspace plan.
            </Paragraph>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {usage.metrics.map((metric) => (
              <UsageMeter
                key={metric.key}
                label={metric.label}
                used={metric.used}
                limit={metric.limit}
                unlimited={metric.unlimited}
                helperText={
                  metric.key === "ai_credits"
                    ? metric.unlimited
                      ? "AI credits are unlimited on this plan."
                      : `${Math.max((metric.limit ?? 0) - metric.used, 0)} remaining · resets each month`
                    : undefined
                }
              />
            ))}
          </div>

          <div>
            <Text as="p" size="sm" weight="semibold" className="mb-3!">
              Included features
            </Text>
            {usage.features.length === 0 ? (
              <Paragraph size="sm" color="muted">
                No extra features listed for this plan yet.
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

          <div>
            <Text as="p" size="sm" weight="semibold" className="mb-3!">
              AI credit history
            </Text>
            {historyQuery.isLoading ? (
              <div className="h-24 animate-pulse rounded-xl border border-border bg-muted/20" />
            ) : historyQuery.isError ? (
              <QueryErrorState
                error={historyQuery.error}
                title="Unable to load AI credit history"
                onRetry={() => {
                  void historyQuery.refetch();
                }}
                isRetrying={historyQuery.isFetching}
              />
            ) : history.length === 0 ? (
              <Paragraph size="sm" color="muted">
                No AI credit usage recorded this period yet.
              </Paragraph>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-background text-xs font-semibold tracking-wide text-muted uppercase">
                    <tr>
                      <th className="px-4 py-3">Feature</th>
                      <th className="hidden px-4 py-3 sm:table-cell">User</th>
                      <th className="px-4 py-3 text-right">Credits</th>
                      <th className="hidden px-4 py-3 md:table-cell">When</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {history.map((row) => (
                      <tr key={row.id} className="bg-card">
                        <td className="px-4 py-3 font-medium capitalize text-foreground">
                          {row.feature.replaceAll("-", " ")}
                        </td>
                        <td className="hidden px-4 py-3 text-muted sm:table-cell">{row.userName}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{row.credits}</td>
                        <td className="hidden px-4 py-3 text-muted md:table-cell">
                          {formatDate(row.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </SettingsSection>
  );
}

export default React.memo(WorkspaceUsageSection);
