import React from "react";
import { Link } from "react-router-dom";
import { HELP_QUICK_LINKS } from "../../data/help";
import AnimateOnScroll from "../common/animate-on-scroll";
import { Paragraph, Text } from "../ui/typography";

function isExternalHref(href: string) {
  return href.startsWith("http") || href.startsWith("mailto:");
}

function HelpQuickLinks() {
  return (
    <section className="bg-background px-4 pb-10 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HELP_QUICK_LINKS.map((link, index) => {
          const Icon = link.icon;
          const content = (
            <>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-feature-sync text-primary">
                <Icon className="text-lg" />
              </span>
              <div className="min-w-0">
                <Text as="p" size="sm" weight="semibold" className="text-foreground">
                  {link.title}
                </Text>
                <Paragraph size="xs" className="mt-1 text-muted">
                  {link.description}
                </Paragraph>
              </div>
            </>
          );

          const className =
            "group flex h-full items-start gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md";

          return (
            <AnimateOnScroll key={link.id} variant="fade-up" delay={index * 60}>
              {isExternalHref(link.href) || link.href.startsWith("#") ? (
                <a href={link.href} className={className}>
                  {content}
                </a>
              ) : (
                <Link to={link.href} className={className}>
                  {content}
                </Link>
              )}
            </AnimateOnScroll>
          );
        })}
      </div>
    </section>
  );
}

export default React.memo(HelpQuickLinks);
