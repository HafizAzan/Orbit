import React from "react";
import { ABOUT_STORY } from "../../data/about";
import { RESOURCES } from "../../lib/resources";
import AnimateOnScroll from "../common/animate-on-scroll";
import { Paragraph, Title } from "../ui/typography";

function AboutStory() {
  return (
    <section className="bg-background px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <AnimateOnScroll variant="fade-left" className="flex flex-col gap-6">
          <Title level={2} className="text-foreground">
            {ABOUT_STORY.title}
          </Title>

          <div className="space-y-4">
            {ABOUT_STORY.paragraphs.map((paragraph) => (
              <Paragraph key={paragraph.slice(0, 24)} size="base" className="text-muted">
                {paragraph}
              </Paragraph>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-border pt-6 sm:gap-4">
            {ABOUT_STORY.milestones.map((milestone) => (
              <div key={milestone.id}>
                <p className="text-lg font-bold text-primary">{milestone.year}</p>
                <p className="mt-1 text-sm text-muted">{milestone.label}</p>
              </div>
            ))}
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll variant="fade-right" delay={100}>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <img src={RESOURCES.IMAGES.JOURNEY} alt="Team collaborating in a modern office" className="h-auto w-full object-cover" loading="lazy" />
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

export default React.memo(AboutStory);
