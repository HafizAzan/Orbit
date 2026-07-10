import React from "react";
import { CheckOutlined } from "@ant-design/icons";
import KANBAN_HIGHLIGHTS from "../../data/kanban-features";
import { RESOURCES } from "../../lib/resources";
import AnimateOnScroll from "../common/animate-on-scroll";
import { Paragraph, Text, Title } from "../ui/typography";

function KanbanSection() {
  return (
    <section className="px-4 py-14 sm:px-6 nav:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 nav:grid-cols-2 nav:gap-12 lg:gap-16">
        <AnimateOnScroll variant="fade-left" className="flex flex-col gap-6 nav:gap-8">
          <div className="flex flex-col gap-4 nav:gap-5">
            <Text as="p" size="sm" weight="semibold" className="text-primary">
              Agile Execution
            </Text>

            <Title level={2} className="text-3xl text-zinc-800 nav:text-4xl lg:text-[2.75rem] lg:leading-tight">
              Manage projects with intuitive <br /> Kanban boards
            </Title>

            <Paragraph size="base" color="muted" className="max-w-xl">
              Visualize your pipeline from start to finish. Our Kanban interface allows for seamless drag-and-drop task movement, clear labeling, and
              instant status updates that keep everyone in sync.
            </Paragraph>
          </div>

          <ul className="flex flex-col gap-4">
            {KANBAN_HIGHLIGHTS.map((item, index) => (
              <li key={item} className="flex items-start gap-3">
                <AnimateOnScroll variant="fade-up" delay={index * 80} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
                    <CheckOutlined />
                  </span>
                  <Text as="span" size="base" color="muted">
                    {item}
                  </Text>
                </AnimateOnScroll>
              </li>
            ))}
          </ul>
        </AnimateOnScroll>

        <AnimateOnScroll variant="fade-right" delay={120} className="overflow-hidden rounded-[28px] border-4 border-white/90 bg-white p-2 nav:rounded-[32px] nav:border-8 nav:p-3">
          <img
            src={RESOURCES.IMAGES.KANBAN_LAPTOP}
            alt="Orbit Kanban board on laptop"
            className="h-auto w-full rounded-2xl object-cover nav:rounded-3xl"
          />
        </AnimateOnScroll>
      </div>
    </section>
  );
}

export default React.memo(KanbanSection);
