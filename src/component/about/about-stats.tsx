import React from "react";
import { ABOUT_STATS } from "../../data/about";
import AnimateOnScroll from "../common/animate-on-scroll";

function AboutStats() {
  return (
    <section className="border-y border-border bg-card px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
        {ABOUT_STATS.map((stat, index) => (
          <AnimateOnScroll key={stat.id} variant="fade-up" delay={index * 80} className="text-center">
            <p className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</p>
            <p className="mt-2 text-sm font-medium text-muted">{stat.label}</p>
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
}

export default React.memo(AboutStats);
