import { Button } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../../../context/app-context";
import { DEFAULT_PROJECT_FORM_VALUES, type ProjectFormValues } from "../../../../data/workspace-project-form";
import { getProjectDetailPath } from "../../../../data/workspace-project-detail";
import { useGenerateProjectDraft } from "../../../../hooks/use-ai";
import { useAssignableProjectMembers, useCreateProject, useDeleteProject, useUpdateProject } from "../../../../hooks/use-workspace-projects";
import { showApiErrorToast, showApiSuccessToast } from "../../../../lib/api-error";
import { useWorkspaceReturnTo } from "../../../../lib/workspace-navigation";
import { WORKSPACE_ROUTES } from "../../../../router/workspace-routes";
import { mapFormValuesToCreateRequest } from "../../../../types/project.types";
import { toast } from "../../../../lib/toast";
import { Paragraph, Title } from "../../../ui/typography";
import AiGeneratePromptModal, {
  AiGenerateHeaderButton,
} from "../../common/ai-generate-prompt-modal";
import ProjectFormFields from "./project-form-fields";
import ProjectFormPreview from "./project-form-preview";
import DeleteProjectButton from "../delete-project-button";
import WorkspaceBackLink from "../../common/workspace-back-link";

type ProjectFormScreenProps = {
  mode: "create" | "edit";
  projectId?: string;
  initialValues?: ProjectFormValues;
  canDelete?: boolean;
};

function ProjectFormScreen({ mode, projectId, initialValues = DEFAULT_PROJECT_FORM_VALUES, canDelete = false }: ProjectFormScreenProps) {
  const navigate = useNavigate();
  const app = useAppContext();
  const { mutateAsync: createProject } = useCreateProject();
  const { mutateAsync: updateProject } = useUpdateProject();
  const { mutateAsync: deleteProject } = useDeleteProject();
  const { mutateAsync: generateProjectDraft, isPending: isAiGenerating } = useGenerateProjectDraft();
  const { data: assignableMembers = [] } = useAssignableProjectMembers();
  const { returnPath, returnLabel } = useWorkspaceReturnTo(WORKSPACE_ROUTES.PROJECTS, "Projects");
  const [values, setValues] = useState<ProjectFormValues>(initialValues);
  const [isKeyManual, setIsKeyManual] = useState(mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const isEdit = mode === "edit";
  const userId = app?.user?.id;
  const userName = app?.user?.name?.trim() || "You";
  const userRole = app?.user?.role;
  const canAssignLead = userRole === "owner" || userRole === "admin";
  const requiresDeliveryLead = userRole === "owner";
  const showExecutionSquad = userRole === "manager";
  const canUseAi = userRole === "owner" || userRole === "admin" || userRole === "manager";
  const resolvedLeadName =
    assignableMembers?.find((member) => member.id === values.leadUserId)?.name ?? (canAssignLead ? "Select delivery lead" : userName);
  const pageTitle = isEdit ? "Edit Project" : "Create New Project";
  const submitLabel = isEdit ? "Save Changes" : "Create Project";
  const showDelete = isEdit && canDelete;
  const formDisabled = isAiGenerating || isSubmitting;

  useEffect(() => {
    setValues(initialValues);
    setIsKeyManual(mode === "edit");
  }, [initialValues, mode]);

  useEffect(() => {
    if (isEdit || !userId || !userRole) return;

    if (userRole === "admin" && !values.leadUserId) {
      setValues((current) => ({ ...current, leadUserId: userId }));
    }
  }, [isEdit, userId, userRole, values.leadUserId]);

  const handleAiGenerate = useCallback(
    async ({ name, prompt }: { name: string; prompt: string }) => {
      try {
        const result = await generateProjectDraft({
          notes: prompt,
          projectName: isEdit ? undefined : name,
        });
        const draft = result.draft;

        setValues((current) => ({
          ...current,
          name: draft.name,
          key: draft.key,
          description: draft.description,
          category: draft.category,
          priority: draft.priority,
          startDate: draft.startDate || "",
          dueDate: draft.dueDate || "",
          visibility: "private",
          leadUserId: draft.leadUserId,
          memberIds: showExecutionSquad ? draft.memberIds : [],
        }));
        setIsKeyManual(true);
        setAiModalOpen(false);
        showApiSuccessToast("AI filled this form. Review the fields, then create or save.");
      } catch (error) {
        showApiErrorToast(error);
      }
    },
    [generateProjectDraft, isEdit, showExecutionSquad],
  );

  const handleSubmit = useCallback(async () => {
    if (!values.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    if (!values.key.trim()) {
      toast.error("Project key is required");
      return;
    }

    if (requiresDeliveryLead && !values.leadUserId) {
      toast.error("Select a delivery lead (admin or manager) for this project");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = mapFormValuesToCreateRequest({
        ...values,
        visibility: "private",
        memberIds: showExecutionSquad ? values.memberIds : [],
      });

      if (isEdit && projectId) {
        await updateProject({ projectId, data: payload });
        showApiSuccessToast("Project updated successfully");
        navigate(getProjectDetailPath(projectId));
        return;
      }

      const created = await createProject(payload);
      showApiSuccessToast("Project created successfully");
      navigate(getProjectDetailPath(created.id));
    } catch (error) {
      showApiErrorToast(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [createProject, isEdit, navigate, projectId, requiresDeliveryLead, showExecutionSquad, updateProject, values]);

  const handleDeleteProject = useCallback(async () => {
    if (!projectId) return;

    try {
      const result = await deleteProject(projectId);
      showApiSuccessToast(result.message);
      navigate(returnPath);
    } catch (error) {
      showApiErrorToast(error);
    }
  }, [deleteProject, navigate, projectId, returnPath]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        void handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSubmit]);

  return (
    <div className="mx-auto max-w-8xl">
      <AiGeneratePromptModal
        open={aiModalOpen}
        loading={isAiGenerating}
        entityLabel="project"
        requireName={!isEdit}
        initialName={values.name}
        initialPrompt={values.description}
        onClose={() => setAiModalOpen(false)}
        onGenerate={handleAiGenerate}
      />

      <WorkspaceBackLink
        fallbackPath={WORKSPACE_ROUTES.PROJECTS}
        fallbackLabel="Projects"
        className="mb-4 inline-block text-sm font-medium text-primary transition-opacity hover:opacity-80"
      />

      <nav className="mb-4 text-sm text-muted">
        <Link to={returnPath} className="font-medium text-primary transition-opacity hover:opacity-80">
          {returnLabel}
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-foreground">{pageTitle}</span>
      </nav>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Title level={2} className="text-2xl text-foreground lg:text-3xl">
            {pageTitle}
          </Title>
          <Paragraph size="sm" className="mt-1 text-muted">
            {isEdit
              ? "Update project details, delivery lead, timeline, and execution squad."
              : userRole === "owner"
                ? "Set up a new project and assign a manager or admin to lead delivery."
                : userRole === "manager"
                  ? "Create a project for your execution team and start assigning work."
                  : "Create a project and assign the team who will deliver it."}
          </Paragraph>
        </div>
        {canUseAi ? (
          <AiGenerateHeaderButton
            disabled={formDisabled}
            onClick={() => setAiModalOpen(true)}
          />
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <ProjectFormFields
            values={values}
            isKeyManual={isKeyManual}
            onChange={setValues}
            onKeyManualChange={setIsKeyManual}
            canAssignLead={canAssignLead}
            requiresDeliveryLead={requiresDeliveryLead}
            showExecutionSquad={showExecutionSquad}
            disabled={formDisabled}
            currentUserId={userId}
            currentUserName={userName}
          />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {showDelete && projectId ? (
              <DeleteProjectButton
                projectName={values.name.trim() || "this project"}
                onDelete={handleDeleteProject}
                className="w-full font-semibold! sm:w-auto"
              />
            ) : (
              <span className="hidden sm:block" />
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              {isEdit && projectId ? (
                <Link to={getProjectDetailPath(projectId)}>
                  <Button size="large" className="w-full font-semibold! sm:w-auto" disabled={formDisabled}>
                    Cancel
                  </Button>
                </Link>
              ) : (
                <Link to={returnPath}>
                  <Button size="large" className="w-full font-semibold! sm:w-auto" disabled={formDisabled}>
                    Cancel
                  </Button>
                </Link>
              )}
              <Button
                type="primary"
                size="large"
                className="w-full font-semibold! sm:w-auto"
                loading={isSubmitting}
                disabled={isAiGenerating}
                onClick={() => void handleSubmit()}
              >
                {submitLabel}
              </Button>
            </div>
          </div>
        </div>

        <ProjectFormPreview values={values} leadName={resolvedLeadName} />
      </div>
    </div>
  );
}

export default React.memo(ProjectFormScreen);
