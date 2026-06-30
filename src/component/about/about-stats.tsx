import React from "react";
import { ABOUT_STATS } from "../../data/about";
import AnimateOnScroll from "../common/animate-on-scroll";
import { Text } from "../ui/typography";

function AboutStats() {
  return (
    <section className="border-y border-border bg-card px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
        {ABOUT_STATS.map((stat, index) => (
          <AnimateOnScroll key={stat.id} variant="fade-up" delay={index * 80} className="text-center">
            <Text as="p" className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</Text>
            <Text as="p" size="sm" color="muted" weight="medium" className="mt-2">{stat.label}</Text>
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
}

export default React.memo(AboutStats);
