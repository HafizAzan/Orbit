import { CheckCircleOutlined, UndoOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import React, { useCallback, useState } from "react";
import type { ProjectStatus } from "../../../data/workspace-projects";
import { useUpdateProject } from "../../../hooks/use-workspace-projects";
import useWorkspacePermissions from "../../../hooks/use-workspace-permissions";
import { showApiErrorToast, showApiSuccessToast } from "../../../lib/api-error";
import { areAllProjectTasksDone } from "../../../lib/project-detail-utils";
import { ConfirmModal } from "../../ui/modal";
import { Text } from "../../ui/typography";

type ProjectStatusActionsProps = {
  projectId: string;
  projectName: string;
  status: ProjectStatus;
  completedTaskCount: number;
  taskCount: number;
  size?: "large" | "middle" | "small";
  className?: string;
};

function ProjectStatusActions({
  projectId,
  projectName,
  status,
  completedTaskCount,
  taskCount,
  size = "large",
  className,
}: ProjectStatusActionsProps) {
  const { can } = useWorkspacePermissions();
  const { mutateAsync: updateProject } = useUpdateProject();
  const [completeOpen, setCompleteOpen] = useState(false);
  const [reopenOpen, setReopenOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const canManageCompletion = can("project.complete");
  const allTasksDone = areAllProjectTasksDone(completedTaskCount, taskCount);
  const incompleteTaskCount = Math.max(taskCount - completedTaskCount, 0);
  const isCompleted = status === "completed";

  const handleMarkDone = useCallback(async () => {
    setLoading(true);

    try {
      await updateProject({
        projectId,
        data: { status: "completed" },
      });
      showApiSuccessToast(`${projectName} marked as done.`);
      setCompleteOpen(false);
    } catch (error) {
      showApiErrorToast(error);
    } finally {
      setLoading(false);
    }
  }, [projectId, projectName, updateProject]);

  const handleReopen = useCallback(async () => {
    setLoading(true);

    try {
      await updateProject({
        projectId,
        data: { status: "in_progress" },
      });
      showApiSuccessToast(`${projectName} reopened.`);
      setReopenOpen(false);
    } catch (error) {
      showApiErrorToast(error);
    } finally {
      setLoading(false);
    }
  }, [projectId, projectName, updateProject]);

  if (!canManageCompletion) {
    return null;
  }

  if (isCompleted) {
    return (
      <>
        <Button
          size={size}
          icon={<UndoOutlined />}
          className={className}
          onClick={() => setReopenOpen(true)}
        >
          Reopen Project
        </Button>

        <ConfirmModal
          open={reopenOpen}
          onClose={() => setReopenOpen(false)}
          onConfirm={handleReopen}
          title="Reopen project"
          description={
            <>
              Reopen <Text as="span" weight="semibold">{projectName}</Text>? The project status will return to
              In Progress so your team can continue delivery.
            </>
          }
          confirmText="Reopen Project"
          confirmLoading={loading}
          icon={<UndoOutlined />}
        />
      </>
    );
  }

  const completeButton = (
    <Button
      type="primary"
      size={size}
      icon={<CheckCircleOutlined />}
      className={className}
      disabled={!allTasksDone}
      onClick={() => setCompleteOpen(true)}
    >
      Mark as Done
    </Button>
  );

  return (
    <>
      {allTasksDone ? (
        completeButton
      ) : (
        <Tooltip
          title={
            taskCount === 0
              ? "Add and complete tasks before marking this project as done."
              : `${incompleteTaskCount} task(s) still incomplete. Complete all tasks first.`
          }
        >
          <span className="inline-flex">{completeButton}</span>
        </Tooltip>
      )}

      <ConfirmModal
        open={completeOpen}
        onClose={() => setCompleteOpen(false)}
        onConfirm={handleMarkDone}
        title="Mark project as done"
        description={
          <>
            Mark <Text as="span" weight="semibold">{projectName}</Text> as done? All {taskCount} task
            {taskCount === 1 ? "" : "s"} are complete. You can reopen the project later if needed.
          </>
        }
        confirmText="Mark as Done"
        confirmLoading={loading}
        icon={<CheckCircleOutlined />}
      />
    </>
  );
}

export default React.memo(ProjectStatusActions);
