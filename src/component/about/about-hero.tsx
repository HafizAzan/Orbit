import React from "react";
import { ABOUT_HERO } from "../../data/about";
import { RESOURCES } from "../../lib/resources";
import AnimateOnScroll from "../common/animate-on-scroll";
import { Paragraph, Title } from "../ui/typography";

function AboutHero() {
  return (
    <section className="bg-background px-4 pt-10 pb-8 sm:px-6 sm:pt-14 lg:px-10 lg:pt-16">
      <div className="mx-auto max-w-4xl text-center">
        <AnimateOnScroll variant="fade-up">
          <span className="inline-flex rounded-full bg-feature-sync px-4 py-1.5 text-xs font-semibold tracking-wide text-primary uppercase">
            {ABOUT_HERO.badge}
          </span>

          <Title level={1} className="mt-5 text-foreground">
            {ABOUT_HERO.title}
          </Title>

          <Paragraph size="base" className="mx-auto mt-4 max-w-2xl text-muted">
            {ABOUT_HERO.description}
          </Paragraph>
        </AnimateOnScroll>
      </div>

      <AnimateOnScroll variant="scale-in" delay={120} className="mx-auto mt-10 max-w-5xl">
        <div className="overflow-hidden rounded-3xl border border-border bg-card p-2 shadow-sm sm:p-3">
          <img src={RESOURCES.IMAGES.WORKSPACE} alt="Modern office workspace" className="h-auto w-full rounded-2xl object-cover" loading="eager" />
        </div>
      </AnimateOnScroll>
    </section>
  );
}

export default React.memo(AboutHero);
