import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Paragraph, Title } from "./typography";

const iconBackgroundStyles = {
  sync: "bg-feature-sync",
  security: "bg-feature-security",
  workflow: "bg-feature-workflow",
} as const;

type IconBackground = keyof typeof iconBackgroundStyles;

type CardProps = ComponentPropsWithoutRef<"article"> & {
  icon: ReactNode;
  iconBackground?: IconBackground;
  title: string;
  description: string;
};

function Card({ icon, iconBackground = "sync", title, description, className, ...props }: CardProps) {
  return (
    <article
      className={cn("rounded-2xl border border-border bg-card p-6 shadow-sm nav:p-8", className)}
      {...props}
    >
      <div
        className={cn(
          "mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl text-primary",
          iconBackgroundStyles[iconBackground],
        )}
      >
        {icon}
      </div>

      <Title level={5} className="mb-2 text-foreground">
        {title}
      </Title>

      <Paragraph size="sm" color="muted" className="text-hero-text">
        {description}
      </Paragraph>
    </article>
  );
}

export default Card;
export type { CardProps, IconBackground };
