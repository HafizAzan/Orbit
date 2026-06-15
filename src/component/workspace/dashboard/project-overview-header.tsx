import { FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { Paragraph, Title } from "../../ui/typography";

function ProjectOverviewHeader() {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <Title level={2} className="text-2xl text-foreground lg:text-3xl">
          Project Overview
        </Title>
        <Paragraph size="sm" className="mt-1 text-muted">
          Welcome back. Here&apos;s what&apos;s happening with your workspace today.
        </Paragraph>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button icon={<FilterOutlined />} size="large" className="font-semibold!">
          Filters
        </Button>
        <Button type="primary" icon={<PlusOutlined />} size="large" className="font-semibold!">
          New Project
        </Button>
      </div>
    </div>
  );
}

export default React.memo(ProjectOverviewHeader);
