import React from "react";
import { CONTACT_INFO_GROUPS } from "../../data/contact";
import { SOCIAL_LINKS } from "../../data/footer-links";
import { cn } from "../../lib/utils";

function ContactInfoCard() {
  return (
    <div className="flex h-full flex-col">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Get in touch</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Reach our support or sales team — we typically reply within one business day.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CONTACT_INFO_GROUPS.map((group) => {
          const GroupIcon = group.icon;
          const primaryItem = group.items[0];
          const secondaryItems = group.items.slice(1);

          return (
            <div
              key={group.id}
              className="rounded-xl border border-border/80 bg-card/80 p-4 backdrop-blur-sm transition-colors hover:border-primary/20"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <GroupIcon className="text-base" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{group.title}</p>
                  {primaryItem.href ? (
                    <a href={primaryItem.href} className="mt-0.5 block truncate text-sm text-primary hover:opacity-80">
                      {primaryItem.value}
                    </a>
                  ) : (
                    <p className="mt-0.5 text-sm text-muted">{primaryItem.value}</p>
                  )}
                </div>
              </div>

              {secondaryItems.length > 0 ? (
                <ul className="mt-3 space-y-1.5 border-t border-border/70 pt-3">
                  {secondaryItems.map((item) => (
                    <li key={item.id} className="text-sm text-muted">
                      {item.href ? (
                        <a href={item.href} className="font-medium text-foreground transition-colors hover:text-primary">
                          {item.value}
                        </a>
                      ) : (
                        <span className="font-medium text-foreground">{item.value}</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-auto border-t border-border/80 pt-6">
        <p className="text-xs font-semibold tracking-wide text-muted uppercase">Follow our journey</p>
        <div className="mt-3 flex items-center gap-2">
          {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full bg-card text-foreground shadow-sm",
                "transition-colors hover:bg-primary hover:text-white",
              )}
            >
              <Icon className="text-base" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default React.memo(ContactInfoCard);
