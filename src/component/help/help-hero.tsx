import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import React from "react";
import { HELP_HERO } from "../../data/help";
import AnimateOnScroll from "../common/animate-on-scroll";
import { Paragraph, Title } from "../ui/typography";

type HelpHeroProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

function HelpHero({ search, onSearchChange }: HelpHeroProps) {
  return (
    <section className="bg-background px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <AnimateOnScroll variant="fade-up">
          <span className="inline-flex rounded-full bg-feature-sync px-4 py-1.5 text-xs font-semibold tracking-wide text-primary uppercase">
            {HELP_HERO.badge}
          </span>

          <Title level={1} className="mt-5 text-foreground">
            {HELP_HERO.title}
          </Title>

          <Paragraph size="base" className="mx-auto mt-4 max-w-2xl text-muted">
            {HELP_HERO.description}
          </Paragraph>

          <div className="mx-auto mt-8 max-w-xl">
            <Input
              allowClear
              size="large"
              prefix={<SearchOutlined className="text-muted" />}
              placeholder={HELP_HERO.searchPlaceholder}
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              className="rounded-xl! border-border! bg-card! py-3! text-left! shadow-sm!"
            />
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

export default React.memo(HelpHero);
