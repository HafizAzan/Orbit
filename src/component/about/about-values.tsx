import React from "react";
import { ABOUT_VALUES } from "../../data/about";
import AnimateOnScroll from "../common/animate-on-scroll";
import { Paragraph, Title } from "../ui/typography";

function AboutValues() {
  return (
    <section className="bg-feature-sync/40 px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <AnimateOnScroll variant="fade-up" className="mx-auto max-w-2xl text-center">
          <Title level={2} className="text-foreground">
            Our Core Values
          </Title>
          <Paragraph size="base" className="mt-3 text-muted">
            The principles that guide how we build, ship, and support FlowSync every day.
          </Paragraph>
        </AnimateOnScroll>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          {ABOUT_VALUES.map((value, index) => {
            const Icon = value.icon;

            return (
              <AnimateOnScroll key={value.id} variant="fade-up" delay={index * 100}>
                <article className="h-full rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="text-lg" />
                  </span>
                  <Title level={5} className="mt-4">{value.title}</Title>
                  <Paragraph size="sm" className="mt-2">{value.description}</Paragraph>
                </article>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default React.memo(AboutValues);
