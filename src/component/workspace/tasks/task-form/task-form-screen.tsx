import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../../../context/app-context";
import {
  getProjectWorkspacePath,
  getWorkspaceTaskHubPath,
} from "../../../../lib/workspace-routing";
import { useWorkspaceReturnTo } from "../../../../lib/workspace-navigation";
import useWorkspacePermissions from "../../../../hooks/use-workspace-permissions";
import { useProject, useProjectsForSelect } from "../../../../hooks/use-workspace-projects";
import { getTask } from "../../../../api-services/task.service";
import {
  useCreateTask,
  useUpdateTask,
  workspaceTaskQueryKey,
} from "../../../../hooks/use-workspace-tasks";
import { useQueryClient } from "@tanstack/react-query";
import { mapApiTaskToFormValues } from "../../../../types/task.types";
import {
  DEFAULT_TASK_FORM_VALUES,
  getTaskProjectLabel,
  type TaskAssigneeOption,
  type TaskFormValues,
} from "../../../../data/workspace-task-form";
import { useGenerateTaskDraft } from "../../../../hooks/use-ai";
import { showApiErrorToast, showApiSuccessToast } from "../../../../lib/api-error";
import { syncTaskAttachments } from "../../../../lib/sync-task-attachments";
import { toast } from "../../../../lib/toast";
import { Paragraph, Title } from "../../../ui/typography";
import AiGeneratePromptModal, {
  AiGenerateHeaderButton,
} from "../../common/ai-generate-prompt-modal";
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
  const taskHubPath = getWorkspaceTaskHubPath(role);
  const taskHubLabel = role === "member" ? "My Tasks" : "Tasks";
  const { data: projects = [] } = useProjectsForSelect();
  const { returnPath, returnLabel } = useWorkspaceReturnTo(taskHubPath, taskHubLabel);
  const [values, setValues] = useState<TaskFormValues>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialAttachmentsRef = useRef(initialValues.attachments);
  const { data: selectedProject, isLoading: isProjectMembersLoading } = useProject(
    values.projectId || null,
  );
  const { mutateAsync: createTask } = useCreateTask();
  const { mutateAsync: updateTask } = useUpdateTask();
  const { mutateAsync: generateTaskDraft, isPending: isAiGenerating } = useGenerateTaskDraft();
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const isEdit = mode === "edit";
  const reporterName = app?.user?.name?.trim() || "You";
  const pageTitle = isEdit ? "Edit Task" : "Create New Task";
  const canUseAi = role === "admin" || role === "manager";
  const formDisabled = isAiGenerating || isSubmitting;

  const projectOptions = useMemo(
    () => projects.map((project) => ({ value: project.id, label: project.title })),
    [projects],
  );

  const currentUserId = app?.user?.id;

  const assigneeOptions = useMemo<TaskAssigneeOption[]>(() => {
    const members = selectedProject?.members ?? [];

    const toOption = (member: (typeof members)[number]): TaskAssigneeOption => ({
      id: member.id,
      name: member.id === currentUserId ? `${member.name} (Me)` : member.name,
      role: member.role,
      initials: member.name
        .split(" ")
        .map((part) => part.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    });

    if (role === "admin") {
      return members
        .filter((member) => (member.role ?? "").toLowerCase() === "manager")
        .map(toOption);
    }

    if (role === "manager") {
      // Members on the project, plus the manager themself.
      return members
        .filter((member) => {
          const orgRole = (member.role ?? "").toLowerCase();
          if (orgRole === "member") return true;
          return Boolean(currentUserId && member.id === currentUserId);
        })
        .map(toOption);
    }

    return members.map(toOption);
  }, [currentUserId, role, selectedProject?.members]);

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

  useEffect(() => {
    if (!values.assigneeId) return;

    const isValidAssignee = assigneeOptions.some((option) => option.id === values.assigneeId);
    if (!isValidAssignee) {
      setValues((current) => ({ ...current, assigneeId: "" }));
    }
  }, [assigneeOptions, values.assigneeId]);

  // Admin: default each new task to the project delivery lead (manager).
  useEffect(() => {
    if (isEdit || role !== "admin" || !selectedProject) return;
    if (values.assigneeId) return;

    const leadId = selectedProject.leadUserId;
    const defaultManager =
      (leadId && assigneeOptions.find((option) => option.id === leadId)) ??
      assigneeOptions[0] ??
      null;

    if (!defaultManager) return;

    setValues((current) =>
      current.assigneeId ? current : { ...current, assigneeId: defaultManager.id },
    );
  }, [assigneeOptions, isEdit, role, selectedProject, values.assigneeId]);

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

  const handleAiGenerate = useCallback(
    async ({ name, prompt }: { name: string; prompt: string }) => {
      if (!values.projectId) {
        toast.error("Select a project first, then use AI Generate.");
        return;
      }

      try {
        const result = await generateTaskDraft({
          projectId: values.projectId,
          notes: prompt,
          taskTitle: isEdit ? undefined : name,
        });
        const draft = result.draft;

        setValues((current) => ({
          ...current,
          title: draft.title,
          description: draft.description,
          status: draft.status,
          priority: draft.priority,
          estimatedHours: draft.estimatedHours,
          assigneeId: draft.assigneeId ?? "",
          dueDate: draft.dueDate || "",
          labels: draft.labels,
        }));
        setAiModalOpen(false);
        showApiSuccessToast("AI filled this task form. Review, then save.");
      } catch (error) {
        showApiErrorToast(error);
      }
    },
    [generateTaskDraft, isEdit, values.projectId],
  );

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
      <AiGeneratePromptModal
        open={aiModalOpen}
        loading={isAiGenerating}
        entityLabel="task"
        requireName={!isEdit}
        initialName={values.title}
        initialPrompt={values.description.replace(/<[^>]+>/g, " ").trim()}
        onClose={() => setAiModalOpen(false)}
        onGenerate={handleAiGenerate}
      />

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

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Title level={2} className="text-2xl text-foreground lg:text-3xl">
            {pageTitle}
          </Title>
          <Paragraph size="sm" className="mt-1 text-muted">
            {isEdit
              ? "Update task details and keep your squad aligned."
              : "Create a task for your project squad."}
          </Paragraph>
        </div>
        {canUseAi ? (
          <AiGenerateHeaderButton
            disabled={formDisabled}
            onClick={() => {
              if (!values.projectId) {
                toast.error("Select a project first, then use AI Generate.");
                return;
              }
              setAiModalOpen(true);
            }}
          />
        ) : null}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <TaskFormMain
          values={values}
          onChange={setValues}
          projectOptions={projectOptions}
          disableProject={isEdit || formDisabled}
        />
        <TaskFormSidebar
          values={values}
          reporterName={reporterName}
          onChange={setValues}
          assigneeOptions={assigneeOptions}
          assigneeLoading={isProjectMembersLoading}
          hasSelectedProject={Boolean(values.projectId)}
          assigneeHint={
            role === "admin"
              ? "Defaults to the project manager. You can pick another manager on this project."
              : role === "manager"
                ? "Assign a workspace member — or yourself — from this project."
                : "Only people on the selected project can be assigned."
          }
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
