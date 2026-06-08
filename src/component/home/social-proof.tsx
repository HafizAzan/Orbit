import React from "react";
import TRUSTED_BRANDS from "../../data/trusted-brands";
import { Text } from "../ui/typography";

function SocialProof() {
  return (
    <section className="px-4 py-10 bg-white sm:px-6 nav:py-12 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 nav:gap-6">
        <Text as="p" size="xs" font="roboto" className="text-center text-[11px] font-semibold tracking-[0.22em] text-zinc-600 uppercase sm:text-xs">
          Trusted by high-performance teams worldwide
        </Text>

        <div className="rounded-md px-5 py-8 sm:px-8 nav:rounded-lg nav:px-12 nav:py-10">
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 nav:justify-between nav:gap-x-6">
            {TRUSTED_BRANDS.map((brand) => (
              <li key={brand.name} className="flex shrink-0 items-center justify-center">
                <img src={brand.logo} alt={brand.name} className="h-10 w-auto object-contain sm:h-11 nav:h-12" loading="lazy" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default React.memo(SocialProof);
