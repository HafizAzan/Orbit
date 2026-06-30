import type { ReactNode } from "react";
import { cn } from "../../../lib/utils";
import { Paragraph, Title } from "../../ui/typography";

type SettingsSectionProps = {
  id: string;
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

function SettingsSection({ id, title, description, action, children, className }: SettingsSectionProps) {
  return (
    <section id={id} className={cn("rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6", className)}>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Title level={4} color="default">{title}</Title>
          <Paragraph size="sm" className="mt-1 mb-0!">{description}</Paragraph>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export default SettingsSection;
