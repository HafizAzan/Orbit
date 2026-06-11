import React from "react";
import { HELP_TOPICS, type HelpTopic } from "../../data/help";
import { cn } from "../../lib/utils";
import AnimateOnScroll from "../common/animate-on-scroll";
import { Paragraph, Text, Title } from "../ui/typography";

type HelpTopicsProps = {
  selectedTopicId: string | null;
  onSelectTopic: (topicId: HelpTopic["id"] | null) => void;
};

function HelpTopics({ selectedTopicId, onSelectTopic }: HelpTopicsProps) {
  return (
    <section className="bg-insights-background px-4 py-14 sm:px-6 nav:py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <AnimateOnScroll variant="fade-up" className="mx-auto mb-10 max-w-2xl text-center nav:mb-14">
          <Text as="p" size="sm" color="primary" weight="semibold" className="tracking-wide uppercase">
            Browse topics
          </Text>
          <Title level={2} className="mt-3 text-foreground">
            Find help by category
          </Title>
          <Paragraph className="mt-4 text-hero-text">
            Select a topic to filter FAQs below, or browse all articles to explore everything FlowSync offers.
          </Paragraph>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HELP_TOPICS.map((topic, index) => {
            const Icon = topic.icon;
            const isSelected = selectedTopicId === topic.id;

            return (
              <AnimateOnScroll key={topic.id} variant="fade-up" delay={index * 70}>
                <button
                  type="button"
                  onClick={() => onSelectTopic(isSelected ? null : topic.id)}
                  className={cn(
                    "flex h-full w-full flex-col rounded-2xl border bg-card p-6 text-left shadow-sm transition-all hover:shadow-md",
                    isSelected ? "border-primary bg-feature-sync/40 shadow-md" : "border-border hover:border-primary/30",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={cn(
                        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-primary",
                        topic.iconBackground === "sync" && "bg-feature-sync",
                        topic.iconBackground === "security" && "bg-feature-security",
                        topic.iconBackground === "workflow" && "bg-feature-workflow",
                      )}
                    >
                      <Icon className="text-lg" />
                    </span>
                    <Text as="span" size="xs" color="muted" className="rounded-full bg-background px-2.5 py-1">
                      {topic.articleCount} articles
                    </Text>
                  </div>

                  <Text as="p" size="base" weight="semibold" className="mt-5 text-foreground">
                    {topic.title}
                  </Text>
                  <Paragraph size="sm" color="muted" className="mt-2 flex-1 text-hero-text">
                    {topic.description}
                  </Paragraph>
                </button>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default React.memo(HelpTopics);
