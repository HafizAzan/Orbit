import { CalendarOutlined } from "@ant-design/icons";
import React from "react";
import type { LegalDocument } from "../../data/legal";
import { cn } from "../../lib/utils";

type LegalSidebarProps = {
  document: LegalDocument;
};

function LegalSidebar({ document }: LegalSidebarProps) {
  const { sidebar, sections } = document;

  return (
    <div className="flex h-full flex-col">
      <div>
        <h2 className="text-xl font-semibold text-foreground">{sidebar.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{sidebar.description}</p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <div className="rounded-xl border border-border/80 bg-background/60 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted uppercase">
            <CalendarOutlined />
            Effective date
          </div>
          <p className="mt-2 text-sm font-medium text-foreground">{sidebar.effectiveDate}</p>
        </div>

        <div className="rounded-xl border border-border/80 bg-background/60 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted uppercase">
            <CalendarOutlined />
            Last updated
          </div>
          <p className="mt-2 text-sm font-medium text-foreground">{sidebar.lastUpdated}</p>
        </div>
      </div>

      <nav className="mt-8" aria-label="Table of contents">
        <p className="text-xs font-semibold tracking-wide text-muted uppercase">On this page</p>
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
                  <span className="font-medium">{section.title}</span>
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
