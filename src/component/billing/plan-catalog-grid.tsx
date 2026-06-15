import { Spin } from "antd";
import React, { useMemo, useState } from "react";
import PricingCard from "../common/pricing-card";
import AnimateOnScroll from "../common/animate-on-scroll";
import { Paragraph } from "../ui/typography";
import { useBillingCatalog, useCreateCheckout } from "../../hooks/use-billing";
import { showApiErrorToast, showApiSuccessToast } from "../../lib/api-error";
import { mapCatalogToPricingPlans } from "../../lib/pricing-catalog";
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
      const result = await startCheckout({ priceId });
      showApiSuccessToast(result.message);
      window.location.assign(result.url);
    } catch (error) {
      showApiErrorToast(error);
      setPendingPriceId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spin size="large" />
      </div>
    );
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
