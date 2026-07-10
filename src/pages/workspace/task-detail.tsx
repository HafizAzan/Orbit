import React from "react";
import { useParams } from "react-router-dom";
import PageSeo from "../../component/seo/page-seo";
import MarkdownContent from "../../component/common/markdown-content";
import QueryPageGuard from "../../component/common/query-page-guard";
import TaskAiTipCard from "../../component/workspace/tasks/task-ai-tip-card";
import TaskDetailAttachments from "../../component/workspace/tasks/task-detail-attachments";
import TaskDetailHeader from "../../component/workspace/tasks/task-detail-header";
import TaskDetailSidebar from "../../component/workspace/tasks/task-detail-sidebar";
import TaskDetailStatusActions from "../../component/workspace/tasks/task-detail-status-actions";
import WorkspaceNotFound from "../../component/workspace/workspace-not-found";
import { TaskDetailSkeleton } from "../../component/skeletons";
import { useAppContext } from "../../context/app-context";
import useWorkspacePermissions from "../../hooks/use-workspace-permissions";
import { useTask } from "../../hooks/use-workspace-tasks";
import { getWorkspaceHomePath } from "../../lib/workspace-routing";
import { Paragraph, Text } from "../../component/ui/typography";

function WorkspaceTaskDetail() {
  const { taskId = "" } = useParams();
  const app = useAppContext();
  const { can } = useWorkspacePermissions();
  const canUpdateStatus = can("task.status_update");
  const taskQuery = useTask(taskId);
  const { data: task } = taskQuery;

  return (
    <QueryPageGuard
      query={taskQuery}
      loading={<TaskDetailSkeleton />}
      errorTitle="Unable to load task"
      homePath={getWorkspaceHomePath(app?.user?.role)}
    >
      {!task ? (
        <WorkspaceNotFound
          title="Task not found"
          description="This task does not exist or you do not have access to it."
        />
      ) : (
        <div className="mx-auto max-w-8xl">
          <PageSeo title="Task Detail" description="View and manage task details and status." noIndex />
          <TaskDetailHeader task={task} />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
              {canUpdateStatus ? <TaskDetailStatusActions task={task} /> : null}
              <TaskAiTipCard task={task} />

              <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
                <Text as="p" size="sm" weight="semibold">Description</Text>

                {task.description.trim() ? (
                  <MarkdownContent content={task.description} className="mt-4 text-foreground" />
                ) : (
                  <Paragraph size="sm" className="mt-4 text-muted">
                    No description provided for this task.
                  </Paragraph>
                )}
              </section>

              <TaskDetailAttachments attachments={task.attachments ?? []} />
            </div>

            <TaskDetailSidebar task={task} />
          </div>
        </div>
      )}
    </QueryPageGuard>
  );
}

export default React.memo(WorkspaceTaskDetail);
