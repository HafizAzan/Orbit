import React, { useState } from "react";
import HelpCta from "../component/help/help-cta";
import HelpFaqSection from "../component/help/help-faq-section";
import HelpGuidesSection from "../component/help/help-guides-section";
import HelpHero from "../component/help/help-hero";
import HelpQuickLinks from "../component/help/help-quick-links";
import HelpTopics from "../component/help/help-topics";

function Help() {
  const [search, setSearch] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  return (
    <>
      <HelpHero search={search} onSearchChange={setSearch} />
      <HelpQuickLinks />
      <HelpTopics selectedTopicId={selectedTopicId} onSelectTopic={setSelectedTopicId} />
      <HelpGuidesSection />
      <HelpFaqSection search={search} selectedTopicId={selectedTopicId} />
      <HelpCta />
    </>
  );
}

export default React.memo(Help);
