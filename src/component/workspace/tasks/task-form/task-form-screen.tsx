import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../../../context/app-context";
import {
  getProjectWorkspacePath,
  getWorkspaceTaskHubPath,
} from "../../../../lib/workspace-routing";
import { useWorkspaceReturnTo } from "../../../../lib/workspace-navigation";
import useWorkspacePermissions from "../../../../hooks/use-workspace-permissions";
import { useAssignableProjectMembers } from "../../../../hooks/use-workspace-projects";
import { useProjects } from "../../../../hooks/use-workspace-projects";
import { getTask } from "../../../../api-services/task.service";
import { useCreateTask, useUpdateTask, workspaceTaskQueryKey } from "../../../../hooks/use-workspace-tasks";
import { useQueryClient } from "@tanstack/react-query";
import { mapApiTaskToFormValues } from "../../../../types/task.types";
import {
  DEFAULT_TASK_FORM_VALUES,
  getTaskProjectLabel,
  type TaskAssigneeOption,
  type TaskFormValues,
} from "../../../../data/workspace-task-form";
import { showApiErrorToast, showApiSuccessToast } from "../../../../lib/api-error";
import { syncTaskAttachments } from "../../../../lib/sync-task-attachments";
import { toast } from "../../../../lib/toast";
import { Paragraph, Title } from "../../../ui/typography";
import TaskFormFooter from "./task-form-footer";
import TaskFormMain from "./task-form-main";
import TaskFormSidebar from "./task-form-sidebar";
import WorkspaceBackLink from "../../common/workspace-back-link";

type TaskFormScreenProps = {
  mode: "create" | "edit";
  taskId?: string;
  initialValues?: TaskFormValues;
};

function TaskFormScreen({
  mode,
  taskId,
  initialValues = DEFAULT_TASK_FORM_VALUES,
}: TaskFormScreenProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const app = useAppContext();
  const { role } = useWorkspacePermissions();
  const { data: projects = [] } = useProjects();
  const { data: assignableMembers = [] } = useAssignableProjectMembers();
  const { mutateAsync: createTask } = useCreateTask();
  const { mutateAsync: updateTask } = useUpdateTask();
  const taskHubPath = getWorkspaceTaskHubPath(role);
  const taskHubLabel = role === "member" ? "My Tasks" : "Tasks";
  const { returnPath, returnLabel } = useWorkspaceReturnTo(taskHubPath, taskHubLabel);
  const [values, setValues] = useState<TaskFormValues>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialAttachmentsRef = useRef(initialValues.attachments);

  const isEdit = mode === "edit";
  const reporterName = app?.user?.name?.trim() || "You";
  const pageTitle = isEdit ? "Edit Task" : "Create New Task";

  const projectOptions = useMemo(
    () => projects.map((project) => ({ value: project.id, label: project.title })),
    [projects],
  );

  const assigneeOptions = useMemo<TaskAssigneeOption[]>(
    () =>
      assignableMembers.map((member) => ({
        id: member.id,
        name: member.name,
        initials: member.name
          .split(" ")
          .map((part) => part.charAt(0))
          .join("")
          .slice(0, 2)
          .toUpperCase(),
      })),
    [assignableMembers],
  );

  const projectLabel = useMemo(() => {
    return (
      projectOptions.find((option) => option.value === values.projectId)?.label ??
      getTaskProjectLabel(values.projectId, projectOptions.map((option) => ({
        id: option.value,
        title: option.label,
      })))
    );
  }, [projectOptions, values.projectId]);

  useEffect(() => {
    setValues(initialValues);
    initialAttachmentsRef.current = initialValues.attachments;
  }, [initialValues]);

  useEffect(() => {
    if (isEdit || values.projectId || projectOptions.length === 0) return;
    setValues((current) => ({ ...current, projectId: projectOptions[0].value }));
  }, [isEdit, projectOptions, values.projectId]);

  const breadcrumbs = useMemo(
    () => [
      { label: returnLabel, to: returnPath },
      { label: projectLabel, to: getProjectWorkspacePath(role, values.projectId) },
      { label: isEdit ? "Edit Task" : "Create Task" },
    ],
    [isEdit, projectLabel, returnLabel, returnPath, role, values.projectId],
  );

  const buildCreatePayload = useCallback(() => {
    return {
      projectId: values.projectId,
      title: values.title.trim(),
      description: values.description.trim(),
      status: values.status,
      priority: values.priority,
      assigneeId: values.assigneeId || undefined,
      dueDate: values.dueDate || undefined,
      estimatedHours: values.estimatedHours ?? undefined,
      labels: values.labels,
    };
  }, [values]);

  const buildUpdatePayload = useCallback(() => {
    return {
      title: values.title.trim(),
      description: values.description.trim(),
      status: values.status,
      priority: values.priority,
      assigneeId: values.assigneeId || null,
      dueDate: values.dueDate || null,
      estimatedHours: values.estimatedHours,
      labels: values.labels,
    };
  }, [values]);

  const refreshFormFromTask = useCallback(
    async (savedTaskId: string) => {
      const refreshed = await queryClient.fetchQuery({
        queryKey: workspaceTaskQueryKey(savedTaskId),
        queryFn: () => getTask(savedTaskId),
      });
      const mapped = mapApiTaskToFormValues(refreshed);
      setValues(mapped);
      initialAttachmentsRef.current = mapped.attachments;
    },
    [queryClient],
  );

  const persistAttachments = useCallback(
    async (savedTaskId: string) => {
      await syncTaskAttachments(savedTaskId, initialAttachmentsRef.current, values.attachments);
      await refreshFormFromTask(savedTaskId);
    },
    [refreshFormFromTask, values.attachments],
  );

  const validate = useCallback(() => {
    if (!values.title.trim()) {
      toast.error("Task title is required");
      return false;
    }

    if (!values.projectId) {
      toast.error("Project is required");
      return false;
    }

    return true;
  }, [values.projectId, values.title]);

  const handleSave = useCallback(async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      if (isEdit && taskId) {
        await updateTask({ taskId, data: buildUpdatePayload() });
        await persistAttachments(taskId);
        showApiSuccessToast("Task updated successfully");
      } else {
        const created = await createTask(buildCreatePayload());
        await persistAttachments(created.id);
        showApiSuccessToast("Task created successfully");
      }

      navigate(returnPath);
    } catch (error) {
      showApiErrorToast(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    buildCreatePayload,
    buildUpdatePayload,
    createTask,
    isEdit,
    navigate,
    persistAttachments,
    returnPath,
    taskId,
    updateTask,
    validate,
  ]);

  const handleSaveAndContinue = useCallback(async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      if (isEdit && taskId) {
        await updateTask({ taskId, data: buildUpdatePayload() });
        await persistAttachments(taskId);
        showApiSuccessToast("Task updated successfully");
      } else {
        const created = await createTask(buildCreatePayload());
        await persistAttachments(created.id);
        showApiSuccessToast("Task created successfully");
        setValues({
          ...DEFAULT_TASK_FORM_VALUES,
          projectId: values.projectId,
          attachments: [],
        });
        initialAttachmentsRef.current = [];
      }
    } catch (error) {
      showApiErrorToast(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    buildCreatePayload,
    buildUpdatePayload,
    createTask,
    isEdit,
    persistAttachments,
    taskId,
    updateTask,
    validate,
    values.projectId,
  ]);

  return (
    <div className="mx-auto max-w-8xl">
      <WorkspaceBackLink fallbackPath={returnPath} fallbackLabel={returnLabel} />

      <nav className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.label}>
            {index > 0 ? <span className="text-slate-300">›</span> : null}
            {crumb.to ? (
              <Link to={crumb.to} className="font-medium transition-colors hover:text-primary">
                {crumb.label}
              </Link>
            ) : (
              <span>{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      <Title level={2} className="mt-4 text-2xl text-foreground lg:text-3xl">
        {pageTitle}
      </Title>
      <Paragraph size="sm" className="mt-1 text-muted">
        {isEdit ? "Update task details and keep your squad aligned." : "Create a task for your project squad."}
      </Paragraph>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <TaskFormMain
          values={values}
          onChange={setValues}
          projectOptions={projectOptions}
          disableProject={isEdit}
        />
        <TaskFormSidebar
          values={values}
          reporterName={reporterName}
          onChange={setValues}
          assigneeOptions={assigneeOptions}
        />
      </div>

      <TaskFormFooter
        isEdit={isEdit}
        saving={isSubmitting}
        cancelPath={returnPath}
        onDiscard={() => setValues(initialValues)}
        onSave={handleSave}
        onSaveAndContinue={handleSaveAndContinue}
      />
    </div>
  );
}

export default React.memo(TaskFormScreen);
