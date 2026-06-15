import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import TasksTable from "../../component/workspace/tasks/tasks-table";
import { Paragraph, Title } from "../../component/ui/typography";

function WorkspaceTasks() {
  const createButton = (
    <Button type="primary" icon={<PlusOutlined />} size="large" className="font-semibold!">
      Create Task
    </Button>
  );

  return (
    <div className="mx-auto max-w-8xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Title level={2} className="text-2xl text-foreground lg:text-3xl">
            Tasks
          </Title>
          <Paragraph size="sm" className="mt-1 text-muted">
            Manage, track and assign team workflow efficiently.
          </Paragraph>
        </div>

        {createButton}
      </div>

      <TasksTable emptyAction={createButton} />
    </div>
  );
}

export default React.memo(WorkspaceTasks);
