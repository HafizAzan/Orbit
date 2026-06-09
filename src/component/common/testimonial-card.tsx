import { StarFilled } from "@ant-design/icons";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/utils";
import { Paragraph, Text } from "../ui/typography";

type TestimonialCardProps = ComponentPropsWithoutRef<"article"> & {
  quote: string;
  name: string;
  role: string;
  avatarUrl?: string;
  rating?: number;
};

function TestimonialAvatar({ name, avatarUrl }: Pick<TestimonialCardProps, "name" | "avatarUrl">) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="h-11 w-11 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <div
      aria-hidden
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
    >
      {initials}
    </div>
  );
}

function TestimonialCard({
  quote,
  name,
  role,
  avatarUrl,
  rating = 5,
  className,
  ...props
}: TestimonialCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm nav:p-8",
        className,
      )}
      {...props}
    >
      <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: rating }, (_, index) => (
          <StarFilled key={index} className="text-sm text-primary" />
        ))}
      </div>

      <Paragraph size="sm" className="mt-5 flex-1 text-hero-text nav:text-base">
        &ldquo;{quote}&rdquo;
      </Paragraph>

      <div className="mt-6 flex items-center gap-3">
        <TestimonialAvatar name={name} avatarUrl={avatarUrl} />
        <div className="min-w-0">
          <Text as="p" size="sm" weight="semibold" className="text-foreground">
            {name}
          </Text>
          <Text as="p" size="sm" color="muted">
            {role}
          </Text>
        </div>
      </div>
    </article>
  );
}

export default TestimonialCard;
export type { TestimonialCardProps };
