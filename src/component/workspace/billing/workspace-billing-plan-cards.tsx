import React, { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import PricingCard from "../../common/pricing-card";
import { PricingCardsGridSkeleton } from "../../skeletons";
import {
  getWorkspacePlanActionLabel,
  isWorkspaceMockPriceId,
  resolveWorkspaceBillingPlans,
  type WorkspaceBillingPlan,
} from "../../../data/workspace-billing";
import {
  useBillingCatalog,
  useChangePlan,
  useCreateCheckout,
  useCurrentSubscription,
} from "../../../hooks/use-billing";
import { showApiErrorToast, showApiSuccessToast } from "../../../lib/api-error";
import { toast } from "../../../lib/toast";
import { cn } from "../../../lib/utils";
import type { CatalogCtaType, PlanCode } from "../../../types/billing.types";
import SettingsSection from "../../admin/settings/settings-section";

function WorkspaceBillingPlanCards() {
  const queryClient = useQueryClient();
  const { data: catalog, isLoading: catalogLoading } = useBillingCatalog();
  const { data: subscription } = useCurrentSubscription();
  const { mutateAsync: changePlan } = useChangePlan();
  const { mutateAsync: startCheckout } = useCreateCheckout();
  const [pendingPriceId, setPendingPriceId] = useState<string | null>(null);

  const plans = useMemo(() => resolveWorkspaceBillingPlans(catalog?.products), [catalog?.products]);
  const currentPlan: PlanCode = subscription?.plan ?? "ENTERPRISE";

  const handlePlanAction = async (plan: WorkspaceBillingPlan) => {
    if (plan.plan === currentPlan) return;

    if (plan.ctaType === "contact") {
      toast.info("Our sales team will reach out shortly.");
      return;
    }

    setPendingPriceId(plan.priceId);

    try {
      if (isWorkspaceMockPriceId(plan.priceId)) {
        toast.success(`Plan updated to ${plan.name}.`);
        return;
      }

      if (subscription?.stripeSubscriptionId) {
        const result = await changePlan({ priceId: plan.priceId });
        showApiSuccessToast(result.message);
      } else {
        const result = await startCheckout({ priceId: plan.priceId });
        showApiSuccessToast(result.message);
        window.location.assign(result.url);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["billing-subscription"] });
      await queryClient.invalidateQueries({ queryKey: ["billing-invoices"] });
    } catch (error) {
      showApiErrorToast(error);
    } finally {
      setPendingPriceId(null);
    }
  };

  const renderPlanFooter = (plan: WorkspaceBillingPlan, ctaType: CatalogCtaType) => {
    const isCurrent = plan.plan === currentPlan;
    const isLoadingAction = pendingPriceId === plan.priceId;
    const actionLabel = isCurrent
      ? "Current plan"
      : isLoadingAction
        ? "Processing..."
        : ctaType === "contact"
          ? "Contact sales"
          : getWorkspacePlanActionLabel(currentPlan, plan.plan);

    return (
      <button
        type="button"
        disabled={isCurrent || isLoadingAction}
        onClick={() => {
          void handlePlanAction(plan);
        }}
        className={cn(
          "block w-full rounded-xl px-5 py-3.5 text-center text-sm font-semibold transition-opacity",
          isCurrent
            ? "cursor-default border border-emerald-200 bg-emerald-50 text-emerald-700"
            : plan.highlighted
              ? "bg-primary text-white hover:opacity-90 disabled:opacity-60"
              : "border border-border bg-card text-foreground hover:border-primary hover:text-primary disabled:opacity-60",
        )}
      >
        {actionLabel}
      </button>
    );
  };

  return (
    <SettingsSection
      id="workspace-plans"
      title="Plans & Pricing"
      description="Compare plans and upgrade or switch your workspace subscription."
    >
      {catalogLoading ? (
        <PricingCardsGridSkeleton count={3} />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
          {plans.map((plan) => {
            const isCurrent = plan.plan === currentPlan;

            return (
              <PricingCard
                key={plan.id}
                name={plan.name}
                description={plan.description}
                price={plan.price}
                priceSuffix={plan.priceSuffix}
                features={plan.features.length > 0 ? plan.features : ["Plan details coming soon"]}
                ctaLabel={plan.ctaLabel}
                highlighted={plan.highlighted && !isCurrent}
                badge={isCurrent ? "Current plan" : plan.badge}
                footer={renderPlanFooter(plan, plan.ctaType)}
                className={cn("h-full", isCurrent && "border-emerald-300 ring-1 ring-emerald-200")}
              />
            );
          })}
        </div>
      )}
    </SettingsSection>
  );
}

export default React.memo(WorkspaceBillingPlanCards);
