import React from "react";
import PageSeo from "../component/seo/page-seo";
import AboutCta from "../component/about/about-cta";
import AboutHero from "../component/about/about-hero";
import AboutQuote from "../component/about/about-quote";
import AboutStats from "../component/about/about-stats";
import AboutStory from "../component/about/about-story";
import AboutValues from "../component/about/about-values";

function About() {
  return (
    <>
      <PageSeo
        title="About"
        description="Learn about Orbit — our story, mission, and the team building the next generation of project management tools."
        path="/about"
      />
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
