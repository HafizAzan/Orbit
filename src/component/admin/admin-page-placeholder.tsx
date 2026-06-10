import React from "react";
import { Paragraph, Title } from "../ui/typography";

type AdminPagePlaceholderProps = {
  title: string;
  description: string;
};

function AdminPagePlaceholder({ title, description }: AdminPagePlaceholderProps) {
  return (
    <div className="mx-auto max-w-7xl">
      <Title level={2} className="text-2xl text-foreground lg:text-3xl">
        {title}
      </Title>
      <Paragraph size="sm" className="mt-2 text-muted">
        {description}
      </Paragraph>
    </div>
  );
}

export default React.memo(AdminPagePlaceholder);
