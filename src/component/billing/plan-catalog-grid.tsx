import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Swiper as SwiperInstance } from 'swiper';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getMe } from '../../api-services/auth.service';
import { useAppContext } from '../../context/app-context';
import { useBillingCatalog, useCreateCheckout, useSelectPlan } from '../../hooks/use-billing';
import { showApiErrorToast, showApiSuccessToast } from '../../lib/api-error';
import { getPostAuthRedirectPath } from '../../lib/auth-routing';
import { saveStoredUser } from '../../lib/auth-session';
import {
  mapCatalogToPricingPlans,
  resolveCatalogSavingsHint,
  type PricingBillingInterval,
} from '../../lib/pricing-catalog';
import { cn } from '../../lib/utils';
import type { CatalogCtaType } from '../../types/billing.types';
import AnimateOnScroll from '../common/animate-on-scroll';
import PricingCard from '../common/pricing-card';
import QueryErrorState from '../common/query-error-state';
import { PricingCardsGridSkeleton } from '../skeletons';
import { Paragraph } from '../ui/typography';
import PricingIntervalToggle from './pricing-interval-toggle';

type PlanCatalogGridProps = {
  mode: 'public' | 'onboarding';
  onContact?: () => void;
  onRequireAuth?: (ctaType: CatalogCtaType) => void;
};

function PlanCatalogGrid({ mode, onContact, onRequireAuth }: PlanCatalogGridProps) {
  const catalogQuery = useBillingCatalog();
  const { data, isPending, isError, error, refetch, isFetching } = catalogQuery;
  const { mutateAsync: startCheckout } = useCreateCheckout();
  const { mutateAsync: activatePlan } = useSelectPlan();
  const app = useAppContext();
  const navigate = useNavigate();
  const [pendingPriceId, setPendingPriceId] = useState<string | null>(null);
  const [billingInterval, setBillingInterval] = useState<PricingBillingInterval>('monthly');
  const [canSlidePrev, setCanSlidePrev] = useState(false);
  const [canSlideNext, setCanSlideNext] = useState(false);
  const swiperRef = useRef<SwiperInstance | null>(null);

  const products = data?.products ?? [];
  const plans = useMemo(
    () => mapCatalogToPricingPlans(products, billingInterval),
    [billingInterval, products],
  );
  const savingsHint = useMemo(() => resolveCatalogSavingsHint(products), [products]);
  const showSliderControls = plans.length > 3;

  const syncNavState = (swiper: SwiperInstance) => {
    setCanSlidePrev(!swiper.isBeginning);
    setCanSlideNext(!swiper.isEnd);
  };

  const handlePlanAction = async (priceId: string, ctaType: CatalogCtaType) => {
    if (ctaType === 'contact') {
      if (onContact) {
        onContact();
      } else {
        navigate('/contact?subject=enterprise');
      }
      return;
    }

    if (mode === 'public') {
      onRequireAuth?.(ctaType);
      return;
    }

    setPendingPriceId(priceId);

    try {
      if (ctaType === 'register') {
        const result = await activatePlan({ priceId });
        const freshUser = await getMe();
        saveStoredUser(freshUser);
        app?.setUser(freshUser);
        showApiSuccessToast(result.message);

        if (!freshUser.organizationAwaitingSubscription) {
          navigate(getPostAuthRedirectPath(freshUser), { replace: true });
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

  if (isPending) {
    return <PricingCardsGridSkeleton count={3} />;
  }

  if (isError) {
    return (
      <QueryErrorState
        error={error}
        title="Unable to load pricing plans"
        onRetry={() => {
          void refetch();
        }}
        isRetrying={isFetching}
      />
    );
  }

  if (plans.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
        <Paragraph color="muted">
          Pricing plans are unavailable right now. Add active Stripe products with prices and
          metadata to show plans here.
        </Paragraph>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PricingIntervalToggle
        value={billingInterval}
        onChange={setBillingInterval}
        savingsHint={savingsHint}
      />

      <AnimateOnScroll variant="fade-up" className="relative px-0 nav:px-6">
        {showSliderControls ? (
          <>
            <button
              type="button"
              aria-label="Previous plans"
              disabled={!canSlidePrev}
              onClick={() => swiperRef.current?.slidePrev()}
              className={cn(
                'absolute top-1/2 left-0 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition hover:border-primary hover:text-primary nav:flex',
                !canSlidePrev && 'pointer-events-none opacity-40',
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
                'absolute top-1/2 right-0 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition hover:border-primary hover:text-primary nav:flex',
                !canSlideNext && 'pointer-events-none opacity-40',
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
            const isLoadingAction = pendingPriceId === plan.priceId;

            return (
              <SwiperSlide key={`${plan.id}-${plan.priceId}`} className="h-auto!">
                <div className="h-full px-1 py-3">
                  <PricingCard
                    name={plan.name}
                    description={plan.description}
                    price={plan.price}
                    priceSuffix={plan.priceSuffix}
                    features={
                      plan.features.length > 0 ? plan.features : ['Plan details coming soon']
                    }
                    ctaLabel={isLoadingAction ? 'Processing...' : plan.ctaLabel}
                    highlighted={plan.highlighted}
                    badge={plan.badge}
                    onCtaClick={
                      isLoadingAction
                        ? undefined
                        : () => {
                            void handlePlanAction(plan.priceId, plan.ctaType);
                          }
                    }
                    className="h-full scale-100!"
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </AnimateOnScroll>
    </div>
  );
}

export default React.memo(PlanCatalogGrid);
