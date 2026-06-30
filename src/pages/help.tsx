import React, { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import HelpCta from "../component/help/help-cta";
import HelpFaqSection from "../component/help/help-faq-section";
import HelpGuidesSection from "../component/help/help-guides-section";
import HelpHero from "../component/help/help-hero";
import HelpQuickLinks from "../component/help/help-quick-links";
import HelpTopics from "../component/help/help-topics";
import { HELP_TOPICS } from "../data/help";
import { setSearchParamValue } from "../lib/url-tab";

function Help() {
  const [search, setSearch] = React.useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  const selectedTopicId = useMemo(() => {
    if (!tabParam) return null;
    return HELP_TOPICS.some((topic) => topic.id === tabParam) ? tabParam : null;
  }, [tabParam]);

  const setSelectedTopicId = useCallback(
    (topicId: string | null) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          setSearchParamValue(next, "tab", topicId);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

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
