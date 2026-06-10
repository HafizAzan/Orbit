import React from "react";
import { BellOutlined, UserOutlined } from "@ant-design/icons";
import { REGISTER_PREVIEW_DATA } from "../../data/auth-previews";
import AnimateOnScroll from "../common/animate-on-scroll";
import { Paragraph, Text, Title } from "../ui/typography";

function RegisterPreview() {
  const {
    onlineAvatarIds,
    onlineCountLabel,
    notification,
    kanbanColumns,
    heading,
    description,
    trustLabel,
  } = REGISTER_PREVIEW_DATA;

  return (
    <aside className="relative hidden overflow-hidden bg-login-panel px-8 py-10 lg:flex lg:flex-col lg:justify-center xl:px-12">
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

      <AnimateOnScroll immediate variant="fade-right" delay={150} className="relative mx-auto w-full max-w-xl">
        <div className="relative rounded-2xl border border-border/60 bg-card p-4 shadow-md">
          <div className="absolute -top-3 right-6 z-10 flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm">
            <span className="flex -space-x-1.5">
              {onlineAvatarIds.map((img) => (
                <img
                  key={img}
                  src={`https://i.pravatar.cc/48?img=${img}`}
                  alt=""
                  className="h-6 w-6 rounded-full border-2 border-card object-cover"
                />
              ))}
            </span>
            <Text as="span" size="xs" weight="semibold" className="text-foreground">
              {onlineCountLabel}
            </Text>
          </div>

          <div className="absolute -right-2 top-16 z-10 max-w-[160px] rounded-xl border border-border bg-card p-3 shadow-lg">
            <div className="flex items-start gap-2">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BellOutlined className="text-xs" />
              </span>
              <div>
                <Text as="p" size="xs" weight="semibold" className="leading-4 text-foreground">
                  {notification.title}
                </Text>
                <Text as="p" size="xs" color="muted" className="mt-0.5">
                  {notification.timeAgo}
                </Text>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {kanbanColumns.map((column) => (
              <div key={column.title} className="rounded-xl bg-background p-2.5">
                <Text as="p" size="xs" weight="semibold" color="muted" className="mb-2 uppercase tracking-wide">
                  {column.title}
                </Text>

                <div className="space-y-2">
                  {column.cards.map((card) => (
                    <div key={card.title} className="rounded-lg border border-border bg-card p-2.5 shadow-sm">
                      <Text as="p" size="xs" weight="medium" className="leading-5 text-foreground">
                        {card.title}
                      </Text>
                      <span className={`mt-2 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold ${card.tagClass}`}>
                        {card.tag}
                      </span>
                      {card.progress ? (
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${card.progress}%` }} />
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 max-w-md">
          <Title level={3} className="text-foreground">
            {heading}
          </Title>
          <Paragraph size="base" className="mt-3 text-hero-text">
            {description}
          </Paragraph>

          <div className="mt-6 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserOutlined />
            </span>
            <Text as="p" size="sm" color="muted">
              {trustLabel}
            </Text>
          </div>
        </div>
      </AnimateOnScroll>
    </aside>
  );
}

export default React.memo(RegisterPreview);
