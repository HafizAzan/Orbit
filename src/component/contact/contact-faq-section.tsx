import React from "react";
import { CONTACT_FAQ_ITEMS } from "../../data/contact";
import FaqAccordion from "../common/faq-accordion";
import { Title } from "../ui/typography";

function ContactFaqSection() {
  return (
    <section className="bg-background px-4 py-14 sm:px-6 nav:py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center nav:mb-14">
          <Title level={2} className="text-foreground">
            Frequently Asked Questions
          </Title>
        </div>

        <FaqAccordion items={CONTACT_FAQ_ITEMS} defaultOpenId="response-time" className="mx-auto max-w-3xl" />
      </div>
    </section>
  );
}

export default React.memo(ContactFaqSection);
