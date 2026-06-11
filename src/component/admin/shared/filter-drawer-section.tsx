import React from "react";
import { Paragraph, Text } from "../../ui/typography";

type FilterDrawerSectionProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

function FilterDrawerSection({ title, description, children }: FilterDrawerSectionProps) {
  return (
    <section className="rounded-2xl border border-border bg-background/70 p-4">
      <Text as="p" size="sm" className="font-semibold text-foreground">
        {title}
      </Text>
      <Paragraph size="xs" className="mt-1 text-muted">
        {description}
      </Paragraph>
      <div className="mt-4 space-y-2">{children}</div>
    </section>
  );
}

export default React.memo(FilterDrawerSection);
