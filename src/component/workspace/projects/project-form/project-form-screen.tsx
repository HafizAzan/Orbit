import { Button } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../../../context/app-context";
import { DEFAULT_PROJECT_FORM_VALUES, type ProjectFormValues } from "../../../../data/workspace-project-form";
import { getProjectDetailPath } from "../../../../data/workspace-project-detail";
import { useWorkspaceReturnTo } from "../../../../lib/workspace-navigation";
import { WORKSPACE_ROUTES } from "../../../../router/workspace-routes";
import { toast } from "../../../../lib/toast";
import { Paragraph, Title } from "../../../ui/typography";
import ProjectFormFields from "./project-form-fields";
import ProjectFormPreview from "./project-form-preview";
import DeleteProjectButton from "../delete-project-button";
import WorkspaceBackLink from "../../common/workspace-back-link";

type ProjectFormScreenProps = {
  mode: "create" | "edit";
  projectId?: string;
  initialValues?: ProjectFormValues;
};

function ProjectFormScreen({ mode, projectId, initialValues = DEFAULT_PROJECT_FORM_VALUES }: ProjectFormScreenProps) {
  const navigate = useNavigate();
  const app = useAppContext();
  const { returnPath, returnLabel } = useWorkspaceReturnTo(WORKSPACE_ROUTES.PROJECTS, "Projects");
  const [values, setValues] = useState<ProjectFormValues>(initialValues);
  const [isKeyManual, setIsKeyManual] = useState(mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = mode === "edit";
  const leadName = app?.user?.name?.trim() || "You";
  const pageTitle = isEdit ? "Edit Project" : "Create New Project";
  const submitLabel = isEdit ? "Save Changes" : "Create Project";

  useEffect(() => {
    setValues(initialValues);
    setIsKeyManual(mode === "edit");
  }, [initialValues, mode]);

  const handleSubmit = useCallback(async () => {
    if (!values.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    if (!values.key.trim()) {
      toast.error("Project key is required");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (isEdit && projectId) {
        toast.success("Project updated successfully");
        navigate(getProjectDetailPath(projectId));
        return;
      }

      toast.success("Project created successfully");
      navigate(returnPath);
    } finally {
      setIsSubmitting(false);
    }
  }, [isEdit, navigate, projectId, returnPath, values.key, values.name]);

  const handleDeleteProject = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success(`"${values.name.trim()}" deleted successfully`);
    navigate(returnPath);
  }, [navigate, returnPath, values.name]);

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

      <div className="mb-6">
        <Title level={2} className="text-2xl text-foreground lg:text-3xl">
          {pageTitle}
        </Title>
        <Paragraph size="sm" className="mt-1 text-muted">
          {isEdit ? "Update your project details, timeline, and team assignments." : "Set up your workspace and define your project's goals."}
        </Paragraph>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <ProjectFormFields values={values} isKeyManual={isKeyManual} onChange={setValues} onKeyManualChange={setIsKeyManual} />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {isEdit && projectId ? (
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
                  <Button size="large" className="w-full font-semibold! sm:w-auto">
                    Cancel
                  </Button>
                </Link>
              ) : (
                <Link to={returnPath}>
                  <Button size="large" className="w-full font-semibold! sm:w-auto">
                    Cancel
                  </Button>
                </Link>
              )}
              <Button
                type="primary"
                size="large"
                className="w-full font-semibold! sm:w-auto"
                loading={isSubmitting}
                onClick={() => void handleSubmit()}
              >
                {submitLabel}
              </Button>
            </div>
          </div>
        </div>

        <ProjectFormPreview values={values} leadName={leadName} />
      </div>
    </div>
  );
}

export default React.memo(ProjectFormScreen);
