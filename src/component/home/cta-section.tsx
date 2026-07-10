import React from "react";
import CtaBanner from "../common/cta-banner";
import AnimateOnScroll from "../common/animate-on-scroll";
import { UN_AUTH_ROUTES } from "../../router/public-routes";

function CtaSection() {
  return (
    <section className="bg-background px-4 py-14 sm:px-6 nav:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <AnimateOnScroll variant="scale-in">
          <CtaBanner
            title="Ready to synchronize your team?"
            description="Join 10,000+ companies already building the future with Orbit."
            primaryAction={{
              label: "Start for free",
              href: UN_AUTH_ROUTES.REGISTER,
            }}
            secondaryAction={{
              label: "Schedule a Demo",
              href: UN_AUTH_ROUTES.CONTACT,
            }}
          />
        </AnimateOnScroll>
      </div>
    </section>
  );
}

export default React.memo(CtaSection);
