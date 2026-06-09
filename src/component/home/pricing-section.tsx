import React from "react";
import PricingCard from "../common/pricing-card";
import AnimateOnScroll from "../common/animate-on-scroll";
import PRICING_PLANS from "../../data/pricing-plans";
import { Paragraph, Title } from "../ui/typography";

function PricingSection() {
  return (
    <section id="pricing" className="bg-background px-4 py-14 sm:px-6 nav:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <AnimateOnScroll variant="fade-up" className="mx-auto mb-10 max-w-2xl text-center nav:mb-14">
          <Title level={2} className="text-foreground">
            Simple, transparent pricing
          </Title>
          <Paragraph className="mt-4 text-hero-text">
            No hidden fees. Choose a plan that grows with your team.
          </Paragraph>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 gap-6 nav:grid-cols-3 nav:items-center nav:gap-6 nav:py-4">
          {PRICING_PLANS.map((plan, index) => (
            <AnimateOnScroll key={plan.id} variant="fade-up" delay={index * 120}>
              <PricingCard
                name={plan.name}
                description={plan.description}
                price={plan.price}
                priceSuffix={plan.priceSuffix}
                features={plan.features}
                ctaLabel={plan.ctaLabel}
                ctaHref={plan.ctaHref}
                highlighted={plan.highlighted}
                badge={plan.badge}
                className="h-full"
              />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

export default React.memo(PricingSection);
