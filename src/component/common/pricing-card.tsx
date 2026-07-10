import { CheckOutlined } from '@ant-design/icons';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Paragraph, Text, Title } from '../ui/typography';

type PricingCardProps = ComponentPropsWithoutRef<'article'> & {
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
    'block w-full rounded-xl px-5 py-3.5 text-center text-sm font-semibold transition-opacity',
    highlighted
      ? 'bg-primary text-white hover:opacity-90'
      : 'border border-border bg-card text-foreground hover:border-primary hover:text-primary',
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
        'relative flex h-full min-h-0 flex-col rounded-2xl border bg-card p-6 shadow-sm nav:p-8',
        highlighted
          ? 'z-10 border-primary shadow-lg nav:scale-105 nav:px-9 nav:py-10 nav:shadow-xl'
          : 'border-border nav:scale-[0.98]',
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
        <Text className="text-4xl font-bold text-foreground nav:text-5xl">{price}</Text>
        {priceSuffix ? (
          <Text size="sm" color="muted" className="pb-1">
            {priceSuffix}
          </Text>
        ) : null}
      </div>

      <ul className="mt-6 flex min-h-52 max-h-72 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain pr-1 [scrollbar-color:rgb(148_163_184)_transparent] scrollbar-thin [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300/80">
        {features.map((feature, index) => (
          <li key={`${feature}-${index}`} className="flex items-start gap-2.5">
            <CheckOutlined className="mt-0.5 shrink-0 text-sm text-primary" />
            <Text as="span" size="sm" color="muted">
              {feature}
            </Text>
          </li>
        ))}
      </ul>

      <div className="mt-8 shrink-0">{footer ?? ctaContent}</div>
    </article>
  );
}

export default PricingCard;
export type { PricingCardProps };
