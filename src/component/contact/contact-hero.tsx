import React from "react";
import { CONTACT_HERO } from "../../data/contact";
import { Paragraph, Title } from "../ui/typography";

function ContactHero() {
  return (
    <section className="bg-background px-4 py-10 text-center sm:px-6 sm:py-14 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <Title level={1} className="text-foreground">
          {CONTACT_HERO.title}
        </Title>
        <Paragraph size="base" className="mx-auto mt-4 max-w-2xl text-muted">
          {CONTACT_HERO.description}
        </Paragraph>
      </div>
    </section>
  );
}

export default React.memo(ContactHero);
