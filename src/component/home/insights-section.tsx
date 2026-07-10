import React from "react";
import INSIGHT_METRICS from "../../data/insights-metrics";
import { RESOURCES } from "../../lib/resources";
import AnimateOnScroll from "../common/animate-on-scroll";
import StatCard from "../ui/stat-card";
import { Paragraph, Text, Title } from "../ui/typography";

function InsightsSection() {
  return (
    <section className="bg-insights-background px-4 py-14 sm:px-6 nav:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 nav:grid-cols-2 nav:gap-12 lg:gap-16">
        <AnimateOnScroll variant="fade-left" className="order-2 nav:order-1">
          <img
            src={RESOURCES.IMAGES.DASHBOARD}
            alt="Orbit analytics dashboard"
            className="block max-w-none rounded-2xl object-cover object-left"
          />
        </AnimateOnScroll>

        <AnimateOnScroll variant="fade-right" delay={100} className="order-1 flex flex-col gap-6 nav:order-2 nav:gap-8">
          <div className="flex flex-col gap-4 nav:gap-5">
            <Text as="p" size="sm" weight="semibold" className="text-primary">
              Data-Driven Insights
            </Text>

            <Title level={2} className="text-3xl text-foreground nav:text-4xl lg:text-[2.75rem] lg:leading-tight">
              Turn project data into actionable growth
            </Title>

            <Paragraph size="base" color="muted" className="max-w-xl text-hero-text">
              Go beyond simple task management. Orbit&apos;s dashboard provides deep analytical insights into team velocity, resource allocation,
              and project health, helping you make informed decisions faster.
            </Paragraph>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {INSIGHT_METRICS.map((metric, index) => (
              <AnimateOnScroll key={metric.label} variant="scale-in" delay={index * 100}>
                <StatCard value={metric.value} label={metric.label} className="h-full" />
              </AnimateOnScroll>
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

export default React.memo(InsightsSection);
