import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Paragraph, Title } from "../ui/typography";

type CtaAction = {
  label: string;
  href: string;
};

type CtaBannerProps = ComponentPropsWithoutRef<"div"> & {
  title: string;
  description: string;
  primaryAction: CtaAction;
  secondaryAction?: CtaAction;
  footer?: ReactNode;
};

function CtaBanner({
  title,
  description,
  primaryAction,
  secondaryAction,
  footer,
  className,
  ...props
}: CtaBannerProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl bg-cta-background px-6 py-12 text-center nav:px-12 nav:py-16",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cta-glow/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cta-glow/20 blur-3xl"
      />

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-6">
        <Title level={2} className="text-white nav:text-4xl">
          {title}
        </Title>

        <Paragraph size="base" className="text-white/90">
          {description}
        </Paragraph>

        <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <Link
            to={primaryAction.href}
            className="w-full rounded-xl bg-white px-6 py-3.5 text-center text-sm font-semibold text-primary transition-opacity hover:opacity-90 sm:w-auto"
          >
            {primaryAction.label}
          </Link>

          {secondaryAction ? (
            <Link
              to={secondaryAction.href}
              className="w-full rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-white/20 sm:w-auto"
            >
              {secondaryAction.label}
            </Link>
          ) : null}
        </div>

        {footer}
      </div>
    </div>
  );
}

export default CtaBanner;
export type { CtaAction, CtaBannerProps };
