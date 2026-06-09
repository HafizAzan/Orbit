import React from "react";
import FEATURE_ITEMS from "../../data/features";
import AnimateOnScroll from "../common/animate-on-scroll";
import Card from "../ui/card";
import { Paragraph, Text, Title } from "../ui/typography";

function FeaturesSection() {
  return (
    <section id="solutions" className="bg-background px-4 py-14 sm:px-6 nav:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <AnimateOnScroll variant="fade-up" className="mx-auto mb-10 max-w-2xl text-center nav:mb-14">
          <Text as="p" size="sm" color="primary" weight="semibold" className="tracking-wide uppercase">
            Efficiency Redefined
          </Text>

          <Title level={2} className="mt-3 text-foreground">
            Built for the future of enterprise work
          </Title>

          <Paragraph className="mt-4 text-hero-text">
            Streamline complex workflows with tools designed for high-performance teams.
          </Paragraph>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 gap-6 nav:grid-cols-3 nav:gap-8">
          {FEATURE_ITEMS.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <AnimateOnScroll key={feature.title} variant="fade-up" delay={index * 100}>
                <Card
                  icon={<Icon className="text-lg" />}
                  iconBackground={feature.iconBackground}
                  title={feature.title}
                  description={feature.description}
                  className="h-full"
                />
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default React.memo(FeaturesSection);
