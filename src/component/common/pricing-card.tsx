import { CheckOutlined } from "@ant-design/icons";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Paragraph, Text, Title } from "../ui/typography";

type PricingCardProps = ComponentPropsWithoutRef<"article"> & {
  name: string;
  description: string;
  price: string;
  priceSuffix?: string;
  features: string[];
  ctaLabel: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  highlighted?: boolean;
  badge?: string;
  footer?: ReactNode;
};

function PricingCard({
  name,
  description,
  price,
  priceSuffix,
  features,
  ctaLabel,
  ctaHref,
  onCtaClick,
  highlighted = false,
  badge,
  footer,
  className,
  ...props
}: PricingCardProps) {
  const ctaClassName = cn(
    "mt-8 block w-full rounded-xl px-5 py-3.5 text-center text-sm font-semibold transition-opacity",
    highlighted
      ? "bg-primary text-white hover:opacity-90"
      : "border border-border bg-card text-foreground hover:border-primary hover:text-primary",
  );

  const ctaContent = ctaHref ? (
    <Link to={ctaHref} className={ctaClassName} onClick={onCtaClick}>
      {ctaLabel}
    </Link>
  ) : (
    <button type="button" className={ctaClassName} onClick={onCtaClick}>
      {ctaLabel}
    </button>
  );

  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm nav:p-8",
        highlighted
          ? "z-10 border-primary shadow-lg nav:scale-105 nav:px-9 nav:py-10 nav:shadow-xl"
          : "border-border nav:scale-[0.98]",
        className,
      )}
      {...props}
    >
      {badge ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
          {badge}
        </span>
      ) : null}

      <div className="flex flex-col gap-2">
        <Title level={4} className="text-foreground">
          {name}
        </Title>
        <Paragraph size="sm" color="muted">
          {description}
        </Paragraph>
      </div>

      <div className="mt-6 flex items-end gap-1">
        <span className="text-4xl font-bold text-foreground nav:text-5xl">{price}</span>
        {priceSuffix ? <span className="pb-1 text-sm text-muted">{priceSuffix}</span> : null}
      </div>

      <ul className="mt-6 flex flex-1 flex-col gap-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <CheckOutlined className="mt-0.5 shrink-0 text-sm text-primary" />
            <Text as="span" size="sm" color="muted">
              {feature}
            </Text>
          </li>
        ))}
      </ul>

      {footer ?? ctaContent}
    </article>
  );
}

export default PricingCard;
export type { PricingCardProps };
