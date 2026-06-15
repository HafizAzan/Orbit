import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PricingCard from "../common/pricing-card";
import AnimateOnScroll from "../common/animate-on-scroll";
import { PricingCardsGridSkeleton } from "../skeletons";
import { Paragraph } from "../ui/typography";
import { useBillingCatalog, useCreateCheckout, useSelectPlan } from "../../hooks/use-billing";
import { getMe } from "../../api-services/auth.service";
import { showApiErrorToast, showApiSuccessToast } from "../../lib/api-error";
import { saveStoredUser } from "../../lib/auth-session";
import { mapCatalogToPricingPlans } from "../../lib/pricing-catalog";
import { useAppContext } from "../../context/app-context";
import { WORKSPACE_ROUTES } from "../../router/workspace-routes";
import type { CatalogCtaType } from "../../types/billing.types";

type PlanCatalogGridProps = {
  mode: "public" | "onboarding";
  onContact?: () => void;
  onRequireAuth?: (ctaType: CatalogCtaType) => void;
};

function PlanCatalogGrid({
  mode,
  onContact,
  onRequireAuth,
}: PlanCatalogGridProps) {
  const { data, isLoading, isError } = useBillingCatalog();
  const { mutateAsync: startCheckout } = useCreateCheckout();
  const { mutateAsync: activatePlan } = useSelectPlan();
  const app = useAppContext();
  const navigate = useNavigate();
  const [pendingPriceId, setPendingPriceId] = useState<string | null>(null);

  const plans = useMemo(() => mapCatalogToPricingPlans(data?.products ?? []), [data?.products]);

  const handlePlanAction = async (priceId: string, ctaType: CatalogCtaType) => {
    if (ctaType === "contact") {
      onContact?.();
      return;
    }

    if (mode === "public") {
      onRequireAuth?.(ctaType);
      return;
    }

    setPendingPriceId(priceId);

    try {
      if (ctaType === "register") {
        const result = await activatePlan({ priceId });
        const freshUser = await getMe();
        saveStoredUser(freshUser);
        app?.setUser(freshUser);
        showApiSuccessToast(result.message);

        if (!freshUser.requiresPlanSelection) {
          navigate(WORKSPACE_ROUTES.DASHBOARD, { replace: true });
        }

        return;
      }

      const result = await startCheckout({ priceId });
      showApiSuccessToast(result.message);
      window.location.assign(result.url);
    } catch (error) {
      showApiErrorToast(error);
    } finally {
      setPendingPriceId(null);
    }
  };

  if (isLoading) {
    return <PricingCardsGridSkeleton count={3} />;
  }

  if (isError || plans.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
        <Paragraph color="muted">
          Pricing plans are unavailable right now. Add active Stripe products with prices and metadata to show
          plans here.
        </Paragraph>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 nav:grid-cols-3 nav:items-stretch nav:gap-6 nav:py-4">
      {plans.map((plan, index) => {
        const isLoadingAction = pendingPriceId === plan.priceId;

        return (
          <AnimateOnScroll key={plan.id} variant="fade-up" delay={index * 120} className="h-full">
            <PricingCard
              name={plan.name}
              description={plan.description}
              price={plan.price}
              priceSuffix={plan.priceSuffix}
              features={plan.features.length > 0 ? plan.features : ["Plan details coming soon"]}
              ctaLabel={isLoadingAction ? "Processing..." : plan.ctaLabel}
              highlighted={plan.highlighted}
              badge={plan.badge}
              onCtaClick={
                isLoadingAction
                  ? undefined
                  : () => {
                      void handlePlanAction(plan.priceId, plan.ctaType);
                    }
              }
              className="h-full"
            />
          </AnimateOnScroll>
        );
      })}
    </div>
  );
}

export default React.memo(PlanCatalogGrid);
