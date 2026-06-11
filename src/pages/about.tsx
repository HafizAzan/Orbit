import React from "react";
import AboutCta from "../component/about/about-cta";
import AboutHero from "../component/about/about-hero";
import AboutQuote from "../component/about/about-quote";
import AboutStats from "../component/about/about-stats";
import AboutStory from "../component/about/about-story";
import AboutValues from "../component/about/about-values";

function About() {
  return (
    <>
      <AboutHero />
      <AboutStats />
      <AboutStory />
      <AboutValues />
      <AboutQuote />
      <AboutCta />
    </>
  );
}

export default React.memo(About);
