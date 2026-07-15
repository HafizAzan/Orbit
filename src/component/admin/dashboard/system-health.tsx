import { CheckCircleOutlined, CloseCircleOutlined, GlobalOutlined } from "@ant-design/icons";
import React from "react";
import QueryErrorState from "../../common/query-error-state";
import { useSystemHealth } from "../../../hooks/use-system-health";
import { formatDate } from "../../../lib/helper";
import { cn } from "../../../lib/utils";
import { Paragraph, Text, Title } from "../../ui/typography";

function SystemHealth() {
  const healthQuery = useSystemHealth();
  const health = healthQuery.data;

  return (
    <article className="rounded-2xl border border-border bg-card p-5 lg:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background text-muted shadow-sm">
          <GlobalOutlined className="text-xl" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Title level={5} color="default" className="mb-0! text-base">
              Infrastructure status
            </Title>
            {health ? (
              <span
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                  health.status === "ok"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-amber-200 bg-amber-50 text-amber-700",
                )}
              >
                {health.status === "ok" ? "Healthy" : "Degraded"}
              </span>
            ) : null}
          </div>

          {healthQuery.isLoading ? (
            <Paragraph size="sm" className="mt-2 mb-0! text-muted">
              Checking database, Stripe, and queue…
            </Paragraph>
          ) : healthQuery.isError ? (
            <div className="mt-3">
              <QueryErrorState
                error={healthQuery.error}
                title="Unable to load system health"
                onRetry={() => {
                  void healthQuery.refetch();
                }}
                isRetrying={healthQuery.isFetching}
              />
            </div>
          ) : health ? (
            <>
              <Paragraph size="sm" className="mt-1 mb-0! text-muted">
                Live checks for {health.service}. Last checked {formatDate(health.timestamp)}.
              </Paragraph>
              {health.checks.length === 0 ? (
                <Paragraph size="sm" className="mt-4 mb-0! text-muted">
                  No health checks reported.
                </Paragraph>
              ) : (
                <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                  {health.checks.map((check) => {
                    const isUp = check.status === "up";
                    return (
                      <li
                        key={check.name}
                        className="rounded-xl border border-border bg-background px-3 py-3"
                      >
                        <div className="flex items-center gap-2">
                          {isUp ? (
                            <CheckCircleOutlined className="text-emerald-600" />
                          ) : (
                            <CloseCircleOutlined className="text-red-600" />
                          )}
                          <Text as="span" size="sm" weight="semibold" className="capitalize">
                            {check.name.replaceAll("_", " ")}
                          </Text>
                        </div>
                        <Text as="p" size="xs" color="muted" className="mt-1 mb-0!">
                          {check.detail ??
                            (check.latencyMs != null ? `${check.latencyMs} ms` : check.status)}
                        </Text>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default React.memo(SystemHealth);
