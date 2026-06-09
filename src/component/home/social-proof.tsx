import React from "react";
import TRUSTED_BRANDS from "../../data/trusted-brands";
import AnimateOnScroll from "../common/animate-on-scroll";
import { Text } from "../ui/typography";

function SocialProof() {
  return (
    <section className="bg-white px-4 py-10 sm:px-6 nav:py-12 lg:px-10">
      <AnimateOnScroll variant="fade-in" className="mx-auto flex max-w-7xl flex-col gap-5 nav:gap-6">
        <Text as="p" size="xs" font="roboto" className="text-center text-[11px] font-semibold tracking-[0.22em] text-zinc-600 uppercase sm:text-xs">
          Trusted by high-performance teams worldwide
        </Text>

        <div className="rounded-md px-5 py-8 sm:px-8 nav:rounded-lg nav:px-12 nav:py-10">
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 nav:justify-between nav:gap-x-6">
            {TRUSTED_BRANDS.map((brand, index) => (
              <li key={brand.name} className="flex shrink-0 items-center justify-center">
                <AnimateOnScroll variant="fade-up" delay={index * 80}>
                  <img src={brand.logo} alt={brand.name} className="h-10 w-auto object-contain sm:h-11 nav:h-12" loading="lazy" />
                </AnimateOnScroll>
              </li>
            ))}
          </ul>
        </div>
      </AnimateOnScroll>
    </section>
  );
}

export default React.memo(SocialProof);
