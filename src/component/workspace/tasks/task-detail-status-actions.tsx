import { CheckCircleOutlined } from "@ant-design/icons";
import { Button, Select } from "antd";
import React, { useEffect, useState } from "react";
import type { ApiWorkspaceTask } from "../../../types/task.types";
import { TASK_STATUS_CONFIG, type WorkspaceTaskStatus } from "../../../data/workspace-tasks";
import { useUpdateTask } from "../../../hooks/use-workspace-tasks";
import { showApiErrorToast, showApiSuccessToast } from "../../../lib/api-error";
import { Paragraph, Text } from "../../ui/typography";

const MEMBER_STATUS_OPTIONS: WorkspaceTaskStatus[] = ["todo", "in_progress", "review", "done"];

type TaskDetailStatusActionsProps = {
  task: ApiWorkspaceTask;
};

function TaskDetailStatusActions({ task }: TaskDetailStatusActionsProps) {
  const { mutateAsync: updateTask, isPending } = useUpdateTask();
  const [status, setStatus] = useState<WorkspaceTaskStatus>(task.status);

  useEffect(() => {
    setStatus(task.status);
  }, [task.status]);

  const handleStatusChange = async (nextStatus: WorkspaceTaskStatus) => {
    setStatus(nextStatus);

    try {
      await updateTask({
        taskId: task.id,
        data: { status: nextStatus },
      });
      showApiSuccessToast(nextStatus === "done" ? "Task marked as complete." : "Task status updated.");
    } catch (error) {
      setStatus(task.status);
      showApiErrorToast(error);
    }
  };

  const handleMarkComplete = () => {
    void handleStatusChange("done");
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <Text as="p" size="sm" weight="semibold">
        Update progress
      </Text>
      <Paragraph size="sm" className="mt-1 text-muted">
        Move this task through your workflow or mark it complete when you are done.
      </Paragraph>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select
          size="large"
          value={status}
          disabled={isPending}
          className="w-full sm:max-w-xs"
          onChange={(value: WorkspaceTaskStatus) => {
            void handleStatusChange(value);
          }}
          options={MEMBER_STATUS_OPTIONS.map((value) => ({
            value,
            label: TASK_STATUS_CONFIG[value].label,
          }))}
        />

        {status !== "done" ? (
          <Button
            type="primary"
            size="large"
            icon={<CheckCircleOutlined />}
            loading={isPending}
            className="font-semibold!"
            onClick={handleMarkComplete}
          >
            Mark complete
          </Button>
        ) : null}
      </div>
    </section>
  );
}

export default React.memo(TaskDetailStatusActions);
