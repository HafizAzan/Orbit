import React, { useMemo } from "react";
import { HELP_FAQ_ITEMS, HELP_TOPICS } from "../../data/help";
import { matchesSearchQuery } from "../../lib/helper";
import FaqAccordion from "../common/faq-accordion";
import { Paragraph, Text, Title } from "../ui/typography";

type HelpFaqSectionProps = {
  search: string;
  selectedTopicId: string | null;
};

function HelpFaqSection({ search, selectedTopicId }: HelpFaqSectionProps) {
  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return HELP_FAQ_ITEMS.filter((item) => {
      if (selectedTopicId && item.topicId !== selectedTopicId) {
        return false;
      }

      if (!query) return true;

      return (
        matchesSearchQuery(item.question, query) ||
        matchesSearchQuery(item.answer, query) ||
        matchesSearchQuery(HELP_TOPICS.find((topic) => topic.id === item.topicId)?.title ?? "", query)
      );
    });
  }, [search, selectedTopicId]);

  const selectedTopicLabel = HELP_TOPICS.find((topic) => topic.id === selectedTopicId)?.title;

  return (
    <section id="help-faq" className="bg-background px-4 py-14 sm:px-6 nav:py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center nav:mb-14">
          <Title level={2} className="text-foreground">
            Frequently Asked Questions
          </Title>
          {selectedTopicLabel ? (
            <Paragraph size="sm" className="mt-3 text-muted">
              Showing results for <span className="font-semibold text-primary">{selectedTopicLabel}</span>
            </Paragraph>
          ) : null}
        </div>

        {filteredItems.length > 0 ? (
          <FaqAccordion items={filteredItems} defaultOpenId={filteredItems[0]?.id} className="mx-auto max-w-3xl" />
        ) : (
          <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card px-6 py-10 text-center shadow-sm">
            <Text as="p" size="base" weight="semibold" className="text-foreground">
              No matching articles found
            </Text>
            <Paragraph size="sm" className="mt-2 text-muted">
              Try a different search term or clear your topic filter to see all FAQs.
            </Paragraph>
          </div>
        )}
      </div>
    </section>
  );
}

export default React.memo(HelpFaqSection);
