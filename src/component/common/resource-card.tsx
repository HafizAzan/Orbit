import { ArrowRightOutlined } from "@ant-design/icons";
import type { ComponentPropsWithoutRef, ComponentType } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Paragraph, Text, Title } from "../ui/typography";

const iconBackgroundStyles = {
  sync: "bg-feature-sync",
  security: "bg-feature-security",
  workflow: "bg-feature-workflow",
} as const;

type IconBackground = keyof typeof iconBackgroundStyles;

type ResourceCardProps = ComponentPropsWithoutRef<"article"> & {
  category: string;
  title: string;
  description: string;
  meta: string;
  href: string;
  ctaLabel: string;
  icon: ComponentType<{ className?: string }>;
  iconBackground?: IconBackground;
};

function ResourceCard({
  category,
  title,
  description,
  meta,
  href,
  ctaLabel,
  icon: Icon,
  iconBackground = "sync",
  className,
  ...props
}: ResourceCardProps) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md nav:p-8",
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={cn(
            "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-primary",
            iconBackgroundStyles[iconBackground],
          )}
        >
          <Icon className="text-lg" />
        </div>

        <Text
          as="span"
          size="xs"
          weight="semibold"
          color="primary"
          className="rounded-full bg-primary/10 px-2.5 py-1 uppercase tracking-wide"
        >
          {category}
        </Text>
      </div>

      <Title level={5} className="mt-5 text-foreground">
        {title}
      </Title>

      <Paragraph size="sm" color="muted" className="mt-2 flex-1 text-hero-text">
        {description}
      </Paragraph>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-5">
        <Text as="span" size="sm" color="muted">
          {meta}
        </Text>

        <Link
          to={href}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors group-hover:gap-2.5"
        >
          {ctaLabel}
          <ArrowRightOutlined className="text-xs" />
        </Link>
      </div>
    </article>
  );
}

export default ResourceCard;
export type { IconBackground, ResourceCardProps };
