import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import PricingCard from "../../common/pricing-card";
import PricingIntervalToggle from "../../billing/pricing-interval-toggle";
import { PricingCardsGridSkeleton } from "../../skeletons";
import QueryErrorState from "../../common/query-error-state";
import {
  getWorkspacePlanActionLabel,
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
import {
  resolveCatalogSavingsHint,
  type PricingBillingInterval,
} from "../../../lib/pricing-catalog";
import { cn } from "../../../lib/utils";
import type { CatalogCtaType, PlanCode } from "../../../types/billing.types";
import SettingsSection from "../../admin/settings/settings-section";
import { Paragraph } from "../../ui/typography";

function WorkspaceBillingPlanCards() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const catalogQuery = useBillingCatalog();
  const { data: subscription } = useCurrentSubscription();
  const { mutateAsync: changePlan } = useChangePlan();
  const { mutateAsync: startCheckout } = useCreateCheckout();
  const [pendingPriceId, setPendingPriceId] = useState<string | null>(null);
  const [billingInterval, setBillingInterval] = useState<PricingBillingInterval>("monthly");
  const [canSlidePrev, setCanSlidePrev] = useState(false);
  const [canSlideNext, setCanSlideNext] = useState(false);
  const swiperRef = useRef<SwiperInstance | null>(null);

  const products = catalogQuery.data?.products ?? [];
  const plans = useMemo(
    () => resolveWorkspaceBillingPlans(products, billingInterval),
    [billingInterval, products],
  );
  const savingsHint = useMemo(() => resolveCatalogSavingsHint(products), [products]);
  const currentPlan: PlanCode = subscription?.plan ?? "FREE";
  const showSliderControls = plans.length > 3;

  const syncNavState = (swiper: SwiperInstance) => {
    setCanSlidePrev(!swiper.isBeginning);
    setCanSlideNext(!swiper.isEnd);
  };

  const handlePlanAction = async (plan: WorkspaceBillingPlan) => {
    if (plan.plan === currentPlan) return;

    if (plan.ctaType === "contact") {
      navigate("/contact?subject=enterprise");
      return;
    }

    setPendingPriceId(plan.priceId);

    try {
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
      {catalogQuery.isLoading ? (
        <PricingCardsGridSkeleton count={3} />
      ) : catalogQuery.isError ? (
        <QueryErrorState
          error={catalogQuery.error}
          title="Unable to load billing plans"
          onRetry={() => {
            void catalogQuery.refetch();
          }}
          isRetrying={catalogQuery.isFetching}
        />
      ) : plans.length === 0 ? (
        <Paragraph size="sm" className="text-muted">
          Billing plans are not available right now. Please try again later.
        </Paragraph>
      ) : (
        <div className="space-y-6">
          <PricingIntervalToggle
            value={billingInterval}
            onChange={setBillingInterval}
            savingsHint={savingsHint}
          />

          <div className="relative px-0 nav:px-6">
            {showSliderControls ? (
              <>
                <button
                  type="button"
                  aria-label="Previous plans"
                  disabled={!canSlidePrev}
                  onClick={() => swiperRef.current?.slidePrev()}
                  className={cn(
                    "absolute top-1/2 left-0 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition hover:border-primary hover:text-primary nav:flex",
                    !canSlidePrev && "pointer-events-none opacity-40",
                  )}
                >
                  <LeftOutlined />
                </button>
                <button
                  type="button"
                  aria-label="Next plans"
                  disabled={!canSlideNext}
                  onClick={() => swiperRef.current?.slideNext()}
                  className={cn(
                    "absolute top-1/2 right-0 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition hover:border-primary hover:text-primary nav:flex",
                    !canSlideNext && "pointer-events-none opacity-40",
                  )}
                >
                  <RightOutlined />
                </button>
              </>
            ) : null}

            <Swiper
              key={billingInterval}
              slidesPerView={1}
              spaceBetween={24}
              watchOverflow
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                syncNavState(swiper);
              }}
              onSlideChange={syncNavState}
              onResize={syncNavState}
              onBreakpoint={syncNavState}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                880: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
              }}
              className="plan-catalog-swiper overflow-hidden py-6"
            >
              {plans.map((plan) => {
                const isCurrent = plan.plan === currentPlan;

                return (
                  <SwiperSlide key={`${plan.id}-${plan.priceId}`} className="h-auto!">
                    <div className="h-full px-1 py-3">
                      <PricingCard
                        name={plan.name}
                        description={plan.description}
                        price={plan.price}
                        priceSuffix={plan.priceSuffix}
                        features={
                          plan.features.length > 0 ? plan.features : ["Plan details coming soon"]
                        }
                        ctaLabel={plan.ctaLabel}
                        highlighted={plan.highlighted && !isCurrent}
                        badge={isCurrent ? "Current plan" : plan.badge}
                        footer={renderPlanFooter(plan, plan.ctaType)}
                        className={cn(
                          "h-full scale-100!",
                          isCurrent && "border-emerald-300 ring-1 ring-emerald-200",
                        )}
                      />
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      )}
    </SettingsSection>
  );
}

export default React.memo(WorkspaceBillingPlanCards);
