import React from "react";
import { Paragraph, Title } from "../../component/ui/typography";

type WorkspacePlaceholderPageProps = {
  title: string;
  description: string;
};

function WorkspacePlaceholderPage({ title, description }: WorkspacePlaceholderPageProps) {
  return (
    <div className="mx-auto max-w-4xl">
      <Title level={2} className="text-2xl text-foreground lg:text-3xl">
        {title}
      </Title>
      <Paragraph size="sm" className="mt-2 text-muted">
        {description}
      </Paragraph>

      <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-10 text-center shadow-sm">
        <p className="text-sm font-medium text-muted">This section is coming soon.</p>
        <p className="mt-2 text-sm text-muted">UI shell is ready — connect APIs when backend work resumes.</p>
      </div>
    </div>
  );
}

export default React.memo(WorkspacePlaceholderPage);
