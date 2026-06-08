import React from "react";
import Feature from "../component/home/feature";
import FeaturesSection from "../component/home/features-section";
import KanbanSection from "../component/home/kanban-section";
import SocialProof from "../component/home/social-proof";

function Home() {
  return (
    <>
      <Feature />
      <SocialProof />
      <FeaturesSection />
      <KanbanSection />
    </>
  );
}

export default React.memo(Home);
