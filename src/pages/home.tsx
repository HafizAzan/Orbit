import React from "react";
import PageSeo from "../component/seo/page-seo";
import CtaSection from "../component/home/cta-section";
import FaqSection from "../component/home/faq-section";
import Feature from "../component/home/feature";
import FeaturesSection from "../component/home/features-section";
import InsightsSection from "../component/home/insights-section";
import KanbanSection from "../component/home/kanban-section";
import PricingSection from "../component/home/pricing-section";
import ResourcesSection from "../component/home/resources-section";
import SocialProof from "../component/home/social-proof";
import TestimonialsSection from "../component/home/testimonials-section";

function Home() {
  return (
    <>
      <PageSeo
        title="Orbit — Project management for modern teams"
        description="Plan, track, and ship work faster with Orbit. Boards, tasks, timelines, and real-time collaboration for modern teams."
        path="/"
      />
      <Feature />
      <SocialProof />
      <FeaturesSection />
      <KanbanSection />
      <InsightsSection />
      <PricingSection />
      <ResourcesSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}

export default React.memo(Home);
