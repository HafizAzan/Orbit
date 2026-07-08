import React from "react";
import { Link } from "react-router-dom";
import { CreditCardOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { Paragraph, Text } from "../../ui/typography";
import { useCurrentSubscription } from "../../../hooks/use-billing";
import { useOrganizationTwoFactorStatus } from "../../../hooks/use-organization-two-factor";
import { WORKSPACE_ROUTES } from "../../../router/workspace-routes";

function OwnerOrgHealthCard() {
  const subscriptionQuery = useCurrentSubscription();
  const twoFactorQuery = useOrganizationTwoFactorStatus();
  const subscription = subscriptionQuery.data;
  const twoFactor = twoFactorQuery.data;

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <CreditCardOutlined />
          </span>
          <div className="min-w-0 flex-1">
            <Text as="p" weight="semibold">
              Subscription
            </Text>
            <Paragraph size="sm" className="mt-1 text-muted">
              {subscription
                ? `${subscription.plan} · ${subscription.status.replace(/_/g, " ")}`
                : "Loading subscription..."}
            </Paragraph>
            <Link
              to={WORKSPACE_ROUTES.BILLING}
              className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline"
            >
              Manage billing
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <SafetyCertificateOutlined />
          </span>
          <div className="min-w-0 flex-1">
            <Text as="p" weight="semibold">
              Workspace security
            </Text>
            <Paragraph size="sm" className="mt-1 text-muted">
              Org 2FA:{" "}
              {twoFactor?.configured
                ? twoFactor.requiredByWorkspace
                  ? "Required for all sign-ins"
                  : "Configured (optional)"
                : "Not configured yet"}
            </Paragraph>
            <Link
              to={WORKSPACE_ROUTES.SETTINGS}
              className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline"
            >
              Open security settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(OwnerOrgHealthCard);
