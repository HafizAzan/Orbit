import React from "react";
import { ABOUT_QUOTE } from "../../data/about";
import AnimateOnScroll from "../common/animate-on-scroll";

function AboutQuote() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
      <AnimateOnScroll variant="scale-in" className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center sm:px-10 sm:py-14">
          <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

          <span aria-hidden className="relative text-5xl leading-none font-serif text-white/30 sm:text-6xl">
            &ldquo;
          </span>

          <blockquote className="relative mx-auto mt-6 max-w-3xl text-lg leading-relaxed font-medium text-white sm:text-xl">
            {ABOUT_QUOTE.text}
          </blockquote>

          <div className="relative mt-8 flex flex-col items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
              SC
            </span>
            <div>
              <p className="font-semibold text-white">{ABOUT_QUOTE.author}</p>
              <p className="mt-0.5 text-sm text-white/80">{ABOUT_QUOTE.role}</p>
            </div>
          </div>
        </div>
      </AnimateOnScroll>
    </section>
  );
}

export default React.memo(AboutQuote);
