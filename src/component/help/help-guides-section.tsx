import React from "react";
import { HELP_GUIDES } from "../../data/help";
import AnimateOnScroll from "../common/animate-on-scroll";
import ResourceCard from "../common/resource-card";
import { Paragraph, Text, Title } from "../ui/typography";

function HelpGuidesSection() {
  return (
    <section id="help-guides" className="bg-background px-4 py-14 sm:px-6 nav:py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <AnimateOnScroll variant="fade-up" className="mx-auto mb-10 max-w-2xl text-center nav:mb-14">
          <Text as="p" size="sm" color="primary" weight="semibold" className="tracking-wide uppercase">
            Popular guides
          </Text>
          <Title level={2} className="mt-3 text-foreground">
            Learn FlowSync step by step
          </Title>
          <Paragraph className="mt-4 text-hero-text">
            In-depth guides and sessions to help your team adopt FlowSync with confidence.
          </Paragraph>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 gap-6 nav:grid-cols-2 nav:gap-8 xl:grid-cols-4">
          {HELP_GUIDES.map((guide, index) => (
            <AnimateOnScroll key={guide.id} variant="fade-up" delay={index * 80}>
              <ResourceCard
                category={guide.category}
                title={guide.title}
                description={guide.description}
                meta={guide.meta}
                href={guide.href}
                ctaLabel={guide.ctaLabel}
                icon={guide.icon}
                iconBackground={guide.iconBackground}
                className="h-full"
              />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

export default React.memo(HelpGuidesSection);
