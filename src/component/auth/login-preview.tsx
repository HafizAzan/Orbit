import React from "react";
import { TeamOutlined } from "@ant-design/icons";
import { LOGIN_PREVIEW_DATA } from "../../data/auth-previews";
import AnimateOnScroll from "../common/animate-on-scroll";
import { Paragraph, Text, Title } from "../ui/typography";

function LoginPreview() {
  const {
    teamAvatarIds,
    velocityBars,
    kanbanColumns,
    testimonial,
    velocityLabel,
    velocityValue,
    teamPerformanceTitle,
    teamPerformanceUpdatedAt,
    productivityTitle,
  } = LOGIN_PREVIEW_DATA;

  return (
    <aside className="relative hidden overflow-hidden bg-login-panel px-8 py-10 lg:flex lg:flex-col lg:justify-center xl:px-12">
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

      <AnimateOnScroll immediate variant="fade-right" delay={150} className="relative mx-auto w-full max-w-xl space-y-5">
        <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <TeamOutlined />
              </span>
              <div>
                <Text as="p" size="sm" weight="semibold" className="text-foreground">
                  {teamPerformanceTitle}
                </Text>
                <Text as="p" size="xs" color="muted">
                  {teamPerformanceUpdatedAt}
                </Text>
              </div>
            </div>

            <div className="flex -space-x-2">
              {teamAvatarIds.map((img) => (
                <img
                  key={img}
                  src={`https://i.pravatar.cc/64?img=${img}`}
                  alt=""
                  className="h-8 w-8 rounded-full border-2 border-card object-cover"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
          <Title level={5} className="mb-4 text-foreground">
            {productivityTitle}
          </Title>

          <div className="grid grid-cols-3 gap-3">
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

        <div className="grid grid-cols-[1fr_auto] gap-4">
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <Paragraph size="sm" className="text-primary italic">
              &ldquo;{testimonial.quote}&rdquo;
            </Paragraph>
            <Text as="p" size="xs" color="muted" className="mt-3">
              — {testimonial.author}
            </Text>
          </div>

          <div className="flex w-28 flex-col justify-between rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
            <Text as="p" size="xs" color="muted">
              {velocityLabel}
            </Text>
            <Text as="p" size="sm" weight="bold" color="primary">
              {velocityValue}
            </Text>
            <div className="mt-2 flex h-14 items-end gap-1">
              {velocityBars.map((height, index) => (
                <span
                  key={index}
                  className="flex-1 rounded-sm bg-primary/80"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </AnimateOnScroll>
    </aside>
  );
}

export default React.memo(LoginPreview);
