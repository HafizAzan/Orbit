import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../../../context/app-context";
import { getProjectDetailPath } from "../../../../data/workspace-project-detail";
import {
  DEFAULT_TASK_FORM_VALUES,
  getTaskProjectLabel,
  type TaskFormValues,
} from "../../../../data/workspace-task-form";
import { useWorkspaceReturnTo } from "../../../../lib/workspace-navigation";
import { WORKSPACE_ROUTES } from "../../../../router/workspace-routes";
import { toast } from "../../../../lib/toast";
import { Paragraph, Title } from "../../../ui/typography";
import TaskFormFooter from "./task-form-footer";
import TaskFormMain from "./task-form-main";
import TaskFormSidebar from "./task-form-sidebar";
import WorkspaceBackLink from "../../common/workspace-back-link";

type TaskFormScreenProps = {
  mode: "create" | "edit";
  initialValues?: TaskFormValues;
};

function TaskFormScreen({ mode, initialValues = DEFAULT_TASK_FORM_VALUES }: TaskFormScreenProps) {
  const navigate = useNavigate();
  const app = useAppContext();
  const { returnPath, returnLabel } = useWorkspaceReturnTo(WORKSPACE_ROUTES.TASKS, "Tasks");
  const [values, setValues] = useState<TaskFormValues>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = mode === "edit";
  const reporterName = app?.user?.name?.trim() || "Alex Rivera";
  const pageTitle = isEdit ? "Edit Task" : "Create New Task";
  const projectLabel = getTaskProjectLabel(values.projectId);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const breadcrumbs = useMemo(
    () => [
      { label: returnLabel, to: returnPath },
      { label: projectLabel, to: getProjectDetailPath(values.projectId) },
      { label: isEdit ? "Edit Task" : "Create Task" },
    ],
    [isEdit, projectLabel, returnLabel, returnPath, values.projectId],
  );

  const validate = useCallback(() => {
    if (!values.title.trim()) {
      toast.error("Task title is required");
      return false;
    }

    return true;
  }, [values.title]);

  const handleSave = useCallback(async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success(isEdit ? "Task updated successfully" : "Task created successfully");
      navigate(returnPath);
    } finally {
      setIsSubmitting(false);
    }
  }, [isEdit, navigate, returnPath, validate]);

  const handleSaveAndContinue = useCallback(async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Task created successfully");
      setValues({
        ...DEFAULT_TASK_FORM_VALUES,
        projectId: values.projectId,
        assigneeId: values.assigneeId,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [validate, values.assigneeId, values.projectId]);

  const handleDiscard = useCallback(() => {
    setValues(initialValues);
    toast.info("Changes discarded");
  }, [initialValues]);

  return (
    <div className="mx-auto max-w-8xl pb-4">
      <WorkspaceBackLink
        fallbackPath={WORKSPACE_ROUTES.TASKS}
        fallbackLabel="Tasks"
        className="mb-4 inline-block text-sm font-medium text-primary transition-opacity hover:opacity-80"
      />

      <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.label}>
            {index > 0 ? <span>/</span> : null}
            {crumb.to ? (
              <Link to={crumb.to} className="font-medium text-primary transition-opacity hover:opacity-80">
                {crumb.label}
              </Link>
            ) : (
              <span className="font-medium text-foreground">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      <div className="mb-6">
        <Title level={2} className="text-2xl text-foreground lg:text-3xl">
          {pageTitle}
        </Title>
        <Paragraph size="sm" className="mt-1 text-muted">
          {isEdit
            ? "Update task details, assignment, and delivery timeline."
            : "Capture the work item, assign owners, and set delivery expectations."}
        </Paragraph>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <TaskFormMain values={values} onChange={setValues} />
        <TaskFormSidebar values={values} reporterName={reporterName} onChange={setValues} />
      </div>

      <TaskFormFooter
        isEdit={isEdit}
        saving={isSubmitting}
        cancelPath={returnPath}
        onDiscard={handleDiscard}
        onSave={() => void handleSave()}
        onSaveAndContinue={() => void handleSaveAndContinue()}
      />
    </div>
  );
}

export default React.memo(TaskFormScreen);
