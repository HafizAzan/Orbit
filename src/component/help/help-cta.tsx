import React from "react";
import { Link } from "react-router-dom";
import { HELP_CTA } from "../../data/help";
import { UN_AUTH_ROUTES } from "../../router/public-routes";
import AnimateOnScroll from "../common/animate-on-scroll";
import { Paragraph, Title } from "../ui/typography";

function HelpCta() {
  return (
    <section className="bg-feature-sync/50 px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
      <AnimateOnScroll variant="fade-up" className="mx-auto max-w-3xl text-center">
        <Title level={2} className="text-foreground">
          {HELP_CTA.title}
        </Title>
        <Paragraph size="base" className="mx-auto mt-3 max-w-xl text-muted">
          {HELP_CTA.description}
        </Paragraph>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            to={UN_AUTH_ROUTES.CONTACT}
            className="w-full rounded-xl bg-primary px-6 py-3.5 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto"
          >
            {HELP_CTA.primaryLabel}
          </Link>
          <Link
            to={UN_AUTH_ROUTES.CONTACT}
            className="w-full rounded-xl border border-primary/30 bg-card px-6 py-3.5 text-center text-sm font-semibold text-primary transition-colors hover:bg-primary/5 sm:w-auto"
          >
            {HELP_CTA.secondaryLabel}
          </Link>
        </div>
      </AnimateOnScroll>
    </section>
  );
}

export default React.memo(HelpCta);
