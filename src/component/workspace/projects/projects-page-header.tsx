import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { Paragraph, Title } from "../../ui/typography";

function ProjectsPageHeader() {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <Title level={2} className="text-2xl text-foreground lg:text-3xl">
          Projects
        </Title>
        <Paragraph size="sm" className="mt-1 text-muted">
          Manage and track your enterprise-level workflows.
        </Paragraph>
      </div>

      <Button type="primary" icon={<PlusOutlined />} size="large" className="font-semibold!">
        Create Project
      </Button>
    </div>
  );
}

export default React.memo(ProjectsPageHeader);
