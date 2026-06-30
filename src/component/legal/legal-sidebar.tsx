import { CalendarOutlined } from "@ant-design/icons";
import React from "react";
import type { LegalDocument } from "../../data/legal";
import { cn } from "../../lib/utils";
import { Paragraph, Text, Title } from "../ui/typography";

type LegalSidebarProps = {
  document: LegalDocument;
};

function LegalSidebar({ document }: LegalSidebarProps) {
  const { sidebar, sections } = document;

  return (
    <div className="flex h-full flex-col">
      <div>
        <Title level={4}>{sidebar.title}</Title>
        <Paragraph size="sm" className="mt-2">{sidebar.description}</Paragraph>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <div className="rounded-xl border border-border/80 bg-background/60 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted uppercase">
            <CalendarOutlined />
            Effective date
          </div>
          <Text as="p" size="sm" weight="medium" className="mt-2">{sidebar.effectiveDate}</Text>
        </div>

        <div className="rounded-xl border border-border/80 bg-background/60 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted uppercase">
            <CalendarOutlined />
            Last updated
          </div>
          <Text as="p" size="sm" weight="medium" className="mt-2">{sidebar.lastUpdated}</Text>
        </div>
      </div>

      <nav className="mt-8" aria-label="Table of contents">
        <Text as="p" size="xs" color="muted" weight="semibold" className="tracking-wide uppercase">On this page</Text>
        <ul className="mt-3 space-y-1">
          {sections.map((section) => {
            const SectionIcon = section.icon;

            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                    "text-muted hover:bg-primary/5 hover:text-foreground",
                  )}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <SectionIcon className="text-sm" />
                  </span>
                  <Text weight="medium">{section.title}</Text>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export default React.memo(LegalSidebar);
