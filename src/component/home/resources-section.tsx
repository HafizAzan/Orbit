import React from "react";
import ResourceCard from "../common/resource-card";
import AnimateOnScroll from "../common/animate-on-scroll";
import RESOURCE_ITEMS from "../../data/resource-items";
import { Paragraph, Text, Title } from "../ui/typography";

function ResourcesSection() {
  return (
    <section id="resources" className="bg-insights-background px-4 py-14 sm:px-6 nav:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <AnimateOnScroll variant="fade-up" className="mx-auto mb-10 max-w-2xl text-center nav:mb-14">
          <Text as="p" size="sm" color="primary" weight="semibold" className="tracking-wide uppercase">
            Learn & Grow
          </Text>

          <Title level={2} className="mt-3 text-foreground">
            Resources to help your team move faster
          </Title>

          <Paragraph className="mt-4 text-hero-text">
            Guides, templates, and sessions built by practitioners — so you can adopt Orbit with confidence.
          </Paragraph>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 gap-6 nav:grid-cols-3 nav:gap-8">
          {RESOURCE_ITEMS.map((resource, index) => (
            <AnimateOnScroll key={resource.id} variant="fade-up" delay={index * 100}>
              <ResourceCard
                category={resource.category}
                title={resource.title}
                description={resource.description}
                meta={resource.meta}
                href={resource.href}
                ctaLabel={resource.ctaLabel}
                icon={resource.icon}
                iconBackground={resource.iconBackground}
                className="h-full"
              />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

export default React.memo(ResourcesSection);
