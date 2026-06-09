import { DownOutlined } from "@ant-design/icons";
import { useCallback, useState, type ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/utils";
import { Paragraph, Text } from "../ui/typography";
import type { FaqItem } from "../../data/faq-items";

type FaqAccordionProps = ComponentPropsWithoutRef<"div"> & {
  items: FaqItem[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
};

function FaqAccordion({
  items,
  defaultOpenId,
  allowMultiple = false,
  className,
  ...props
}: FaqAccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(() => {
    const initialId = defaultOpenId ?? items[0]?.id;
    return initialId ? [initialId] : [];
  });

  const toggleItem = useCallback(
    (id: string) => {
      setOpenIds((current) => {
        const isOpen = current.includes(id);

        if (allowMultiple) {
          return isOpen ? current.filter((itemId) => itemId !== id) : [...current, id];
        }

        return isOpen ? [] : [id];
      });
    },
    [allowMultiple],
  );

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);

        return (
          <article
            key={item.id}
            className="overflow-hidden rounded-xl bg-faq-surface nav:rounded-2xl"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left nav:px-6 nav:py-5"
              onClick={() => toggleItem(item.id)}
              aria-expanded={isOpen}
            >
              <Text as="span" size="base" weight="semibold" className="text-foreground">
                {item.question}
              </Text>
              <DownOutlined
                aria-hidden
                className={cn(
                  "shrink-0 text-sm text-muted transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </button>

            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-200 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <Paragraph size="sm" className="px-5 pb-4 text-hero-text nav:px-6 nav:pb-5">
                  {item.answer}
                </Paragraph>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default FaqAccordion;
export type { FaqAccordionProps };
