import React from "react";
import { Button, Space } from "antd";
import { Link } from "react-router-dom";
import { UN_AUTH_ROUTES } from "../../router/public-routes";
import { RESOURCES } from "../../lib/resources";
import { scrollToSection } from "../../lib/utils";
import AnimateOnScroll from "../common/animate-on-scroll";
import { Paragraph, Text, Title } from "../ui/typography";

function Feature() {
  return (
    <section className="bg-header-background" id="feature">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-10 sm:px-6 nav:grid-cols-2 nav:gap-12 nav:py-20 lg:px-10 lg:py-24">
        <AnimateOnScroll immediate variant="fade-up" className="flex w-full flex-col gap-6 nav:gap-8">
          <div className="flex flex-col gap-4 nav:gap-5">
            <Title level={1} className="text-3xl leading-tight font-bold sm:text-4xl nav:text-5xl lg:text-[3.25rem]">
              <Text className="text-zinc-800">Sync your workflow,</Text>
              <span className="hidden nav:inline"> </span>
              <br className="nav:hidden" />
              <Text color="primary">accelerate your growth</Text>
            </Title>

            <Paragraph size="base" color="hero-muted" className="max-w-xl text-sm text-hero-text sm:text-base">
              Experience the ultimate enterprise-grade project management tool. Unify your teams, automate mundane tasks, and deliver projects with
              precision.
            </Paragraph>
          </div>

          <Space wrap size={12} className="w-full nav:w-auto [&_.ant-space-item]:w-full sm:[&_.ant-space-item]:w-auto nav:[&_.ant-space-item]:w-auto">
            <Button
              type="text"
              size="middle"
              block
              className="h-auto! w-full bg-primary! px-5 py-4! text-sm! font-semibold! text-white! sm:w-auto sm:px-6 sm:py-5! sm:text-base!"
              onClick={() => scrollToSection("pricing", 0)}
            >
              Start 14-day Free Trial
            </Button>

            <Link to={UN_AUTH_ROUTES.REGISTER} className="block w-full sm:inline-block sm:w-auto">
              <Button
                type="link"
                size="middle"
                block
                className="h-auto! w-full border-2! border-brown-border! px-5 py-4! text-sm! font-semibold! text-black! sm:w-auto sm:px-6 sm:py-5! sm:text-base!"
              >
                Get Started
              </Button>
            </Link>
          </Space>
        </AnimateOnScroll>

        <AnimateOnScroll immediate variant="fade-right" delay={120} className="mx-auto w-[80%] overflow-hidden">
          <img src={RESOURCES.IMAGES.LAPTOP} alt="FlowSync dashboard preview" className="h-auto w-full object-contain" />
        </AnimateOnScroll>
      </div>
    </section>
  );
}

export default React.memo(Feature);
