import React from "react";
import AnimateOnScroll from "../common/animate-on-scroll";
import FaqAccordion from "../common/faq-accordion";
import FAQ_ITEMS from "../../data/faq-items";
import { Title } from "../ui/typography";

function FaqSection() {
  return (
    <section className="bg-card px-4 py-14 sm:px-6 nav:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <AnimateOnScroll variant="fade-up" className="mx-auto mb-10 max-w-2xl text-center nav:mb-14">
          <Title level={2} className="text-foreground">
            Frequently Asked Questions
          </Title>
        </AnimateOnScroll>

        <AnimateOnScroll variant="fade-up" delay={120}>
          <FaqAccordion items={FAQ_ITEMS} defaultOpenId="trial" className="mx-auto max-w-3xl" />
        </AnimateOnScroll>
      </div>
    </section>
  );
}

export default React.memo(FaqSection);
